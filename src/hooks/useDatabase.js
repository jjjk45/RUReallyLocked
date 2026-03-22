import { supabase } from '../supabaseClient'

export function useDatabase() {

  // Create user profile after signup
  const createProfile = async (userId, userData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        full_name: userData.full_name,
        email: userData.email,
        school: userData.school,
        year: userData.year,
        bio: userData.bio
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  // Save user's goal and collateral
  const saveGoal = async (userId, goalType, collateralType) => {
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        user_id: userId,
        goal_type: goalType,
        collateral_type: collateralType
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  const findPotentialPartners = async (userId, goalType) => {
    // Step 1: get IDs of users already partnered with current user
    const { data: existingPartnerships } = await supabase
      .from('partnerships')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    const excludedIds = new Set([userId])
    existingPartnerships?.forEach(p => {
      excludedIds.add(p.user1_id)
      excludedIds.add(p.user2_id)
    })

    // Step 2: query goals excluding those users
    const { data, error } = await supabase
      .from('goals')
      .select(`
        user_id,
        collateral_type,
        profiles:user_id (
          full_name,
          school,
          year,
          major,
          bio
        )
      `)
      .eq('goal_type', goalType)
      .not('user_id', 'in', `(${[...excludedIds].join(',')})`)

    if (error) throw error
    return data || []
  }

  const createPartnership = async (user1Id, user2Id, goalType) => {
    const { data, error } = await supabase
      .from('partnerships')
      .insert([{
        user1_id: user1Id,
        user2_id: user2Id,
        goal_type: goalType,
        status: 'active'
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  const recordCheckIn = async (partnershipId, userId) => {
    const today = new Date().toISOString().split('T')[0]

    // Check if already checked in today
    const { data: existing } = await supabase
      .from('check_ins')
      .select()
      .eq('partnership_id', partnershipId)
      .eq('user_id', userId)
      .eq('date', today)

    if (existing && existing.length > 0) {
      throw new Error('Already checked in today')
    }

    const { data, error } = await supabase
      .from('check_ins')
      .insert([{
        partnership_id: partnershipId,
        user_id: userId,
        date: today,
        status: 'on_time'
      }])
      .select()

    if (error) throw error

    const { data: partnerCheck } = await supabase
      .from('check_ins')
      .select()
      .eq('partnership_id', partnershipId)
      .eq('date', today)

    return {
      checkIn: data[0],
      bothCheckedIn: partnerCheck && partnerCheck.length === 2
    }
  }

  const getCheckInHistory = async (partnershipId, userId) => {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('partnership_id', partnershipId)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(60)  // Last 60 days

    if (error) throw error
    return data || []
  }

  const getCurrentStreak = async (partnershipId, userId) => {
    const { data, error } = await supabase
      .from('check_ins')
      .select('date')
      .eq('partnership_id', partnershipId)
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error

    if (!data || data.length === 0) return 0

    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    let currentDate = new Date(today)

    for (let i = 0; i < data.length; i++) {
      const checkDate = new Date(data[i].date)
      const expectedDate = new Date(currentDate)

      // Check if dates match (allowing for timezone differences)
      if (checkDate.toDateString() === expectedDate.toDateString()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getActivePartnership = async (userId) => {
    const { data, error } = await supabase
      .from('partnerships')
      .select(`
        *,
        user1:user1_id (full_name, school, year, major),
        user2:user2_id (full_name, school, year, major)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error  // PGRST116 = no rows returned
    return data
  }

  const setCheckInWindow = async (partnershipId, startTime, endTime) => {
    const { data, error } = await supabase
      .from('partnerships')
      .update({
        check_in_window_start: startTime,
        check_in_window_end: endTime
      })
      .eq('id', partnershipId)
      .select()

    if (error) throw error
    return data[0]
  }

  const reportMissedCheckIn = async (partnershipId, missedUserId) => {
    const { data, error } = await supabase
      .from('collateral_owed')
      .insert([{
        partnership_id: partnershipId,
        user_id: missedUserId,
        reason: 'missed_checkin',
        status: 'pending'
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  const markCollateralPaid = async (collateralId) => {
    const { data, error } = await supabase
      .from('collateral_owed')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', collateralId)
      .select()

    if (error) throw error
    return data[0]
  }

  const getUserGoalAndCollateral = async (userId) => {
    const { data, error } = await supabase
      .from('goals')
      .select('goal_type, collateral_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  //need to think up a smart way to run this once every day
  const checkMissedCheckIns = async (partnershipId, userId, daysAgo = 1) => { //daysAgo for catching up, risky though
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    const dateStr = date.toISOString().split('T')[0]

    const { data: checkIn } = await supabase
      .from('check_ins')
      .select()
      .eq('partnership_id', partnershipId)
      .eq('user_id', userId)
      .eq('date', dateStr)

    if (!checkIn || checkIn.length === 0) {
      await reportMissedCheckIn(partnershipId, userId) //creates a new db row
      return true
    }

    return false
  }

  //run AFTER checkMissingCheckIns
  const getPendingCollateral = async (partnershipId, userId) => {
    const { data, error } = await supabase
      .from('collateral_owed')
      .select()
      .eq('partnership_id', partnershipId)
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (error) throw error
    return data.length > 0
  }

  return {
    createProfile,
    saveGoal,
    findPotentialPartners,
    createPartnership,
    recordCheckIn,
    getCheckInHistory,
    getCurrentStreak,
    getActivePartnership,
    setCheckInWindow,
    reportMissedCheckIn,
    markCollateralPaid,
    checkMissedCheckIns,
    getUserGoalAndCollateral,
    getPendingCollateral
  }
}