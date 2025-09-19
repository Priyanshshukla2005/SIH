"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { listMessages, sendMessage } from "@/lib/firebase"

type Message = { id: string; fromUid: string; toUid: string; text: string; createdAt?: any }

export default function MessagesPage() {
  const { user } = useAuth()
  // For demo, chat with a fixed practitioner id; replace with selection later
  const practitionerId = "practitioner_default"
  const threadId = user?.uid ? `${user.uid}_${practitionerId}` : ""
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    if (!threadId) return
    const data = await listMessages({ threadId })
    setMessages(data as Message[])
  }

  useEffect(() => {
    fetchMessages()
    // In a real app, subscribe to snapshots for realtime updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!user?.uid || !text.trim()) return
    setLoading(true)
    try {
      await sendMessage({ threadId, fromUid: user.uid, toUid: practitionerId, text })
      setText("")
      await fetchMessages()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requiredRole="patient">
      <PatientLayout>
        <div className="space-y-6">
          <h1 className="font-heading font-bold text-2xl">Messages</h1>
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle>Chat with your practitioner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[420px] overflow-y-auto space-y-2 p-2 bg-green-50/50 rounded border border-green-100">
                {messages.map(m => (
                  <div key={m.id} className={`max-w-[70%] px-3 py-2 rounded-lg ${m.fromUid === user?.uid ? "ml-auto bg-primary text-white" : "mr-auto bg-white border border-green-100"}`}>
                    <p className="text-sm">{m.text}</p>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
                <Button onClick={send} disabled={loading || !text.trim()}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PatientLayout>
    </AuthGuard>
  )
}


