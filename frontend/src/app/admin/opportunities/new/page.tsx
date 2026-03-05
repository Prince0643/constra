"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Building2,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  FileText,
  Save,
  Send,
  Plus,
  Trash2,
  Loader2
} from "lucide-react"

interface ProjectFormData {
  // Basic Info
  title: string
  description: string
  referenceNumber: string
  solicitationNumber: string
  
  // Agency Info
  procuringEntity: string
  clientAgency: string
  areaOfDelivery: string
  
  // Procurement Details
  tradeAgreement: string
  procurementMode: string
  classification: string
  category: string
  
  // Financial
  abc: string
  deliveryPeriod: string
  
  // Schedule
  deadline: string
  closingTime: string
  preBidDate: string
  preBidTime: string
  siteInspectionDate: string
  siteInspectionTime: string
  
  // Contact Person
  contactName: string
  contactPosition: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  
  // Location
  location: string
  
  // Status
  status: "Open" | "Closed" | "Draft"
}

const procurementModes = [
  "Competitive Bidding - Public",
  "Competitive Bidding - Limited",
  "Direct Contracting",
  "Repeat Order",
  "Shopping",
  "Negotiated Procurement",
  "Emergency Purchase",
  "Lease",
  "Framework Agreement"
]

const categories = [
  "Civil Works",
  "Infrastructure",
  "Construction Materials",
  "Electrical Works",
  "Mechanical Works",
  "IT Equipment",
  "IT Services",
  "Consulting Services",
  "Office Supplies",
  "Office Equipment",
  "Educational Materials",
  "Medical Supplies",
  "Vehicles",
  "Machinery",
  "Printing Services"
]

const classifications = [
  "Goods",
  "Infrastructure",
  "Consulting Services",
  "Services"
]

