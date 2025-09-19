"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PractitionerProfilePage() {
  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your practitioner information</p>
        </div>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="font-heading">Basic Information</CardTitle>
            <CardDescription>Placeholders for name, email, specialization</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Dr. Priya Sharma" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="priya.sharma@ayursutra.com" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" placeholder="Panchakarma, Ayurveda" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PractitionerLayout>
  )
}


