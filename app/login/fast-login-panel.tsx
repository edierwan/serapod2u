'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type RoleCode = 'hq_admin' | 'power_user' | 'manufacturer' | 'warehouse' | 'distributor' | 'shop'

const ROLES: { code: RoleCode; label: string }[] = [
  { code: 'hq_admin', label: 'HQ Admin' },
  { code: 'power_user', label: 'Power User' },
  { code: 'manufacturer', label: 'Manufacturer' },
  { code: 'warehouse', label: 'Warehouse' },
  { code: 'distributor', label: 'Distributor' },
  { code: 'shop', label: 'Shop' },
]

export function FastLoginPanel() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFastLogin = async (roleCode: RoleCode) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/dev/fast-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleCode }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Fast login as ${roleCode} successful!`)
        router.push('/app/dashboard')
      } else {
        toast.error(data.error || 'Fast login failed')
      }
    } catch (error) {
      toast.error('Fast login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-800">
          🚀 FAST LOGIN (DEV ONLY)
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Quick authentication for development and testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((role) => (
            <Button
              key={role.code}
              variant="outline"
              size="sm"
              onClick={() => handleFastLogin(role.code)}
              disabled={loading}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              {role.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}