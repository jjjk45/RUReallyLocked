import { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function ChatDrawer({ partnership, currentUser, partner, isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div style={styles.overlay} onClick={onClose} />
      )}

      {/* Drawer */}
      <div style={{ ...styles.drawer, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.drawerHeader}>
          <h3 style={styles.drawerTitle}>Messages</h3>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>
        <div style={styles.drawerContent}>
          <ChatWindow
            partnership={partnership}
            currentUser={currentUser}
            partner={partner}
          />
        </div>
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    background: '#fff',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e0d8cc',
    background: '#faf7f2',
  },
  drawerTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#2d2416',
    margin: 0,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#9b8c7e',
  },
  drawerContent: {
    flex: 1,
    overflow: 'hidden',
  },
}