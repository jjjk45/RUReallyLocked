import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useUnreadCount(userId, conversationId) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId || !conversationId) return

    async function fetchUnreadCount() {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .eq('is_read', false)
        .neq('sender_id', userId)

      if (!error && count !== null) {
        setUnreadCount(count)
      }
    }

    fetchUnreadCount()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`unread:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (payload.new.sender_id !== userId) {
            setUnreadCount(prev => prev + 1)
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [userId, conversationId])

  return unreadCount
}