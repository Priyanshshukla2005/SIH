"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, Plus, Search } from "lucide-react"
import { useState } from "react"

export default function PractitionerAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Appointments</h1>
            <p className="text-muted-foreground">View and manage all scheduled sessions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-200 focus:border-primary"
            />
          </div>
          <Button variant="outline" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="font-heading">All Appointments</CardTitle>
                <CardDescription>Placeholder list bound to backend later</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                No appointments loaded. Connect to backend to populate.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="font-heading">Pending</CardTitle>
                <CardDescription>Awaiting practitioner approval</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">No data</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="font-heading">Approved</CardTitle>
                <CardDescription>Confirmed upcoming sessions</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">No data</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="font-heading">Cancelled</CardTitle>
                <CardDescription>Recently cancelled appointments</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">No data</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PractitionerLayout>
  )
}


