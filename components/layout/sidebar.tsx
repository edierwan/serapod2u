'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  Receipt,
  MapPin,
  History,
  AlertTriangle,
  Gift,
  RotateCcw,
  Award,
  Database,
  Users,
  Store,
  Bell,
  Settings,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: Home,
  },
  {
    title: 'Order Management',
    href: '#',
    icon: Package,
    children: [
      { title: 'Orders', href: '/app/orders', icon: ShoppingCart },
      { title: 'Purchase Orders', href: '/app/purchase-orders', icon: FileText },
      { title: 'Invoices', href: '/app/invoices', icon: FileText },
      { title: 'Payments', href: '/app/payments', icon: CreditCard },
      { title: 'Receipts', href: '/app/receipts', icon: Receipt },
    ],
  },
  {
    title: 'Tracking',
    href: '#',
    icon: MapPin,
    children: [
      { title: 'Case Movements', href: '/app/tracking/case-movements', icon: MapPin },
      { title: 'Scan History', href: '/app/tracking/scan-history', icon: History },
      { title: 'Blocked / Returned', href: '/app/tracking/blocked-returned', icon: AlertTriangle },
    ],
  },
  {
    title: 'Campaigns',
    href: '#',
    icon: Gift,
    children: [
      { title: 'Lucky Draw', href: '/app/campaigns/lucky-draw', icon: Gift },
      { title: 'Redeem', href: '/app/campaigns/redeem', icon: RotateCcw },
      { title: 'Rewards (Points)', href: '/app/campaigns/rewards', icon: Award },
    ],
  },
  {
    title: 'Master Data',
    href: '#',
    icon: Database,
    children: [
      { title: 'Products', href: '/app/master-data/products', icon: Package },
      { title: 'Manufacturers', href: '/app/master-data/manufacturers', icon: Users },
      { title: 'Distributors', href: '/app/master-data/distributors', icon: Users },
      { title: 'Shops', href: '/app/master-data/shops', icon: Store },
    ],
  },
  {
    title: 'Notifications',
    href: '/app/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <div className={cn(
            'flex items-center px-2 py-2 text-sm font-medium text-gray-600',
            level > 0 && 'pl-8'
          )}>
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </div>
          <div className="space-y-1">
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </div>
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
          level > 0 && 'pl-8',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <item.icon className="mr-3 h-4 w-4" />
        {item.title}
      </Link>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-4 border-b">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => renderNavItem(item))}
        </nav>
      </ScrollArea>
    </div>
  )
}