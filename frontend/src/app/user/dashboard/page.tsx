"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  FolderOpen, 
  Gavel, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    myBids: 0,
    wonProjects: 0,
    pendingBids: 0
  })
  const [recentBids, setRecentBids] = useState<any[]>([])
  const [verificationStatus, setVerificationStatus] = useState<string>("Verified")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Fetch user data
      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userData = userRes.ok ? await userRes.json() : null
      setUser(userData)
      setVerificationStatus(userData?.verificationStatus || "Pending")
      
      // Fetch projects
      const projectsRes = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const projects = projectsRes.ok ? await projectsRes.json() : []
      
      // Fetch bids
      const bidsRes = await fetch(`${API_URL}/bids`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const bids = bidsRes.ok ? await bidsRes.json() : []
      
      setStats({
        activeProjects: projects.filter((p: any) => p.status === "Open").length,
        myBids: bids.length,
        wonProjects: bids.filter((b: any) => b.bidStatus === "Won").length,
        pendingBids: bids.filter((b: any) => b.bidStatus === "Submitted" || b.bidStatus === "Under Evaluation").length
      })
      
      setRecentBids(bids.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
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
      {/* Verification Status Alert */}
      {verificationStatus === "Pending" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Clock className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your account is under review. You&apos;ll be able to place bids once verified.
            <Link href="/user/verification" className="ml-1 underline font-medium">
              Check status
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Verified" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertTitle className="text-green-800">Account Verified</AlertTitle>
          <AlertDescription className="text-green-700">
            Your account is verified. You can now bid on all available projects.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Rejected" && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            Your verification was rejected. Please review the requirements and resubmit.
            <Link href="/user/verification" className="ml-1 underline font-medium">
              Update documents
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Open Projects
            </CardTitle>
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-gray-500">Available for bidding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Bids
            </CardTitle>
            <Gavel className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids}</div>
            <p className="text-xs text-gray-500">{stats.pendingBids} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Won Projects
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wonProjects}</div>
            <p className="text-xs text-gray-500">Successful bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBids}</div>
            <p className="text-xs text-gray-500">Under evaluation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bids */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bids</CardTitle>
              <CardDescription>Your latest bid submissions</CardDescription>
            </div>
            <Link href="/user/projects">
              <Button size="sm">
                <FolderOpen className="w-4 h-4 mr-2" />
                Find Projects
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bids submitted yet</p>
              ) : (
                recentBids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">{bid.projectTitle}</h4>
                      <p className="text-sm text-gray-500">Bid: {formatCurrency(bid.bidAmount)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {bid.submittedAt?.split('T')[0]}
                      </p>
                    </div>
                    <Badge 
                      variant={bid.bidStatus === "Won" ? "default" : bid.bidStatus === "Submitted" ? "secondary" : "outline"}
                      className={bid.bidStatus === "Won" ? "bg-green-100 text-green-700" : ""}
                    >
                      {bid.bidStatus}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Link href="/user/bids" className="text-sm text-blue-600 hover:underline">
                View all bids →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/user/projects">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FolderOpen className="w-4 h-4" />
                  Browse Available Projects
                </Button>
              </Link>
              <Link href="/user/bids">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Gavel className="w-4 h-4" />
                  View My Bids
                </Button>
              </Link>
              <Link href="/user/profile">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <CheckCircle className="w-4 h-4" />
                  Update Company Profile
                </Button>
              </Link>
              <Link href="/user/verification">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <AlertTriangle className="w-4 h-4" />
                  Check Verification Status
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
