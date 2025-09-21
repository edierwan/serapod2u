import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Serapod2u - your QR/RFID product movement system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>📦 Orders</CardTitle>
            <CardDescription>Track and manage orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - comprehensive order management system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📍 Tracking</CardTitle>
            <CardDescription>Monitor product movements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - real-time QR/RFID tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Campaigns</CardTitle>
            <CardDescription>Manage marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - lucky draws, redemptions, and rewards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📂 Master Data</CardTitle>
            <CardDescription>Product and entity management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - products, manufacturers, distributors, shops
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔔 Notifications</CardTitle>
            <CardDescription>System alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - email, WhatsApp, and push notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
            <CardDescription>Configure your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Profile, preferences, and system settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}