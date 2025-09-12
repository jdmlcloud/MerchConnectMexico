"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Package, 
  FileText, 
  BarChart3,
  HelpCircle,
  Bell,
  LogOut
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Features", href: "/admin/features", icon: Settings },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">MerchConnect</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
          <Bell className="mr-3 h-4 w-4" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
          <HelpCircle className="mr-3 h-4 w-4" />
          Help
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