const tradeAgreements = [
  "Implementing Rules and Regulations",
  "General Procurement",
  "GPPB Resolution No. 04-2021",
  "No Trade Agreement"
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

function BidNoticeEditorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    referenceNumber: "",
    solicitationNumber: "",
    procuringEntity: "",
    clientAgency: "",
    areaOfDelivery: "",
    tradeAgreement: "Implementing Rules and Regulations",
    procurementMode: "Competitive Bidding - Public",
    classification: "Goods",
    category: "",
    abc: "",
    deliveryPeriod: "",
    deadline: "",
    closingTime: "12:00 PM",
    preBidDate: "",
    preBidTime: "10:00 AM",
    siteInspectionDate: "",
    siteInspectionTime: "9:00 AM",
    contactName: "",
    contactPosition: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    location: "",
    status: "Draft"
  })

  useEffect(() => {
    if (editId) {
      fetchProject(editId)
    }
  }, [editId])

  const fetchProject = async (id: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error("Failed to fetch project")
      
      const data = await response.json()
      setFormData({
        title: data.title || "",
        description: data.description || "",
        referenceNumber: data.referenceNumber || "",
        solicitationNumber: data.solicitationNumber || "",
        procuringEntity: data.procuringEntity || "",
        clientAgency: data.clientAgency || "",
        areaOfDelivery: data.areaOfDelivery || "",
        tradeAgreement: data.tradeAgreement || "Implementing Rules and Regulations",
        procurementMode: data.procurementMode || "Competitive Bidding - Public",
        classification: data.classification || "Goods",
        category: data.category || "",
        abc: data.abc?.toString() || "",
        deliveryPeriod: data.deliveryPeriod || "",
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : "",
        closingTime: data.closingTime || "12:00 PM",
        preBidDate: data.preBidDate ? new Date(data.preBidDate).toISOString().split('T')[0] : "",
        preBidTime: data.preBidTime || "10:00 AM",
        siteInspectionDate: data.siteInspectionDate ? new Date(data.siteInspectionDate).toISOString().split('T')[0] : "",
        siteInspectionTime: data.siteInspectionTime || "9:00 AM",
        contactName: data.contactName || "",
        contactPosition: data.contactPosition || "",
        contactAddress: data.contactAddress || "",
        contactPhone: data.contactPhone || "",
        contactEmail: data.contactEmail || "",
        location: data.location || "",
        status: data.status || "Draft"
      })
    } catch (err) {
      console.error("Error fetching project:", err)
      alert("Failed to load project data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (publish = false) => {
    try {
      setIsSaving(true)
      const token = localStorage.getItem("token")
      
      const payload = {
        ...formData,
        abc: parseFloat(formData.abc) || 0,
        status: publish ? "Open" : formData.status
      }
      
      const url = editId 
        ? `${API_URL}/projects/${editId}`
        : `${API_URL}/projects`
      
      const method = editId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save project")
      }
      
      alert(publish ? "Bid notice published successfully!" : "Draft saved successfully!")
      router.push("/admin/opportunities")
    } catch (err: any) {
      console.error("Error saving project:", err)
      alert(err.message || "Failed to save project")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002D5D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="gap-2 text-[#002D5D]"
            onClick={() => router.push("/admin/opportunities")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[#002D5D]">
              {editId ? "Edit Bid Notice" : "Create Bid Notice"}
            </h2>
            <p className="text-gray-600">Fill in all required details for the bid notice abstract</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
          <Button 
            className="gap-2 bg-[#002D5D] hover:bg-blue-800"
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish Notice
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="agency">Agency Details</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="contact">Contact Person</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="e.g., REF-2026-001234"
                    value={formData.referenceNumber}
                    onChange={(e) => handleChange("referenceNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solicitationNumber">Solicitation Number</Label>
                  <Input
                    id="solicitationNumber"
                    placeholder="e.g., ITB-2026-001"
                    value={formData.solicitationNumber}
                    onChange={(e) => handleChange("solicitationNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description / Scope of Work</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the project..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Project Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Quezon City, Metro Manila"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agency Details Tab */}
        <TabsContent value="agency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Procuring Entity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="procuringEntity">Procuring Entity *</Label>
                <Input
                  id="procuringEntity"
                  placeholder="e.g., Department of Education - Division of Quezon City"
                  value={formData.procuringEntity}
                  onChange={(e) => handleChange("procuringEntity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAgency">Client Agency</Label>
                <Input
                  id="clientAgency"
                  placeholder="e.g., Division Office, Department of Education"
                  value={formData.clientAgency}
                  onChange={(e) => handleChange("clientAgency", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaOfDelivery">Area of Delivery</Label>
                <Input
                  id="areaOfDelivery"
                  placeholder="e.g., Quezon City, Caloocan City"
                  value={formData.areaOfDelivery}
                  onChange={(e) => handleChange("areaOfDelivery", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procurement Details Tab */}
        <TabsContent value="procurement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Procurement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tradeAgreement">Trade Agreement</Label>
                  <Select
                    value={formData.tradeAgreement}
                    onValueChange={(value) => handleChange("tradeAgreement", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeAgreements.map((agreement) => (
                        <SelectItem key={agreement} value={agreement}>{agreement}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procurementMode">Procurement Mode *</Label>
                  <Select
                    value={formData.procurementMode}
                    onValueChange={(value) => handleChange("procurementMode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {procurementModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classification">Classification</Label>
                  <Select
                    value={formData.classification}
                    onValueChange={(value) => handleChange("classification", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classifications.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="abc">Approved Budget for the Contract (ABC) *</Label>
                  <Input
                    id="abc"
                    type="number"
                    placeholder="0.00"
                    value={formData.abc}
                    onChange={(e) => handleChange("abc", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryPeriod">Delivery Period</Label>
                  <Input
                    id="deliveryPeriod"
                    placeholder="e.g., 45 Days, 3 Months"
                    value={formData.deliveryPeriod}
                    onChange={(e) => handleChange("deliveryPeriod", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Bid Closing Date *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) => handleChange("closingTime", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preBidDate">Pre-Bid Conference Date</Label>
                  <Input
                    id="preBidDate"
                    type="date"
                    value={formData.preBidDate}
                    onChange={(e) => handleChange("preBidDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preBidTime">Pre-Bid Conference Time</Label>
                  <Input
                    id="preBidTime"
                    type="time"
                    value={formData.preBidTime}
                    onChange={(e) => handleChange("preBidTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteInspectionDate">Site Inspection Date</Label>
                  <Input
                    id="siteInspectionDate"
                    type="date"
                    value={formData.siteInspectionDate}
                    onChange={(e) => handleChange("siteInspectionDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteInspectionTime">Site Inspection Time</Label>
                  <Input
                    id="siteInspectionTime"
                    type="time"
                    value={formData.siteInspectionTime}
                    onChange={(e) => handleChange("siteInspectionTime", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Person Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Person Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input
                    id="contactName"
                    placeholder="e.g., Engr. Maria Santos"
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Position</Label>
                  <Input
                    id="contactPosition"
                    placeholder="e.g., BAC Chairperson / OIC-Engineering"
                    value={formData.contactPosition}
                    onChange={(e) => handleChange("contactPosition", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddress">Complete Address</Label>
                <Textarea
                  id="contactAddress"
                  placeholder="Street, City/Municipality, Province, ZIP Code"
                  rows={3}
                  value={formData.contactAddress}
                  onChange={(e) => handleChange("contactAddress", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    placeholder="e.g., +63 (2) 8123-4567 loc. 234"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g., bac@deped-quezoncity.gov.ph"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function BidNoticeEditorPage() {
  return (
    <Suspense fallback={null}>
      <BidNoticeEditorInner />
    </Suspense>
  )
}
