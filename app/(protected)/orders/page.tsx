import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all orders in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📦 Order Management</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will allow you to view, create, and manage orders from manufacturers to distributors and shops.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}