"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getUserProfile, updateUserProfile, signUpUser, loginUser, logoutUser } from "@/lib/firebase"

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
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid)
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: profile?.role as UserRole | undefined,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string) => {
    await loginUser({ email, password })
  }

  const register = async ({ name, email, password, role }: { name: string; email: string; password: string; role: UserRole }) => {
    await signUpUser({ name, email, password, role })
  }

  const logout = async () => {
    await logoutUser()
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
