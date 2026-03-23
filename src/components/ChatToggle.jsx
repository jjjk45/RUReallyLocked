import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ChatWindow from './ChatWindow'
import { useUnreadCount } from '../hooks/useUnreadCount'

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

  // ========== ADDED HERE: Get unread message count ==========
  const unreadCount = useUnreadCount(currentUser?.id, conversationId)

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={styles.chatButton}
      >
        <span style={styles.chatIcon}>💬</span>
        {/* ========== ADDED HERE: Unread count badge ========== */}
        {unreadCount > 0 && (
          <span style={styles.unreadBadge}>{unreadCount}</span>
        )}
        {!isChatOpen && unreadCount === 0 && <span style={styles.chatBadge}>Chat</span>}
      </button>

      {/* Chat Panel */}
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
    background: '#8b1a2e',
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
    fontWeight: 'bold',
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
    borderBottom: '1px solid #e0d8cc',
    background: '#faf7f2',
  },
  chatTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#2d2416',
    margin: 0,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#9b8c7e',
  },
  chatContent: {
    flex: 1,
    overflow: 'hidden',
  },
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  document.head.appendChild(style)
}