import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

const activities = [
  {
    id: 1,
    user: "Juan Pérez",
    action: "created a new product",
    target: "iPhone 15 Case",
    time: "2 minutes ago",
    type: "product" as const,
  },
  {
    id: 2,
    user: "María García",
    action: "published a page",
    target: "About Us",
    time: "15 minutes ago",
    type: "page" as const,
  },
  {
    id: 3,
    user: "Carlos López",
    action: "updated inventory",
    target: "Samsung Galaxy S24",
    time: "1 hour ago",
    type: "inventory" as const,
  },
  {
    id: 4,
    user: "Ana Martínez",
    action: "enabled feature",
    target: "Advanced Analytics",
    time: "2 hours ago",
    type: "feature" as const,
  },
  {
    id: 5,
    user: "Luis Rodríguez",
    action: "created RFQ",
    target: "Bulk Order #1234",
    time: "3 hours ago",
    type: "rfq" as const,
  },
]

const typeColors = {
  product: "bg-blue-100 text-blue-800",
  page: "bg-green-100 text-green-800",
  inventory: "bg-yellow-100 text-yellow-800",
  feature: "bg-purple-100 text-purple-800",
  rfq: "bg-orange-100 text-orange-800",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${typeColors[activity.type]}`}
                  >
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
