"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Gavel, Clock, CheckCircle, XCircle, TrendingUp, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"

const stats = [
  { title: "Total Bids", value: "12", icon: Gavel },
  { title: "Active Bids", value: "3", icon: Clock },
  { title: "Projects Won", value: "2", icon: CheckCircle },
  { title: "Win Rate", value: "16.7%", icon: TrendingUp },
]

const recentBids = [
  { id: 1, project: "School Building Construction", bidAmount: "₱24,500,000", status: "Submitted", deadline: "2024-03-10", submittedAt: "2024-03-05" },
  { id: 2, project: "Road Paving - District 5", bidAmount: "₱14,800,000", status: "Under Evaluation", deadline: "2024-03-20", submittedAt: "2024-03-08" },
  { id: 3, project: "Bridge Rehabilitation", bidAmount: "₱34,200,000", status: "Not Awarded", deadline: "2024-02-28", submittedAt: "2024-02-20" },
]

const statusColors: Record<string, string> = {
  "Submitted": "bg-blue-100 text-blue-700",
  "Under Evaluation": "bg-yellow-100 text-yellow-700",
  "Won": "bg-green-100 text-green-700",
  "Not Awarded": "bg-gray-100 text-gray-700",
}

export default function UserDashboard() {
  // Mock verification status - change this to test different states
  let verificationStatus: "Pending" | "Verified" | "Rejected" = "Verified"

  return (
    <div className="space-y-6">
      {/* Verification Alert */}
      {verificationStatus === "Pending" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your account is under review. Please wait for admin approval before bidding on projects. This typically takes 1-2 business days.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Rejected" && (
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            Your verification was rejected. Please review the feedback and resubmit your documents.
            <Link href="/user/verification" className="ml-2 underline">
              Go to Verification
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bids */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bids</CardTitle>
              <CardDescription>Track your recent bidding activity</CardDescription>
            </div>
            <Link href="/user/bids">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBids.map((bid) => (
                <div key={bid.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{bid.project}</h4>
                      <p className="text-sm text-gray-500 mt-1">Bid: {bid.bidAmount}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>Deadline: {bid.deadline}</span>
                        <span>•</span>
                        <span>Submitted: {bid.submittedAt}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[bid.status]}>
                      {bid.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/user/projects">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Find Projects</div>
                    <div className="text-sm text-gray-500">Browse and bid on new opportunities</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/user/verification">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Verification Status</div>
                    <div className="text-sm text-gray-500">Check your document verification status</div>
                  </div>
                </Button>
              </Link>

              <Link href="/user/bids">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Track Bids</div>
                    <div className="text-sm text-gray-500">Monitor your bid statuses and results</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
