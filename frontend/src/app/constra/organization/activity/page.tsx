"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  UserPlus, 
  Gavel, 
  CheckCircle, 
  Upload,
  Edit,
  Clock
} from "lucide-react"

interface Activity {
  id: number
  type: "document" | "user" | "bid" | "project" | "profile"
  description: string
  performedBy: string
  timestamp: string
  status?: string
}

const activitiesData: Activity[] = [
  {
    id: 1,
    type: "document",
    description: "Uploaded DTI Registration Certificate",
    performedBy: "Admin",
    timestamp: "2026-03-05 09:30 AM",
    status: "Completed",
  },
  {
    id: 2,
    type: "bid",
    description: "Submitted bid for Highway Expansion Project",
    performedBy: "MARC JUSTIN ARZADON",
    timestamp: "2026-03-04 02:15 PM",
    status: "Under Evaluation",
  },
  {
    id: 3,
    type: "user",
    description: "Added new consultant: Engr. Maria Santos",
    performedBy: "Admin",
    timestamp: "2026-03-03 11:00 AM",
    status: "Active",
  },
  {
    id: 4,
    type: "profile",
    description: "Updated company profile information",
    performedBy: "Admin",
    timestamp: "2026-03-02 04:45 PM",
    status: "Completed",
  },
  {
    id: 5,
    type: "project",
    description: "School Building Construction marked as Completed",
    performedBy: "System",
    timestamp: "2026-03-01 10:00 AM",
    status: "Completed",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="w-4 h-4 text-blue-500" />
    case "user":
      return <UserPlus className="w-4 h-4 text-green-500" />
    case "bid":
      return <Gavel className="w-4 h-4 text-purple-500" />
    case "project":
      return <CheckCircle className="w-4 h-4 text-orange-500" />
    case "profile":
      return <Edit className="w-4 h-4 text-gray-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">Activity Log</h2>
        <p className="text-gray-600">Track recent activities and changes in your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activitiesData.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>By: {activity.performedBy}</span>
                    <span>|</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
                {activity.status && (
                  <Badge 
                    className={
                      activity.status === "Completed" 
                        ? "bg-green-100 text-green-700" 
                        : activity.status === "Active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {activity.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {activitiesData.length === 0 && (
            <p className="text-center text-gray-500 py-8">No activities found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
