"use client"

import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function PractitionerSettingsPage() {
  return (
    <PractitionerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Settings</h1>
          <p className="text-muted-foreground">Preferences and notifications</p>
        </div>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="font-heading">Notifications</CardTitle>
            <CardDescription>Configure appointment and message alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts">Email Alerts</Label>
              <Switch id="emailAlerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsAlerts">SMS Alerts</Label>
              <Switch id="smsAlerts" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="font-heading">Availability</CardTitle>
            <CardDescription>Set your working hours</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PractitionerLayout>
  )
}


