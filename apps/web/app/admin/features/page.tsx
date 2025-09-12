import { DashboardLayout } from "../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card"
import { Button } from "../../../src/components/ui/button"
import { Badge } from "../../../src/components/ui/badge"
import { Switch } from "../../../src/components/ui/switch"

const features = [
  {
    id: "proposal-generator",
    name: "Proposal Generator",
    description: "AI-powered tool to generate custom proposals for workshops",
    enabled: true,
    category: "AI Tools",
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Detailed analytics and reporting for organizations",
    enabled: false,
    category: "Analytics",
  },
  {
    id: "bulk-orders",
    name: "Bulk Orders",
    description: "Allow bulk ordering and inventory management",
    enabled: true,
    category: "Inventory",
  },
  {
    id: "custom-branding",
    name: "Custom Branding",
    description: "Custom logos, colors, and branding for organizations",
    enabled: false,
    category: "Customization",
  },
  {
    id: "api-access",
    name: "API Access",
    description: "REST API access for third-party integrations",
    enabled: true,
    category: "Integration",
  },
  {
    id: "white-label",
    name: "White Label",
    description: "Complete white-label solution for enterprise clients",
    enabled: false,
    category: "Enterprise",
  },
]

export default function FeaturesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
            <p className="text-gray-600">Enable or disable features for different plans and organizations.</p>
          </div>
          <Button>Add New Feature</Button>
        </div>

        <div className="grid gap-6">
          {features.map((feature) => (
            <Card key={feature.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{feature.name}</span>
                      <Badge variant="outline">{feature.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  <Switch checked={feature.enabled} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    View Usage
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}