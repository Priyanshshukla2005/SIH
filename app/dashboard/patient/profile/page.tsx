"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, updateUserProfile } from "@/lib/firebase"

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", age: "", phone: "", city: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const prof = await getUserProfile(user.uid)
      if (prof) {
        setForm({
          name: prof.name ?? "",
          email: prof.email ?? "",
          age: (prof.age ?? "").toString(),
          phone: prof.phone ?? "",
          city: prof.city ?? "",
        })
      }
    }
    load()
  }, [user?.uid])

  const save = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      await updateUserProfile(user.uid, {
        name: form.name,
        email: form.email,
        age: form.age ? Number(form.age) : undefined,
        phone: form.phone,
        city: form.city,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requiredRole="patient">
      <PatientLayout>
        <div className="space-y-6">
          <h1 className="font-heading font-bold text-2xl">Profile</h1>

          <Card className="border-green-100">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Button className="bg-primary" onClick={save} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PatientLayout>
    </AuthGuard>
  )
}


