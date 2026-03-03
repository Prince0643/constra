"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MapPin, Calendar, DollarSign, FileText, Gavel, Clock, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidNotes, setBidNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
  
  // Mock verification status - in real app this comes from API
  let verificationStatus: "Pending" | "Verified" | "Rejected" = "Verified"

  // Fetch projects on load
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function formatCurrency(amount: number) {
    return "₱" + amount.toLocaleString()
  }

  function getDaysRemaining(deadline: string) {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "all" || project.location === locationFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesLocation && matchesCategory && project.status === "Open"
  })

  const locations = Array.from(new Set(projects.map(p => p.location)))
  const categories = Array.from(new Set(projects.map(p => p.category)))

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: selectedProject?.id,
          bidAmount: parseFloat(bidAmount),
          notes: bidNotes
        })
      })
      
      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setIsBidDialogOpen(false)
          setSubmitSuccess(false)
          setBidAmount("")
          setBidNotes("")
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.message || "Failed to submit bid")
      }
    } catch (error) {
      console.error("Bid submission error:", error)
      alert("Failed to submit bid. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Find Projects</h2>
        <p className="text-gray-600">Browse and bid on construction projects open for bidding</p>
      </div>

      {/* Verification Warning */}
      {verificationStatus !== "Verified" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Your account is not verified. 
            <Link href="/user/verification" className="ml-1 underline font-medium">
              Complete verification
            </Link>
            {" "}to bid on projects.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const daysRemaining = getDaysRemaining(project.deadline)
          
          return (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline">{project.category}</Badge>
                  {daysRemaining <= 3 ? (
                    <Badge className="bg-red-100 text-red-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysRemaining} days left
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysRemaining} days left
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Budget (ABC):</span>
                    <span className="font-semibold">{formatCurrency(project.abc)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Location:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Deadline:</span>
                    <span>{project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Requirements:</span>
                    <span>{project.requirements.length} documents</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={isBidDialogOpen && selectedProject?.id === project.id} 
                        onOpenChange={(open) => {
                          setIsBidDialogOpen(open)
                          if (!open) setSelectedProject(null)
                        }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedProject(project)}
                      disabled={verificationStatus !== "Verified"}
                    >
                      <Gavel className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>
                  </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-bold">Invitation to Bid (ITB)</DialogTitle>
                      <DialogDescription className="text-center">
                        Review the project details before placing your bid
                      </DialogDescription>
                    </DialogHeader>
                    
                    {submitSuccess ? (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Gavel className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Submitted Successfully!</h3>
                        <p className="text-gray-500">Your bid has been received and is now under evaluation.</p>
                        <Link href="/user/bids">
                          <Button className="mt-4">View My Bids</Button>
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitBid} className="space-y-4">
                        {/* ITB Project Details Section */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b">
                            <h3 className="font-bold text-center text-lg">Bid Notice Abstract</h3>
                          </div>
                          
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium w-1/3">Reference Number</td>
                                <td className="p-3">PROJ-{selectedProject?.id?.toString().padStart(6, '0')}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Procuring Entity</td>
                                <td className="p-3">{selectedProject?.location || "N/A"}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Title</td>
                                <td className="p-3 font-semibold">{selectedProject?.title}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Area of Delivery</td>
                                <td className="p-3">{selectedProject?.location}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Solicitation Number</td>
                                <td className="p-3">SN-{selectedProject?.id}-{new Date().getFullYear()}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Procurement Mode</td>
                                <td className="p-3">Public Bidding</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Category</td>
                                <td className="p-3">{selectedProject?.category || "Infrastructure"}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Approved Budget</td>
                                <td className="p-3 font-semibold text-green-700">{selectedProject && formatCurrency(selectedProject.abc)}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 bg-gray-50 font-medium">Bid Deadline</td>
                                <td className="p-3">{selectedProject?.deadline?.split('T')[0]}</td>
                              </tr>
                              <tr>
                                <td className="p-3 bg-gray-50 font-medium">Status</td>
                                <td className="p-3">
                                  <Badge className={selectedProject?.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                    {selectedProject?.status}
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          
                          {/* Description Section */}
                          <div className="p-4 border-t bg-white">
                            <h4 className="font-bold mb-2 text-gray-900">Description</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {selectedProject?.description || "No detailed description provided."}
                            </p>
                          </div>
                          
                          {/* Required Documents */}
                          {selectedProject?.requirements && selectedProject.requirements.length > 0 && (
                            <div className="p-4 border-t bg-gray-50">
                              <h4 className="font-bold mb-3 text-gray-900">Documentary Requirements</h4>
                              <table className="w-full text-sm border">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="p-2 border text-left">Requirement</th>
                                    <th className="p-2 border text-center w-20">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedProject.requirements.map((req: any, index: number) => (
                                    <tr key={index} className="border-b">
                                      <td className="p-2 border">{req.name || req}</td>
                                      <td className="p-2 border text-center">
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Required</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Bid Submission Section */}
                        <div className="border-t pt-4">
                          <h4 className="font-bold text-lg mb-4 text-gray-900">Bid Submission</h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bidAmount" className="font-medium">Bid Amount (₱)</Label>
                            <Input
                              id="bidAmount"
                              type="number"
                              placeholder="Enter your bid amount"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              required
                              className="text-lg"
                            />
                            <p className="text-xs text-gray-500">
                              Maximum allowed: {selectedProject && formatCurrency(selectedProject.abc)} (ABC)
                            </p>
                          </div>

                          <div className="space-y-2 mt-4">
                            <Label htmlFor="bidNotes" className="font-medium">Technical Approach / Notes</Label>
                            <Textarea
                              id="bidNotes"
                              placeholder="Describe your technical approach, timeline, methodology, and any other relevant information..."
                              rows={4}
                              value={bidNotes}
                              onChange={(e) => setBidNotes(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm text-blue-900">Documents Auto-Attached</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Your pre-verified company documents from your profile will be automatically attached to this bid.
                              </p>
                              <p className="text-xs text-blue-600 mt-2">
                                Manage documents in <a href="/user/profile" className="underline font-medium">Profile</a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsBidDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? "Submitting..." : "Submit Bid"}
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
