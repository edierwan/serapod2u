import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage your notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🔔 Notification Center</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will display system notifications, alerts, and updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}