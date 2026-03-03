"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, XCircle, Eye, Loader2, Gavel, RefreshCw } from "lucide-react"

export default function AllBidsPage() {
  const [bids, setBids] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedBid, setSelectedBid] = useState<any>(null)
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      console.log("Token:", token ? "Found" : "Missing")
      
      // Fetch all bids
      const bidsRes = await fetch(`${API_URL}/bids`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("Bids response status:", bidsRes.status)
      
      if (!bidsRes.ok) {
        const errorText = await bidsRes.text()
        console.error("Bids fetch error:", errorText)
      }
      
      const bidsData = bidsRes.ok ? await bidsRes.json() : []
      console.log("Bids data:", bidsData)
      setBids(bidsData)
      
      // Fetch projects for filter
      const projectsRes = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const projectsData = projectsRes.ok ? await projectsRes.json() : []
      setProjects(projectsData)
    } catch (error) {
      console.error("Failed to fetch bids:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAward = async (bidId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/bids/${bidId}/award`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchData()
        setIsAwardDialogOpen(false)
      } else {
        alert("Failed to award bid")
      }
    } catch (error) {
      console.error("Award error:", error)
    }
  }

  const handleReject = async (bidId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/bids/${bidId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchData()
        setIsRejectDialogOpen(false)
      } else {
        alert("Failed to reject bid")
      }
    } catch (error) {
      console.error("Reject error:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
  }

  const filteredBids = selectedProject === "all" 
    ? bids 
    : bids.filter(b => b.projectId.toString() === selectedProject)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Won":
        return <Badge className="bg-green-100 text-green-700">Awarded</Badge>
      case "Lost":
        return <Badge variant="outline" className="text-gray-500">Not Awarded</Badge>
      case "Submitted":
        return <Badge className="bg-blue-100 text-blue-700">Submitted</Badge>
      case "Under Evaluation":
        return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Bids</h2>
          <p className="text-gray-600">View and manage all bids submitted by contractors</p>
        </div>
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filter by Project */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Bids</CardTitle>
          <CardDescription>Select a project to view its bids</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project: any) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.title} ({bids.filter(b => b.projectId === project.id).length} bids)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Bids Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bid Submissions</CardTitle>
          <CardDescription>
            {filteredBids.length} total bid(s) {selectedProject !== "all" && "for selected project"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Bidder</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...filteredBids]
                .sort((a, b) => a.bidAmount - b.bidAmount)
                .map((bid, index) => (
                  <TableRow 
                    key={bid.id} 
                    className={bid.bidStatus === "Won" ? "bg-green-50" : ""}
                  >
                    <TableCell>
                      <div className="font-medium">{bid.projectTitle}</div>
                      <div className="text-xs text-gray-500">ABC: {formatCurrency(bid.projectAbc)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{bid.companyName}</div>
                      <div className="text-xs text-gray-500">{bid.bidderEmail}</div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(bid.bidAmount)}
                      {index === 0 && bid.bidStatus !== "Won" && bid.bidStatus !== "Lost" && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-700">Lowest</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {bid.submittedAt?.split('T')[0]}
                    </TableCell>
                    <TableCell>{getStatusBadge(bid.bidStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {bid.bidStatus !== "Won" && bid.bidStatus !== "Lost" && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedBid(bid)
                                setIsAwardDialogOpen(true)
                              }}
                            >
                              <Trophy className="w-4 h-4 mr-1" />
                              Award
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                setSelectedBid(bid)
                                setIsRejectDialogOpen(true)
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          
          {filteredBids.length === 0 && (
            <div className="text-center py-8">
              <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bids found for this project</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {filteredBids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredBids.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {filteredBids.filter((b: any) => b.bidStatus === "Submitted" || b.bidStatus === "Under Evaluation").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredBids.filter((b: any) => b.bidStatus === "Won").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lowest Bid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredBids.length > 0 
                  ? formatCurrency(Math.min(...filteredBids.map((b: any) => b.bidAmount)))
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Award Dialog */}
      <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Award Bid</DialogTitle>
            <DialogDescription>
              Are you sure you want to award this bid to <strong>{selectedBid?.companyName}</strong>?
              <br /><br />
              Project: {selectedBid?.projectTitle}
              <br />
              Bid Amount: {selectedBid && formatCurrency(selectedBid.bidAmount)}
              <br /><br />
              This action cannot be undone. All other bids for this project will be marked as rejected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAwardDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedBid && handleAward(selectedBid.id)}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Confirm Award
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bid</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this bid from <strong>{selectedBid?.companyName}</strong>?
              <br /><br />
              The bidder will be notified of this decision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedBid && handleReject(selectedBid.id)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
