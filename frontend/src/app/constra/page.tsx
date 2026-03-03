"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  ShoppingCart, 
  Award, 
  Play, 
  AlertCircle,
  ChevronRight,
  RefreshCw
} from "lucide-react"

interface PendingTask {
  id: string
  category: string
  count: number
  icon: React.ReactNode
  description: string
  urgent?: boolean
}

const pendingTasks: PendingTask[] = [
  {
    id: "registration",
    category: "Registration",
    count: 0,
    icon: <FileText className="w-5 h-5" />,
    description: "Pending registration approvals",
  },
  {
    id: "orders",
    category: "Pending Orders",
    count: 3,
    icon: <ShoppingCart className="w-5 h-5" />,
    description: "Orders awaiting processing",
    urgent: true,
  },
  {
    id: "awards",
    category: "Award/Shortlisting Notices",
    count: 16,
    icon: <Award className="w-5 h-5" />,
    description: "New award and shortlisting notifications",
    urgent: true,
  },
  {
    id: "ntp",
    category: "Notice To Proceed",
    count: 15,
    icon: <Play className="w-5 h-5" />,
    description: "Pending notice to proceed documents",
    urgent: true,
  },
]

export default function MyConstraPage() {
  const totalPending = pendingTasks.reduce((sum, task) => sum + task.count, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Pending Tasks</h2>
          <p className="text-gray-600 mt-1">Overview of items requiring your attention</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#002D5D] to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Pending</p>
                <p className="text-3xl font-bold">{totalPending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Urgent Items</p>
                <p className="text-3xl font-bold text-orange-600">34</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Response Rate</p>
                <p className="text-3xl font-bold text-blue-600">94%</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks Table */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D]">Task Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {pendingTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.count > 0 ? "bg-blue-100 text-[#002D5D]" : "bg-gray-100 text-gray-400"
                  }`}>
                    {task.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{task.category}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {task.urgent && task.count > 0 && (
                    <Badge variant="destructive" className="text-xs">Action Required</Badge>
                  )}
                  <Button 
                    variant={task.count > 0 ? "default" : "ghost"}
                    className={`min-w-[80px] gap-1 ${
                      task.count > 0 
                        ? "bg-[#002D5D] hover:bg-blue-800 text-white" 
                        : "text-gray-400 cursor-default"
                    }`}
                    disabled={task.count === 0}
                  >
                    <span className="font-bold">{task.count}</span>
                    {task.count > 0 && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-[#002D5D]" />
            </div>
            <div>
              <h3 className="font-medium text-[#002D5D]">View Awards</h3>
              <p className="text-sm text-gray-500">Check latest bid results</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium text-green-700">NTP Documents</h3>
              <p className="text-sm text-gray-500">Download NTP forms</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <h3 className="font-medium text-orange-700">Manage Orders</h3>
              <p className="text-sm text-gray-500">Process pending orders</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
