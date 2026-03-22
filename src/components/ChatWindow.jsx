import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function ChatWindow({ partnership, currentUser, partner }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get or create conversation
  useEffect(() => {
    async function getOrCreateConversation() {
      if (!partnership) return

      // Check if conversation exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('partnership_id', partnership.id)
        .maybeSingle()

      if (convError) {
        console.error('Error checking conversation:', convError)
        return
      }

      if (existingConv) {
        setConversationId(existingConv.id)
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({ partnership_id: partnership.id })
          .select()
          .single()

        if (createError) {
          console.error('Error creating conversation:', createError)
        } else {
          setConversationId(newConv.id)
        }
      }
    }

    getOrCreateConversation()
  }, [partnership])

  // Load messages
  useEffect(() => {
    if (!conversationId) return

    async function loadMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
      } else {
        setMessages(data)
        
        // Mark messages as read
        const unreadMessages = data.filter(m => !m.is_read && m.sender_id !== currentUser.id)
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessages.map(m => m.id))
        }
      }
    }

    loadMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
          // Mark as read if it's from partner
          if (payload.new.sender_id !== currentUser.id) {
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId, currentUser.id])

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId) return

    setLoading(true)
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUser.id,
        message: newMessage.trim()
      })

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setNewMessage('')
      inputRef.current?.focus()
    }
    setLoading(false)
  }

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString()
  }

  return (
    <div style={styles.container}>
      {/* Chat Header */}
      <div style={styles.header}>
        <div style={styles.partnerInfo}>
          <div style={styles.partnerAvatar}>
            {partner?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <div style={styles.partnerName}>{partner?.full_name || 'Partner'}</div>
            <div style={styles.partnerStatus}>online</div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyEmoji}>💬</span>
            <p>No messages yet. Say hello to your accountability partner!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender_id === currentUser.id
            return (
              <div
                key={msg.id || idx}
                style={{
                  ...styles.messageRow,
                  justifyContent: isOwn ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isOwn ? styles.ownBubble : styles.partnerBubble)
                  }}
                >
                  <div style={styles.messageText}>{msg.message}</div>
                  <div style={styles.messageTime}>{formatTime(msg.created_at)}</div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form style={styles.inputArea} onSubmit={sendMessage}>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          style={{ ...styles.sendButton, opacity: loading || !newMessage.trim() ? 0.5 : 1 }}
          disabled={loading || !newMessage.trim()}
        >
          ➤
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#faf7f2',
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #e0d8cc',
    background: '#fff',
  },
  partnerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#8b1a2e',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 600,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2d2416',
  },
  partnerStatus: {
    fontSize: 12,
    color: '#4a7c6f',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#9b8c7e',
  },
  emptyEmoji: {
    fontSize: 48,
    display: 'block',
    marginBottom: 12,
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: 16,
    position: 'relative',
  },
  ownBubble: {
    background: '#8b1a2e',
    color: '#fff',
    borderBottomRightRadius: 4,
  },
  partnerBubble: {
    background: '#fff',
    color: '#2d2416',
    borderBottomLeftRadius: 4,
    border: '1px solid #e0d8cc',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'right',
  },
  inputArea: {
    display: 'flex',
    padding: '16px 24px',
    borderTop: '1px solid #e0d8cc',
    background: '#fff',
    gap: 12,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e0d8cc',
    borderRadius: 24,
    fontSize: 14,
    background: '#faf7f2',
    outline: 'none',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#8b1a2e',
    color: '#fff',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
}