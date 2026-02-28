"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gavel, Clock, CheckCircle, XCircle, Eye, FileText } from "lucide-react"
import Link from "next/link"

const bids = [
  { 
    id: 1, 
    project: "School Building Construction", 
    bidAmount: 24500000, 
    abc: 25000000,
    status: "Submitted", 
    submittedAt: "2024-03-05",
    documents: 4,
    timeline: [
      { status: "Submitted", date: "2024-03-05", completed: true },
      { status: "Under Evaluation", date: "2024-03-10", completed: false },
      { status: "Won", date: null, completed: false },
    ]
  },
  { 
    id: 2, 
    project: "Road Paving - District 5", 
    bidAmount: 14800000, 
    abc: 15000000,
    status: "Under Evaluation", 
    submittedAt: "2024-03-08",
    documents: 3,
    timeline: [
      { status: "Submitted", date: "2024-03-08", completed: true },
      { status: "Under Evaluation", date: "2024-03-12", completed: true },
      { status: "Won", date: null, completed: false },
    ]
  },
  { 
    id: 3, 
    project: "Bridge Rehabilitation", 
    bidAmount: 34200000, 
    abc: 35000000,
    status: "Not Awarded", 
    submittedAt: "2024-02-20",
    documents: 4,
    timeline: [
      { status: "Submitted", date: "2024-02-20", completed: true },
      { status: "Under Evaluation", date: "2024-02-25", completed: true },
      { status: "Not Awarded", date: "2024-02-28", completed: true },
    ]
  },
  { 
    id: 4, 
    project: "Highway Expansion Project", 
    bidAmount: 48900000, 
    abc: 50000000,
    status: "Won", 
    submittedAt: "2024-02-15",
    documents: 4,
    timeline: [
      { status: "Submitted", date: "2024-02-15", completed: true },
      { status: "Under Evaluation", date: "2024-02-20", completed: true },
      { status: "Won", date: "2024-02-28", completed: true },
    ]
  },
]

function formatCurrency(amount: number) {
  return "₱" + amount.toLocaleString()
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Submitted":
      return <Clock className="w-5 h-5 text-blue-600" />
    case "Under Evaluation":
      return <Gavel className="w-5 h-5 text-yellow-600" />
    case "Won":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "Not Awarded":
      return <XCircle className="w-5 h-5 text-gray-400" />
    default:
      return <Clock className="w-5 h-5 text-gray-400" />
  }
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    "Submitted": "bg-blue-100 text-blue-700",
    "Under Evaluation": "bg-yellow-100 text-yellow-700",
    "Won": "bg-green-100 text-green-700",
    "Not Awarded": "bg-gray-100 text-gray-700",
  }
  return <Badge className={styles[status] || "bg-gray-100 text-gray-700"}>{status}</Badge>
}

export default function MyBidsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
        <p className="text-gray-600">Track the status of all your submitted bids</p>
      </div>

      {/* Bids Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bids</CardTitle>
          <CardDescription>Overview of your bidding history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Your Bid</TableHead>
                <TableHead>Budget (ABC)</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => {
                const savings = bid.abc - bid.bidAmount
                const savingsPercent = ((savings / bid.abc) * 100).toFixed(1)
                
                return (
                  <TableRow key={bid.id} className={bid.status === "Won" ? "bg-green-50/50" : ""}>
                    <TableCell>
                      <div className="font-medium">{bid.project}</div>
                      <div className="text-sm text-gray-500">{bid.documents} documents</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(bid.bidAmount)}</TableCell>
                    <TableCell>{formatCurrency(bid.abc)}</TableCell>
                    <TableCell>
                      <div className="text-green-600 font-medium">
                        {formatCurrency(savings)} ({savingsPercent}%)
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bid.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{bid.submittedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Timeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bids.slice(0, 2).map((bid) => (
          <Card key={bid.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{bid.project}</CardTitle>
                  <CardDescription>Bid: {formatCurrency(bid.bidAmount)}</CardDescription>
                </div>
                {getStatusBadge(bid.status)}
              </div>
            </CardHeader>
            <CardContent>
              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {bid.timeline.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        step.completed 
                          ? bid.status === "Not Awarded" && step.status === "Won"
                            ? "bg-red-100"
                            : "bg-blue-100"
                          : "bg-gray-100"
                      }`}>
                        {bid.status === "Not Awarded" && step.status === "Won" ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : step.completed ? (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                          {bid.status === "Not Awarded" && step.status === "Won" ? "Not Awarded" : step.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          {step.date ? step.date : "Pending..."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Banner for Won Bids */}
      {bids.some(b => b.status === "Won") && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                <p className="text-green-700">
                  You have been awarded the Highway Expansion Project. 
                  <Link href="#" className="ml-1 underline">View project details</Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
