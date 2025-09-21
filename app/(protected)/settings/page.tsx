'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Profile {
  id: string
  role_code: string
  full_name: string | null
  avatar_url: string | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('Error fetching profile:', error)
          } else {
            setProfile(data)
            setFullName(data.full_name || '')
          }
        }
      } catch (error) {
        console.error('Error getting profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id)

      if (error) {
        toast.error('Error updating profile')
      } else {
        toast.success('Profile updated successfully')
        setProfile({ ...profile, full_name: fullName })
      }
    } catch (error) {
      toast.error('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const formatRole = (roleCode: string) => {
    return roleCode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const isPrivilegedUser = profile?.role_code === 'hq_admin' || profile?.role_code === 'power_user'

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile & Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
          {isPrivilegedUser && (
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input
                  value={profile ? formatRole(profile.role_code) : ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value="Contact admin to change email"
                  disabled
                  className="bg-muted"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Coming soon - configure email notification preferences</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">WhatsApp Notifications</h4>
                  <p className="text-sm text-muted-foreground">Coming soon - configure WhatsApp notification preferences</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Coming soon - configure browser push notification preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isPrivilegedUser && (
          <TabsContent value="danger" className="space-y-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Administrative actions with system-wide impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="font-medium text-red-800">System Administration</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Coming soon - advanced administrative functions for HQ Admin and Power Users only
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}