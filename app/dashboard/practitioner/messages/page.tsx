"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Search } from "lucide-react"
import { useState } from "react"

export default function PractitionerMessagesPage() {
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")

  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate securely with your patients</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-green-100">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversations
              </CardTitle>
              <CardDescription>Search patients and recent chats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-10" />
              </div>
              <div className="text-sm text-muted-foreground">No conversations. Connect to backend.</div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-green-100">
            <CardHeader>
              <CardTitle className="font-heading">Chat</CardTitle>
              <CardDescription>Select a conversation to start messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-64 border rounded-md border-green-100 bg-white/50 p-3 overflow-auto text-sm text-muted-foreground">
                No messages to display.
              </div>
              <div className="flex gap-2">
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
                <Button className="bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PractitionerLayout>
  )
}


