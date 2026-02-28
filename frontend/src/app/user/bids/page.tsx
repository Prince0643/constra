"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gavel, Clock, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"

export default function MyBidsPage() {
  const [bids, setBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/bids`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBids(data)
      }
    } catch (error) {
      console.error("Failed to fetch bids:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "Under Evaluation":
        return <Gavel className="w-5 h-5 text-yellow-600" />
      case "Won":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "Lost":
        return <XCircle className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "Submitted": "bg-blue-100 text-blue-700",
      "Under Evaluation": "bg-yellow-100 text-yellow-700",
      "Won": "bg-green-100 text-green-700",
      "Lost": "bg-gray-100 text-gray-700",
    }
    return <Badge className={styles[status] || "bg-gray-100 text-gray-700"}>{status}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

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
                const savings = (bid.projectAbc || 0) - bid.bidAmount
                const savingsPercent = bid.projectAbc ? ((savings / bid.projectAbc) * 100).toFixed(1) : "0"
                
                return (
                  <TableRow key={bid.id} className={bid.bidStatus === "Won" ? "bg-green-50/50" : ""}>
                    <TableCell>
                      <div className="font-medium">{bid.projectTitle}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(bid.bidAmount)}</TableCell>
                    <TableCell>{formatCurrency(bid.projectAbc)}</TableCell>
                    <TableCell>
                      <div className="text-green-600 font-medium">
                        {formatCurrency(savings)} ({savingsPercent}%)
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bid.bidStatus)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{bid.submittedAt?.split('T')[0]}</TableCell>
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
          {bids.length === 0 && (
            <p className="text-center text-gray-500 py-8">No bids submitted yet</p>
          )}
        </CardContent>
      </Card>

      {/* Success Banner for Won Bids */}
      {bids.some((b: any) => b.bidStatus === "Won") && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                <p className="text-green-700">
                  You have been awarded {bids.filter((b: any) => b.bidStatus === "Won").length} project(s).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
