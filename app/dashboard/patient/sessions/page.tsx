"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { createAppointment, listAppointmentsByUser, updateAppointment, deleteAppointment } from "@/lib/firebase"

type Appointment = {
  id: string
  patientId: string
  practitionerId: string
  therapyType: string
  date: string
  status: "pending" | "approved" | "cancelled" | "completed"
}

export default function SessionsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [open, setOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)

  const [therapyType, setTherapyType] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.uid) return
      const data = await listAppointmentsByUser({ uid: user.uid, role: "patient" })
      setAppointments(data as Appointment[])
    }
    fetchAppointments()
  }, [user?.uid])

  const upcoming = useMemo(() => appointments.filter(a => new Date(a.date) >= new Date()), [appointments])
  const past = useMemo(() => appointments.filter(a => new Date(a.date) < new Date()), [appointments])

  const resetForm = () => {
    setTherapyType("")
    setDate("")
    setTime("")
    setEditing(null)
  }

  const submit = async () => {
    if (!user?.uid || !therapyType || !date || !time) return
    setFormLoading(true)
    const iso = new Date(`${date}T${time}:00`).toISOString()
    try {
      if (editing) {
        await updateAppointment({ id: editing.id, data: { therapyType, date: iso } })
      } else {
        await createAppointment({ patientId: user.uid, practitionerId: "default", therapyType, date: iso })
      }
      const data = await listAppointmentsByUser({ uid: user.uid, role: "patient" })
      setAppointments(data as Appointment[])
      setOpen(false)
      resetForm()
    } finally {
      setFormLoading(false)
    }
  }

  const onEdit = (a: Appointment) => {
    setEditing(a)
    setOpen(true)
    setTherapyType(a.therapyType)
    const dt = new Date(a.date)
    setDate(dt.toISOString().slice(0, 10))
    setTime(dt.toISOString().slice(11, 16))
  }

  const onDelete = async (id: string) => {
    if (!user?.uid) return
    await deleteAppointment(id)
    const data = await listAppointmentsByUser({ uid: user.uid, role: "patient" })
    setAppointments(data as Appointment[])
  }

  return (
    <AuthGuard requiredRole="patient">
      <PatientLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-heading font-bold text-2xl">Your Sessions</h1>
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
              <DialogTrigger asChild>
                <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" />New Session</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Session" : "Book Session"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label>Therapy Type</Label>
                    <Input placeholder="e.g. Abhyanga" value={therapyType} onChange={(e) => setTherapyType(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Time</Label>
                      <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
                  <Button onClick={submit} disabled={formLoading}>{editing ? "Save" : "Book"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled treatments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming sessions.</p>}
                  {upcoming.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border border-green-100">
                      <div className="space-y-1">
                        <p className="font-medium">{a.therapyType}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(a.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <Badge variant="secondary">{a.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => onEdit(a)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" onClick={() => onDelete(a.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle>Past Sessions</CardTitle>
                  <CardDescription>Your completed or cancelled treatments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {past.length === 0 && <p className="text-sm text-muted-foreground">No past sessions.</p>}
                  {past.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border border-green-100">
                      <div className="space-y-1">
                        <p className="font-medium">{a.therapyType}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(a.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <Badge variant="secondary">{a.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => onEdit(a)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" onClick={() => onDelete(a.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PatientLayout>
    </AuthGuard>
  )
}


