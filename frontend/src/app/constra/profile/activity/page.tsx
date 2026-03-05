"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  User, 
  Edit, 
  Lock, 
  FileText,
  LogIn,
  LogOut,
  Search,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ActivityRecord {
  id: number
  date: string
  time: string
  action: string
  description: string
  ipAddress: string
  type: "login" | "logout" | "profile" | "password" | "document"
}

const activityData: ActivityRecord[] = [
  {
    id: 1,
    date: "2026-03-05",
    time: "09:30 AM",
    action: "Login",
    description: "User logged in successfully",
    ipAddress: "192.168.1.100",
    type: "login",
  },
  {
    id: 2,
    date: "2026-03-04",
    time: "05:45 PM",
    action: "Logout",
    description: "User logged out",
    ipAddress: "192.168.1.100",
    type: "logout",
  },
  {
    id: 3,
    date: "2026-03-04",
    time: "02:15 PM",
    action: "Profile Update",
    description: "Updated contact information",
    ipAddress: "192.168.1.100",
    type: "profile",
  },
  {
    id: 4,
    date: "2026-03-03",
    time: "10:30 AM",
    action: "Password Change",
    description: "Password was changed successfully",
    ipAddress: "192.168.1.100",
    type: "password",
  },
  {
    id: 5,
    date: "2026-03-02",
    time: "11:00 AM",
    action: "Document Upload",
    description: "Uploaded PCAB certificate",
    ipAddress: "192.168.1.100",
    type: "document",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "login":
      return <LogIn className="w-4 h-4 text-green-500" />
    case "logout":
      return <LogOut className="w-4 h-4 text-orange-500" />
    case "profile":
      return <User className="w-4 h-4 text-blue-500" />
    case "password":
      return <Lock className="w-4 h-4 text-red-500" />
    case "document":
      return <FileText className="w-4 h-4 text-purple-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "login":
      return <Badge className="bg-green-100 text-green-700">Login</Badge>
    case "logout":
      return <Badge className="bg-orange-100 text-orange-700">Logout</Badge>
    case "profile":
      return <Badge className="bg-blue-100 text-blue-700">Profile</Badge>
    case "password":
      return <Badge className="bg-red-100 text-red-700">Security</Badge>
    case "document":
      return <Badge className="bg-purple-100 text-purple-700">Document</Badge>
    default:
      return <Badge>Other</Badge>
  }
}

export default function ProfileActivityPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">Activity</h2>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
            {/* Activity Date Row */}
            <Label className="font-semibold bg-gray-100 p-2 rounded">Activity Date</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">From</span>
              <div className="relative">
                <Input type="date" className="w-40" />
                <Calendar className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-sm">To</span>
              <div className="relative">
                <Input type="date" className="w-40" />
                <Calendar className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <Button className="bg-[#002D5D]">
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>

            {/* Activity Row */}
            <Label className="font-semibold bg-gray-100 p-2 rounded">Activity</Label>
            <div>
              <select className="w-64 p-2 border rounded text-sm">
                <option>All</option>
                <option>Login</option>
                <option>Logout</option>
                <option>Profile Update</option>
                <option>Password Change</option>
                <option>Bid Submission</option>
              </select>
            </div>

            {/* Module Row */}
            <Label className="font-semibold bg-gray-100 p-2 rounded">Module</Label>
            <div>
              <select className="w-64 p-2 border rounded text-sm">
                <option>All</option>
                <option>Authentication</option>
                <option>Profile Management</option>
                <option>Bidding</option>
                <option>Document Management</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {activityData.map((record) => (
              <div 
                key={record.id} 
                className="flex items-start gap-4 p-4 hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  {getActivityIcon(record.type)}
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
                    <span>IP: {record.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 italic">
        <span className="font-semibold">Note:</span> Sort by Activity Date Desc
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing 5 of 45 records</span>
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
