import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Users, Package, FileText, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Products",
    value: "567",
    change: "+8%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Published Pages",
    value: "89",
    change: "+23%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Revenue",
    value: "$12,345",
    change: "+15%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
