"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MapPin, Calendar, DollarSign, FileText, Gavel, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

const projects = [
  { 
    id: 1, 
    title: "Highway Expansion Project", 
    description: "Expansion of the North Luzon Expressway to accommodate increased traffic volume. Includes construction of additional lanes and interchanges.",
    abc: 50000000, 
    location: "Metro Manila", 
    status: "Open", 
    deadline: "2024-03-15",
    bids: 8,
    category: "Infrastructure",
    requirements: ["Financial Proposal", "Technical Specifications", "Company Profile"]
  },
  { 
    id: 2, 
    title: "School Building Construction", 
    description: "Construction of a 3-story school building with 24 classrooms, library, and auditorium. Must comply with DPWH standards.",
    abc: 25000000, 
    location: "Cebu City", 
    status: "Open", 
    deadline: "2024-03-20",
    bids: 12,
    category: "Education",
    requirements: ["Financial Proposal", "Technical Specifications", "Company Profile", "Certificate of PhilGEPS Registration"]
  },
  { 
    id: 3, 
    title: "Road Paving - District 5", 
    description: "Asphalt paving of 5km municipal roads including drainage improvements and road markings.",
    abc: 15000000, 
    location: "Quezon City", 
    status: "Open", 
    deadline: "2024-03-25",
    bids: 15,
    category: "Infrastructure",
    requirements: ["Financial Proposal", "Technical Specifications"]
  },
  { 
    id: 4, 
    title: "Government Office Renovation", 
    description: "Renovation of 3-story government office building including electrical, plumbing, and HVAC upgrades.",
    abc: 8000000, 
    location: "Makati City", 
    status: "Open", 
    deadline: "2024-03-30",
    bids: 6,
    category: "Renovation",
    requirements: ["Financial Proposal", "Technical Specifications", "Company Profile"]
  },
  { 
    id: 5, 
    title: "Water Treatment Facility", 
    description: "Construction of water treatment facility with capacity of 5000 cubic meters per day.",
    abc: 75000000, 
    location: "Davao City", 
    status: "Open", 
    deadline: "2024-04-05",
    bids: 4,
    category: "Utilities",
    requirements: ["Financial Proposal", "Technical Specifications", "Company Profile", "Certificate of PhilGEPS Registration", "Environmental Compliance Certificate"]
  },
]

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

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidNotes, setBidNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Mock verification status
  let verificationStatus: "Pending" | "Verified" | "Rejected" = "Verified"

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    
    setTimeout(() => {
      setIsBidDialogOpen(false)
      setSubmitSuccess(false)
      setBidAmount("")
      setBidNotes("")
    }, 2000)
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
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Submit Bid</DialogTitle>
                      <DialogDescription>
                        Submit your bid for {selectedProject?.title}
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
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Project Budget (ABC)</div>
                          <div className="text-lg font-semibold">{selectedProject && formatCurrency(selectedProject.abc)}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bidAmount">Your Bid Amount (₱)</Label>
                          <Input
                            id="bidAmount"
                            type="number"
                            placeholder="Enter your bid amount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Enter the total amount for your proposed bid
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bidNotes">Technical Approach / Notes</Label>
                          <Textarea
                            id="bidNotes"
                            placeholder="Describe your technical approach, timeline, and any other relevant information..."
                            rows={3}
                            value={bidNotes}
                            onChange={(e) => setBidNotes(e.target.value)}
                          />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm text-blue-900">Documents Auto-Attached</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Your pre-verified documents from your profile will be automatically attached to this bid:
                              </p>
                              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                {selectedProject?.requirements.map((req, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs text-blue-600 mt-2">
                                Manage your documents in <a href="/user/profile" className="underline font-medium">Profile &gt; Company Documents</a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsBidDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
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
