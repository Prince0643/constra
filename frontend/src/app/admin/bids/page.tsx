"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Trophy, XCircle, FileText, CheckCircle, AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

const projects = [
  { id: 1, title: "Highway Expansion Project", abc: 50000000, status: "Open" },
  { id: 2, title: "School Building Construction", abc: 25000000, status: "Evaluation" },
  { id: 3, title: "Bridge Rehabilitation", abc: 35000000, status: "Closed" },
  { id: 4, title: "Road Paving - District 5", abc: 15000000, status: "Open" },
]

const bids = [
  { id: 1, projectId: 2, bidder: "ABC Construction Corp", company: "ABC Construction", amount: 24500000, compliance: "Compliant", documents: 4, submittedAt: "2024-03-05" },
  { id: 2, projectId: 2, bidder: "XYZ Builders Inc", company: "XYZ Builders", amount: 23800000, compliance: "Compliant", documents: 4, submittedAt: "2024-03-06" },
  { id: 3, projectId: 2, bidder: "Metro Engineering Ltd", company: "Metro Engineering", amount: 25200000, compliance: "Non-Compliant", documents: 3, submittedAt: "2024-03-04" },
  { id: 4, projectId: 2, bidder: "Premier Builders Co", company: "Premier Builders", amount: 24000000, compliance: "Compliant", documents: 4, submittedAt: "2024-03-07" },
  { id: 5, projectId: 2, bidder: "Global Construction Inc", company: "Global Construction", amount: 23500000, compliance: "Compliant", documents: 4, submittedAt: "2024-03-08" },
]

function formatCurrency(amount: number) {
  return "₱" + amount.toLocaleString()
}

function calculateVariance(bidAmount: number, abc: number) {
  const variance = bidAmount - abc
  const percentage = ((variance / abc) * 100).toFixed(2)
  return { variance, percentage, isLower: variance < 0 }
}

export default function BidAnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState<string>("2")
  const [selectedBid, setSelectedBid] = useState<number | null>(null)
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const currentProject = projects.find(p => p.id.toString() === selectedProject)
  const projectBids = bids.filter(b => b.projectId.toString() === selectedProject)
  
  // Find lowest responsive bid
  const compliantBids = projectBids.filter(b => b.compliance === "Compliant")
  const lowestResponsiveBid = compliantBids.length > 0 
    ? compliantBids.reduce((min, bid) => bid.amount < min.amount ? bid : min, compliantBids[0])
    : null

  const handleAward = (bidId: number) => {
    setSelectedBid(bidId)
    setIsAwardDialogOpen(true)
  }

  const handleReject = (bidId: number) => {
    setSelectedBid(bidId)
    setIsRejectDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bid Analytics</h2>
        <p className="text-gray-600">Compare bids and award projects to the best offer</p>
      </div>

      {/* Project Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
          <CardDescription>Choose a project to view and evaluate bids</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.filter(p => p.status !== "Closed").map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.title} (ABC: {formatCurrency(project.abc)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      {currentProject && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectBids.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Compliant Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{compliantBids.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lowest Responsive Bid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {lowestResponsiveBid ? formatCurrency(lowestResponsiveBid.amount) : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {lowestResponsiveBid && currentProject
                  ? formatCurrency(currentProject.abc - lowestResponsiveBid.amount)
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bids Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bid Comparison Table</CardTitle>
          <CardDescription>
            All bids for {currentProject?.title}. The lowest responsive bid is highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Bidder</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Variance from ABC</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...projectBids]
                .sort((a, b) => a.amount - b.amount)
                .map((bid, index) => {
                  const isLowestResponsive = lowestResponsiveBid?.id === bid.id
                  const variance = currentProject ? calculateVariance(bid.amount, currentProject.abc) : null
                  
                  return (
                    <TableRow 
                      key={bid.id} 
                      className={isLowestResponsive ? "bg-green-50 border-green-200" : ""}
                    >
                      <TableCell>
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {index === 1 && <span className="text-gray-500 font-medium">2nd</span>}
                        {index === 2 && <span className="text-gray-500 font-medium">3rd</span>}
                        {index > 2 && <span className="text-gray-400">{index + 1}th</span>}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{bid.company}</div>
                        <div className="text-sm text-gray-500">{bid.bidder}</div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(bid.amount)}
                      </TableCell>
                      <TableCell>
                        {variance && (
                          <div className={`flex items-center gap-1 ${variance.isLower ? 'text-green-600' : 'text-red-600'}`}>
                            {variance.isLower ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                            <span>{variance.percentage}%</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={bid.compliance === "Compliant" ? "default" : "destructive"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {bid.compliance === "Compliant" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {bid.compliance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{bid.documents}/4</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {bid.submittedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {bid.compliance === "Compliant" && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAward(bid.id)}
                            >
                              <Trophy className="w-4 h-4 mr-1" />
                              Award
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleReject(bid.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Bid Evaluation Guide</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li><strong>Lowest Responsive Bid:</strong> The lowest bid that meets all document requirements (highlighted in green)</li>
            <li><strong>Variance:</strong> Percentage difference between bid amount and the Approved Budget for Contract (ABC)</li>
            <li><strong>Compliance:</strong> Indicates whether all required documents have been submitted</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Award Dialog */}
      <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Award Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to award this project? This action will mark this bid as won and all other bids as lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAwardDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsAwardDialogOpen(false)
                // Handle award logic here
              }}
            >
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
              Are you sure you want to reject this bid? The bidder will be notified of this decision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setIsRejectDialogOpen(false)
                // Handle reject logic here
              }}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
