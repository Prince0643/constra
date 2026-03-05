"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  UserPlus, 
  Gavel, 
  Award, 
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload
} from "lucide-react"

interface HistoryRecord {
  id: number
  date: string
  time: string
  action: string
  description: string
  performedBy: string
  type: "profile" | "document" | "bid" | "award" | "verification"
}

const historyData: HistoryRecord[] = [
  {
    id: 1,
    date: "2026-03-05",
    time: "09:30 AM",
    action: "Profile Updated",
    description: "Updated company address and contact information",
    performedBy: "Marc Justin Arzadon",
    type: "profile",
  },
  {
    id: 2,
    date: "2026-03-04",
    time: "02:15 PM",
    action: "Bid Submitted",
    description: "Submitted bid for Highway Expansion Project (PROJ-000001)",
    performedBy: "Marc Justin Arzadon",
    type: "bid",
  },
  {
    id: 3,
    date: "2026-03-03",
    time: "11:00 AM",
    action: "Certificate Uploaded",
    description: "Uploaded new Mayor's Permit for 2026",
    performedBy: "Admin",
    type: "document",
  },
  {
    id: 4,
    date: "2026-03-01",
    time: "10:00 AM",
    action: "Award Received",
    description: "Awarded contract for School Building Construction Project",
    performedBy: "System",
    type: "award",
  },
  {
    id: 5,
    date: "2026-02-28",
    time: "04:45 PM",
    action: "Verification Approved",
    description: "Organization verification status changed to Verified",
    performedBy: "System Admin",
    type: "verification",
  },
  {
    id: 6,
    date: "2026-02-25",
    time: "09:00 AM",
    action: "Document Uploaded",
    description: "Uploaded PCAB License renewal certificate",
    performedBy: "Maria Santos",
    type: "document",
  },
]

const getHistoryIcon = (type: string) => {
  switch (type) {
    case "profile":
      return <Edit className="w-4 h-4 text-blue-500" />
    case "document":
      return <Upload className="w-4 h-4 text-green-500" />
    case "bid":
      return <Gavel className="w-4 h-4 text-purple-500" />
    case "award":
      return <Award className="w-4 h-4 text-yellow-500" />
    case "verification":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "profile":
      return <Badge className="bg-blue-100 text-blue-700">Profile</Badge>
    case "document":
      return <Badge className="bg-green-100 text-green-700">Document</Badge>
    case "bid":
      return <Badge className="bg-purple-100 text-purple-700">Bid</Badge>
    case "award":
      return <Badge className="bg-yellow-100 text-yellow-700">Award</Badge>
    case "verification":
      return <Badge className="bg-green-100 text-green-700">Verification</Badge>
    default:
      return <Badge>Other</Badge>
  }
}

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">View History</h2>
        <p className="text-gray-600">Organization activity and change history</p>
      </div>

      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg">Activity History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {historyData.map((record) => (
              <div 
                key={record.id} 
                className="flex items-start gap-4 p-4 hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  {getHistoryIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{record.action}</p>
                    {getTypeBadge(record.type)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {record.date} at {record.time}
                    </span>
                    <span>|</span>
                    <span>By: {record.performedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {historyData.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No history records found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing 6 of 156 records</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
