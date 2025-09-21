import { redirect } from 'next/navigation'

export default function HomePage() {
  // Always redirect to login from root
  redirect('/login')
}