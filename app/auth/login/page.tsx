"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { loginUser, signInWithGoogle } from "@/lib/firebase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("patient")
  const router = useRouter()
  const { login } = useAuth()
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPassword, setPatientPassword] = useState("")
  const [pracEmail, setPracEmail] = useState("")
  const [pracPassword, setPracPassword] = useState("")

  const handleLogin = async (e: React.FormEvent, userType: string) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const email = userType === "patient" ? patientEmail : pracEmail
      const password = userType === "patient" ? patientPassword : pracPassword
      await loginUser({ email, password })
      // Let Firebase hook continue to manage session for app state if both are used
      router.push(userType === "patient" ? "/dashboard/patient" : "/dashboard/practitioner")
    } catch (err) {
      console.error(err)
      alert("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">AyurSutra</h1>
              <p className="text-sm text-muted-foreground">Panchakarma Management</p>
            </div>
          </div>
        </div>

        <Card className="border-green-100 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue your wellness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="font-medium">
                  Patient
                </TabsTrigger>
                <TabsTrigger value="practitioner" className="font-medium">
                  Practitioner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={(e) => handleLogin(e, "patient")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email Address</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-green-200 focus:border-primary"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="patient-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="border-green-200 focus:border-primary pr-10"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Patient"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="practitioner">
                <form onSubmit={(e) => handleLogin(e, "practitioner")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-email">Email Address</Label>
                    <Input
                      id="practitioner-email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-green-200 focus:border-primary"
                      value={pracEmail}
                      onChange={(e) => setPracEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="practitioner-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="border-green-200 focus:border-primary pr-10"
                        value={pracPassword}
                        onChange={(e) => setPracPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Practitioner"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button type="button" variant="outline" className="w-full" onClick={async () => {
                setIsLoading(true)
                try {
                  await signInWithGoogle()
                  router.push("/dashboard/patient")
                } catch (e) {
                  console.error(e)
                  alert("Google sign-in failed")
                } finally {
                  setIsLoading(false)
                }
              }}>
                Sign in with Google
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
