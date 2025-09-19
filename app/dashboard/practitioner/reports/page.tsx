"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default function PractitionerReportsPage() {
  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Reports</h1>
            <p className="text-muted-foreground">Generate and export clinical and business reports</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Appointment Summary
              </CardTitle>
              <CardDescription>Placeholder analytics - connect to backend later</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">No data to display.</CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Patient Outcomes
              </CardTitle>
              <CardDescription>Placeholder analytics - connect to backend later</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">No data to display.</CardContent>
          </Card>
        </div>
      </div>
    </PractitionerLayout>
  )
}


