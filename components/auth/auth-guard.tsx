"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "patient" | "practitioner"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mock authentication check - replace with real auth logic
    const checkAuth = () => {
      // Simulate checking authentication status
      const mockAuth = localStorage.getItem("mockAuth")
      const mockRole = localStorage.getItem("mockRole")

      if (mockAuth === "true") {
        if (requiredRole && mockRole !== requiredRole) {
          router.push("/auth/login")
          return
        }
        setIsAuthenticated(true)
      } else {
        router.push("/auth/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
