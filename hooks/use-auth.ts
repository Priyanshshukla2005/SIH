"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type UserRole = "patient" | "practitioner"

interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  role?: UserRole
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      if (s?.user) {
        setUser({ uid: s.user.id, email: s.user.email, displayName: s.user.user_metadata?.name || null })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({ uid: session.user.id, email: session.user.email, displayName: session.user.user_metadata?.name || null })
      } else {
        setUser(null)
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const register = async ({ name, email, password, role }: { name: string; email: string; password: string; role: UserRole }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })
    if (error) throw error
    const uid = data.user?.id
    if (uid) {
      await supabase.from("profiles").upsert({ id: uid, name, email, role })
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
