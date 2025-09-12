import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, Settings, Users, Package } from "lucide-react"

const actions = [
  {
    title: "Add Product",
    description: "Create a new product in your inventory",
    icon: Package,
    href: "/admin/inventory/new",
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Configure Features",
    description: "Enable or disable platform features",
    icon: Settings,
    href: "/admin/features",
  },
  {
    title: "Create Page",
    description: "Build a new landing page",
    icon: Plus,
    href: "/admin/pages/new",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 justify-start"
                asChild
              >
                <a href={action.href}>
                  <Icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
