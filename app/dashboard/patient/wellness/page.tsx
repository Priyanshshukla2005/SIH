"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { getWellnessMetrics, upsertWellnessMetrics } from "@/lib/firebase"

export default function WellnessPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({
    overall: 80,
    clarity: 75,
    energy: 70,
    sleep: 65,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      const data = await getWellnessMetrics(user.uid)
      if (data) {
        setMetrics({
          overall: data.overall ?? 80,
          clarity: data.clarity ?? 75,
          energy: data.energy ?? 70,
          sleep: data.sleep ?? 65,
        })
      }
    }
    fetchData()
  }, [user?.uid])

  const save = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      await upsertWellnessMetrics(user.uid, metrics)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requiredRole="patient">
      <PatientLayout>
        <div className="space-y-6">
          <h1 className="font-heading font-bold text-2xl">Wellness</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle>Overall Wellness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="overall">Score (0-100)</Label>
                <Input id="overall" type="number" min={0} max={100} value={metrics.overall} onChange={(e) => setMetrics({ ...metrics, overall: Number(e.target.value) })} />
              </CardContent>
            </Card>
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle>Mental Clarity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="clarity">Score (0-100)</Label>
                <Input id="clarity" type="number" min={0} max={100} value={metrics.clarity} onChange={(e) => setMetrics({ ...metrics, clarity: Number(e.target.value) })} />
              </CardContent>
            </Card>
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle>Energy Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="energy">Score (0-100)</Label>
                <Input id="energy" type="number" min={0} max={100} value={metrics.energy} onChange={(e) => setMetrics({ ...metrics, energy: Number(e.target.value) })} />
              </CardContent>
            </Card>
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle>Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="sleep">Score (0-100)</Label>
                <Input id="sleep" type="number" min={0} max={100} value={metrics.sleep} onChange={(e) => setMetrics({ ...metrics, sleep: Number(e.target.value) })} />
              </CardContent>
            </Card>
          </div>

          <Button className="bg-primary" onClick={save} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </div>
      </PatientLayout>
    </AuthGuard>
  )
}


