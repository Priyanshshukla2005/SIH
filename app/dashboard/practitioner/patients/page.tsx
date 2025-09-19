"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Plus, Search, UserPlus } from "lucide-react"
import { useState } from "react"

export default function PractitionerPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Patients</h1>
            <p className="text-muted-foreground">Manage your patient list and records</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
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
              placeholder="Search patients..."
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

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="font-heading">All Patients</CardTitle>
            <CardDescription>Placeholder list. Connect to backend to populate.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">No patients loaded.</CardContent>
        </Card>
      </div>
    </PractitionerLayout>
  )
}


