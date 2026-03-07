"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  Tag,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Share2,
  ExternalLink,
  Loader2,
  CheckCircle,
  Upload
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  abc: number
  location: string
  deadline: string
  status: "Open" | "Closed" | "Draft"
  category: string
  createdAt?: string
  updatedAt?: string
  requirements?: any[]
  bids?: any[]
  createdBy?: string
  // Detailed fields from admin
  referenceNumber?: string
  solicitationNumber?: string
  procuringEntity?: string
  clientAgency?: string
  areaOfDelivery?: string
  tradeAgreement?: string
  procurementMode?: string
  classification?: string
  deliveryPeriod?: string
  closingTime?: string
  preBidDate?: string
  preBidTime?: string
  siteInspectionDate?: string
  siteInspectionTime?: string
  // Contact fields
  contactName?: string
  contactPosition?: string
  contactAddress?: string
  contactPhone?: string
  contactEmail?: string
  // Computed/mapped fields for display
  closingDate?: string
  postingDate?: string
  projectTitle?: string
  contactPerson?: {
    name: string
    position: string
    phone: string
    email: string
  }
  documents?: { id: number; name: string; fileName: string; filePath: string; fileSize: string }[]
}

export default function BidNoticeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidNotes, setBidNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  const handleSubmitBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount))) {
      alert("Please enter a valid bid amount")
      return
    }
    
    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: Number(id),
          bidAmount: Number(bidAmount),
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
          fetchProject()
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit bid")
      }
    } catch (err) {
      alert("Error submitting bid")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadAll = async () => {
    if (!project?.documents?.length) {
      alert("No documents available for download")
      return
    }
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects/${id}/documents/download`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error("Failed to download documents")
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}_Documents.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download documents ZIP")
    }
  }

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }
      
      const data = await response.json()
      setProject(data)
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load bid project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null
    const end = new Date(deadline)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    return days > 0 ? days : 0
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm">Active</Badge>
      case "Closed":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 text-sm">Closed</Badge>
      case "Draft":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-sm">Draft</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 px-3 py-1 text-sm">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#002D5D]" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-600">{error || "Project not found"}</p>
        <Button onClick={() => router.push("/constra/opportunities")} variant="outline">
          Back to Opportunities
        </Button>
      </div>
    )
  }

  const daysLeft = getDaysRemaining(project.deadline)

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Navigation Bar */}
      <div className="bg-[#002D5D] text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-200">Constra</span>
            <span className="text-blue-400">/</span>
            <span className="text-blue-200">Opportunities</span>
            <span className="text-blue-400">/</span>
            <span>Bid Notice Abstract</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-800 gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-800 gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-[#002D5D] hover:bg-blue-50 gap-2"
          onClick={() => router.push("/constra/opportunities")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="border-t-4 border-t-[#002D5D]">
              <CardContent className="p-6">
                {/* Reference & Solicitation */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline" className="font-mono text-[#002D5D] border-[#002D5D]">
                    REF: {project.referenceNumber}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-gray-600">
                    ITB: {project.solicitationNumber}
                  </Badge>
                </div>

                {/* Procuring Entity */}
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-[#002D5D] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Procuring Entity</p>
                    <p className="text-lg font-semibold text-[#002D5D]">{project.procuringEntity}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Project Title */}
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#002D5D] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Project Title</p>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {project.projectTitle}
                    </h1>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Top Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Reference Number
                    </p>
                    <p className="font-semibold text-gray-900 font-mono">{project.referenceNumber || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Solicitation Number
                    </p>
                    <p className="font-semibold text-gray-900 font-mono">{project.solicitationNumber || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Trade Agreement
                    </p>
                    <p className="font-semibold text-gray-900">{project.tradeAgreement || "Implementing Rules and Regulations"}</p>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Procurement Mode
                    </p>
                    <p className="font-semibold text-gray-900">{project.procurementMode || "Negotiated Procurement - Two Failed Biddings"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Classification
                    </p>
                    <p className="font-semibold text-gray-900">{project.classification || "Goods"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </p>
                    <Badge className="bg-blue-100 text-blue-700">{project.category || "Food Stuff"}</Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* ABC and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Approved Budget for the Contract (ABC)
                    </p>
                    <p className="font-semibold text-[#002D5D] text-lg">{formatCurrency(project.abc)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Delivery Period
                    </p>
                    <p className="font-medium text-gray-900">{project.deliveryPeriod || "1 Day/s"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Client Agency
                    </p>
                    <p className="font-medium text-gray-900">{project.clientAgency || project.procuringEntity || "N/A"}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Location & Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Project Location
                    </p>
                    <p className="font-medium text-gray-900">{project.location || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Area of Delivery
                    </p>
                    <p className="font-medium text-gray-900">{project.areaOfDelivery || project.location || "N/A"}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Project Description */}
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Project Description / Scope of Work
                  </p>
                  <p className="text-gray-700 leading-relaxed">{project.description || "No description available"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates & Status */}
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Important Dates & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Status & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{project.status || "Active"}</Badge>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-[#002D5D]" />
                      <span className="font-medium text-[#002D5D]">Bid Supplements</span>
                    </div>
                    <p className="text-2xl font-bold text-[#002D5D]">0</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-700">Associated Components</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">0</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-600">Document Request List</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#002D5D]" />
                      <span className="font-medium text-[#002D5D]">Date Published</span>
                    </div>
                    <p className="text-gray-700">{formatDate(project.postingDate || project.createdAt || "")}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Last Updated / Time</span>
                    </div>
                    <p className="text-gray-700">{project.updatedAt ? formatDate(project.updatedAt) : formatDate(new Date().toISOString())}</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-700">Closing Date / Time</span>
                    </div>
                    <p className="text-gray-700">{project.deadline ? formatDate(project.deadline) : "N/A"}</p>
                    {project.closingTime && (
                      <p className="text-sm text-gray-500">{project.closingTime}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Timeline Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#002D5D]" />
                      <span className="font-medium text-[#002D5D]">Pre-Bid Conference</span>
                    </div>
                    <p className="text-gray-700">{project.preBidDate ? formatDate(project.preBidDate) : "TBD"}</p>
                    {project.preBidTime && (
                      <p className="text-sm text-gray-500">{project.preBidTime}</p>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-600">Site Inspection</span>
                    </div>
                    <p className="text-gray-700">{project.siteInspectionDate ? formatDate(project.siteInspectionDate) : "TBD"}</p>
                    {project.siteInspectionTime && (
                      <p className="text-sm text-gray-500">{project.siteInspectionTime}</p>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-600">Bid Submission Deadline</span>
                    </div>
                    <p className="text-gray-700">{project.deadline ? formatDate(project.deadline) : "N/A"}</p>
                    <p className="text-sm text-gray-500">{project.closingTime || "12:00 AM"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Documents */}
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Bidding Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {project.documents?.map((doc, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{doc.fileSize}</span>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-t-4 border-t-green-500">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <div className="mb-4">{getStatusBadge(project.status)}</div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Closing Date</p>
                      <p className="font-semibold text-red-600">{project.closingDate}</p>
                      <p className="text-sm text-red-500">{project.closingTime}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <strong>15 days remaining</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Person
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{project.contactPerson?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Position</p>
                    <p className="text-gray-700">{project.contactPerson?.position || "N/A"}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{project.contactPerson?.phone || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{project.contactPerson?.email || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button 
                  className="w-full gap-2 bg-[#002D5D] hover:bg-blue-800"
                  onClick={() => setIsBidDialogOpen(true)}
                  disabled={project.status !== "Open"}
                >
                  <ExternalLink className="w-4 h-4" />
                  Submit Bid
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handleDownloadAll}
                >
                  <Download className="w-4 h-4" />
                  Download All Documents
                </Button>
              </CardContent>
            </Card>

            {/* Republic Act Notice */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-2">Republic Act 9184</p>
              <p>Government Procurement Reform Act. This bid project is published in accordance with the transparency provisions of R.A. 9184.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Submission Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D]">Submit Bid</DialogTitle>
          </DialogHeader>
          
          {submitSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Submitted Successfully!</h3>
              <p className="text-gray-600">Your bid has been recorded and is now under evaluation.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Project</p>
                  <p className="font-semibold text-[#002D5D]">{project?.title}</p>
                </div>
                
                <div>
                  <Label htmlFor="bidAmount">Bid Amount (PHP)</Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    placeholder="Enter your bid amount..."
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ABC: {project ? formatCurrency(project.abc) : "N/A"}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="bidNotes">Notes / Technical Proposal</Label>
                  <Textarea
                    id="bidNotes"
                    placeholder="Enter any additional notes or technical proposal details..."
                    rows={4}
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                  />
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    By submitting this bid, you confirm that all information provided is accurate and you agree to the terms and conditions.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsBidDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#002D5D] hover:bg-blue-800"
                  onClick={handleSubmitBid}
                  disabled={submitting || !bidAmount}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Bid
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
