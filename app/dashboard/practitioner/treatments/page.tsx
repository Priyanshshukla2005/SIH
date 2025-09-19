"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Stethoscope } from "lucide-react"

export default function PractitionerTreatmentsPage() {
  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Treatments</h1>
            <p className="text-muted-foreground">Manage treatment plans and therapy protocols</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Treatment
          </Button>
        </div>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Treatment Library
            </CardTitle>
            <CardDescription>Placeholder grid for treatments. Bind to backend later.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">No treatments found.</CardContent>
        </Card>
      </div>
    </PractitionerLayout>
  )
}


