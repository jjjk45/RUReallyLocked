import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ChatWindow from './ChatWindow'
import { useUnreadCount } from '../hooks/useUnreadCount'
import { colors } from '../styles/colors'

export default function ChatToggle({ partnership, currentUser, partner }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [conversationId, setConversationId] = useState(null)

  useEffect(() => {
    async function getConversationId() {
      if (!partnership) return

      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('partnership_id', partnership.id)
        .maybeSingle()

      if (!error && data) {
        setConversationId(data.id)
      }
    }

    getConversationId()
  }, [partnership])

  const unreadCount = useUnreadCount(currentUser?.id, conversationId)

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={styles.chatButton}
      >
        <span style={styles.chatIcon}>💬</span>
        {unreadCount > 0 && (
          <span style={styles.unreadBadge}>{unreadCount}</span>
        )}
        {!isChatOpen && unreadCount === 0 && <span style={styles.chatBadge}>Chat</span>}
      </button>

      {isChatOpen && (
        <div style={styles.chatPanel}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>Messages</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
          <div style={styles.chatContent}>
            <ChatWindow
              partnership={partnership}
              currentUser={currentUser}
              partner={partner}
            />
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '24px',
    left: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: colors.primary,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
    zIndex: 1000,
  },
  chatIcon: {
    fontSize: '24px',
  },
  chatBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#22c55e',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '12px',
  },
  unreadBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#ff4444',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '12px',
    minWidth: '18px',
    textAlign: 'center',
    fontWeight: 700,
    zIndex: 1001,
  },
  chatPanel: {
    position: 'fixed',
    bottom: '100px',
    left: '24px',
    width: '380px',
    height: '500px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease',
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.border}`,
    background: colors.bg,
  },
  chatTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: colors.text,
    margin: 0,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: colors.textMuted,
  },
  chatContent: {
    flex: 1,
    overflow: 'hidden',
  },
}
