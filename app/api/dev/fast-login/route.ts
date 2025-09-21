import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

type RoleCode = 'hq_admin' | 'power_user' | 'manufacturer' | 'warehouse' | 'distributor' | 'shop'

export async function POST(request: NextRequest) {
  // Security check: only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Fast login is not available in production' },
      { status: 403 }
    )
  }

  if (process.env.NEXT_PUBLIC_ENABLE_FAST_LOGIN !== 'true') {
    return NextResponse.json(
      { error: 'Fast login is disabled' },
      { status: 403 }
    )
  }

  try {
    const { roleCode }: { roleCode: RoleCode } = await request.json()

    if (!roleCode) {
      return NextResponse.json(
        { error: 'Role code is required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const email = `dev+${roleCode}@serapod2u.local`
    const password = 'dev123456'

    // Try to sign up the user first (this will fail if user exists, which is fine)
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: `Dev ${roleCode.replace('_', ' ').toUpperCase()}`,
      },
    })

    // Upsert the profile
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: (await adminClient.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id,
        role_code: roleCode,
        full_name: `Dev ${roleCode.replace('_', ' ').toUpperCase()}`,
      })

    if (profileError) {
      console.error('Profile upsert error:', profileError)
    }

    // Sign in the user
    const { data, error } = await adminClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Set the session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: data.user,
      roleCode 
    })

    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error) {
    console.error('Fast login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}