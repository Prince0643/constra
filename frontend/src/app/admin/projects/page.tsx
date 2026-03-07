"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FileText, Eye, Edit, Trash2, Loader2, XCircle, Upload, FolderOpen, Download, Import, FileSpreadsheet } from "lucide-react"

// Field Options
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

const classifications = [
  "Goods",
  "Infrastructure",
  "Consulting Services",
  "Services"
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
  "Printing Services",
  "Catering Services",
  "Educational Supplies"
]

const businessCategories = [
  "Construction Materials",
  "Educational Supplies",
  "Catering Services",
  "Office Supplies",
  "Medical Equipment",
  "IT Services",
  "Consulting Services",
  "Transportation Services",
  "Maintenance Services",
  "Printing Services",
  "Others"
]

const tradeAgreements = [
  "Implementing Rules and Regulations",
  "General Procurement",
  "GPPB Resolution No. 04-2021",
  "No Trade Agreement"
]

const requirementTemplates = [
  { name: "Financial Proposal", description: "Must include cost breakdown", required: true },
  { name: "Technical Specifications", description: "Detailed project specs", required: true },
  { name: "Company Profile", description: "Company background and experience", required: false },
  { name: "Certificate of PhilGEPS Registration", description: "Valid PhilGEPS registration", required: true },
]

interface ProjectFormData {
  referenceNumber: string
  solicitationNumber: string
  title: string
  procuringEntity: string
  abc: string
  procurementMode: string
  classification: string
  category: string
  businessCategory: string
  tradeAgreement: string
  areaOfDelivery: string
  deliveryPeriod: string
  deadline: string
  closingTime: string
  datePublished: string
  preBidDate: string
  preBidTime: string
  siteInspectionDate: string
  siteInspectionTime: string
  contactName: string
  contactPosition: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  description: string
  location: string
  status: "Open" | "Closed" | "Draft"
  requirements: string[]
}

const initialFormData: ProjectFormData = {
  referenceNumber: "",
  solicitationNumber: "",
  title: "",
  procuringEntity: "",
  abc: "",
  procurementMode: "Competitive Bidding - Public",
  classification: "Goods",
  category: "",
  businessCategory: "",
  tradeAgreement: "Implementing Rules and Regulations",
  areaOfDelivery: "",
  deliveryPeriod: "",
  deadline: "",
  closingTime: "17:00",
  datePublished: "",
  preBidDate: "",
  preBidTime: "10:00",
  siteInspectionDate: "",
  siteInspectionTime: "09:00",
  contactName: "",
  contactPosition: "",
  contactAddress: "",
  contactPhone: "",
  contactEmail: "",
  description: "",
  location: "",
  status: "Draft",
  requirements: []
}

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDocsDialogOpen, setIsViewDocsDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [projectDocuments, setProjectDocuments] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [activeTab, setActiveTab] = useState("identification")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Project Title is required"
    }
    if (!formData.procuringEntity.trim()) {
      errors.procuringEntity = "Procuring Entity is required"
    }
    if (!formData.abc || parseFloat(formData.abc) <= 0) {
      errors.abc = "Approved Budget (ABC) must be greater than 0"
    }
    if (!formData.procurementMode) {
      errors.procurementMode = "Procurement Mode is required"
    }
    if (!formData.classification) {
      errors.classification = "Classification is required"
    }
    if (!formData.category) {
      errors.category = "Category is required"
    }
    if (!formData.deadline) {
      errors.deadline = "Bid Deadline is required"
    }
    if (!formData.areaOfDelivery.trim()) {
      errors.areaOfDelivery = "Area of Delivery is required"
    }
    if (!formData.deliveryPeriod.trim()) {
      errors.deliveryPeriod = "Delivery Period is required"
    }
    if (!formData.datePublished) {
      errors.datePublished = "Date Published is required"
    }
    if (!formData.contactName.trim()) {
      errors.contactName = "Contact Person Name is required"
    }
    if (!formData.contactPosition.trim()) {
      errors.contactPosition = "Contact Position is required"
    }
    if (!formData.contactAddress.trim()) {
      errors.contactAddress = "Contact Address is required"
    }
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = "Contact Phone is required"
    }
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = "Contact Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const generateReferenceNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(1000 + Math.random() * 9000)
    return `REF-${year}-${random}`
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const errorFields = Object.keys(formErrors)
      if (errorFields.some(f => ["title", "procuringEntity", "referenceNumber", "solicitationNumber"].includes(f))) {
        setActiveTab("identification")
      } else if (errorFields.some(f => ["abc", "procurementMode", "classification", "category", "businessCategory"].includes(f))) {
        setActiveTab("financial")
      } else if (errorFields.some(f => ["deadline", "closingTime", "datePublished", "areaOfDelivery", "deliveryPeriod"].includes(f))) {
        setActiveTab("timeline")
      } else if (errorFields.some(f => ["contactName", "contactPosition", "contactAddress", "contactPhone", "contactEmail", "description"].includes(f))) {
        setActiveTab("personnel")
      }
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const referenceNumber = formData.referenceNumber || generateReferenceNumber()

      const requirements = requirementTemplates
        .filter(req => formData.requirements.includes(req.name))
        .map(req => ({ name: req.name, description: req.description, required: req.required }))

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          referenceNumber,
          abc: parseFloat(formData.abc),
          requirements
        })
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setFormData(initialFormData)
        fetchProjects()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create project")
      }
    } catch (error) {
      console.error("Create project error:", error)
      alert("Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          abc: parseFloat(formData.abc)
        })
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        fetchProjects()
      } else {
        alert("Failed to update project")
      }
    } catch (error) {
      console.error("Update project error:", error)
      alert("Failed to update project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects/${selectedProject.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        fetchProjects()
      } else {
        alert("Failed to delete project")
      }
    } catch (error) {
      console.error("Delete project error:", error)
      alert("Failed to delete project")
    }
  }

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject || !uploadFiles || uploadFiles.length === 0) {
      alert("Please select at least one file to upload")
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem("token")
      const formDataFiles = new FormData()

      for (let i = 0; i < uploadFiles.length; i++) {
        formDataFiles.append("documents", uploadFiles[i])
      }

      const response = await fetch(`${API_URL}/projects/${selectedProject.id}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataFiles
      })

      if (response.ok) {
        setIsUploadDialogOpen(false)
        setUploadFiles(null)
        alert("Documents uploaded successfully!")
        fetchProjects()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload documents")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload documents")
    } finally {
      setUploading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = [
      "Reference Number",
      "Solicitation Number",
      "Project Title",
      "Procuring Entity",
      "ABC",
      "Procurement Mode",
      "Classification",
      "Category",
      "Business Category",
      "Area of Delivery",
      "Delivery Period",
      "Closing Date",
      "Closing Time",
      "Date Published",
      "Contact Name",
      "Contact Position",
      "Contact Phone",
      "Contact Email",
      "Status"
    ]

    const csvContent = [
      headers.join(","),
      ...projects.map(project => [
        `"${project.referenceNumber || ""}"`,
        `"${project.solicitationNumber || ""}"`,
        `"${project.title || ""}"`,
        `"${project.procuringEntity || ""}"`,
        project.abc || 0,
        `"${project.procurementMode || ""}"`,
        `"${project.classification || ""}"`,
        `"${project.category || ""}"`,
        `"${project.businessCategory || ""}"`,
        `"${project.areaOfDelivery || ""}"`,
        `"${project.deliveryPeriod || ""}"`,
        `"${project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ""}"`,
        `"${project.closingTime || ""}"`,
        `"${project.datePublished ? new Date(project.datePublished).toISOString().split('T')[0] : ""}"`,
        `"${project.contactName || ""}"`,
        `"${project.contactPosition || ""}"`,
        `"${project.contactPhone || ""}"`,
        `"${project.contactEmail || ""}"`,
        `"${project.status || ""}"`
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    setIsExportDialogOpen(false)
  }

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) {
      alert("Please select a CSV file to import")
      return
    }

    setImporting(true)
    try {
      const text = await importFile.text()
      const lines = text.split("\n")
      if (lines.length < 2) {
        alert("CSV file is empty or invalid")
        return
      }

      const token = localStorage.getItem("token")
      let successCount = 0
      let errorCount = 0

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values: string[] = []
        let current = ""
        let inQuotes = false
        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim())

        const cleanValues = values.map(v => v.replace(/^"|"$/g, ""))

        const projectData = {
          referenceNumber: cleanValues[0] || generateReferenceNumber(),
          solicitationNumber: cleanValues[1] || "",
          title: cleanValues[2] || "",
          procuringEntity: cleanValues[3] || "",
          abc: parseFloat(cleanValues[4]) || 0,
          procurementMode: cleanValues[5] || "Competitive Bidding - Public",
          classification: cleanValues[6] || "Goods",
          category: cleanValues[7] || "",
          businessCategory: cleanValues[8] || "",
          areaOfDelivery: cleanValues[9] || "",
          deliveryPeriod: cleanValues[10] || "",
          deadline: cleanValues[11] || new Date().toISOString().split('T')[0],
          closingTime: cleanValues[12] || "17:00",
          datePublished: cleanValues[13] || new Date().toISOString().split('T')[0],
          contactName: cleanValues[14] || "",
          contactPosition: cleanValues[15] || "",
          contactPhone: cleanValues[16] || "",
          contactEmail: cleanValues[17] || "",
          status: cleanValues[18] || "Open",
          description: "",
          location: cleanValues[9] || ""
        }

        try {
          const response = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
          })
          if (response.ok) {
            successCount++
          } else {
            errorCount++
          }
        } catch {
          errorCount++
        }
      }

      alert(`Import complete: ${successCount} projects imported, ${errorCount} errors`)
      setIsImportDialogOpen(false)
      setImportFile(null)
      fetchProjects()
    } catch (error) {
      console.error("Import error:", error)
      alert("Failed to import projects")
    } finally {
      setImporting(false)
    }
  }

  const openViewDialog = (project: any) => {
    setSelectedProject(project)
    setIsViewDialogOpen(true)
  }

  const openEditDialog = (project: any) => {
    setSelectedProject(project)
    setFormData({
      referenceNumber: project.referenceNumber || "",
      solicitationNumber: project.solicitationNumber || "",
      title: project.title || "",
      procuringEntity: project.procuringEntity || "",
      abc: project.abc?.toString() || "",
      procurementMode: project.procurementMode || "Competitive Bidding - Public",
      classification: project.classification || "Goods",
      category: project.category || "",
      businessCategory: project.businessCategory || "",
      tradeAgreement: project.tradeAgreement || "Implementing Rules and Regulations",
      areaOfDelivery: project.areaOfDelivery || "",
      deliveryPeriod: project.deliveryPeriod || "",
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
      closingTime: project.closingTime || "17:00",
      datePublished: project.datePublished ? new Date(project.datePublished).toISOString().split('T')[0] : "",
      preBidDate: project.preBidDate ? new Date(project.preBidDate).toISOString().split('T')[0] : "",
      preBidTime: project.preBidTime || "10:00",
      siteInspectionDate: project.siteInspectionDate ? new Date(project.siteInspectionDate).toISOString().split('T')[0] : "",
      siteInspectionTime: project.siteInspectionTime || "09:00",
      contactName: project.contactName || "",
      contactPosition: project.contactPosition || "",
      contactAddress: project.contactAddress || "",
      contactPhone: project.contactPhone || "",
      contactEmail: project.contactEmail || "",
      description: project.description || "",
      location: project.location || "",
      status: project.status || "Draft",
      requirements: []
    })
    setFormErrors({})
    setActiveTab("identification")
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (project: any) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const openUploadDialog = (project: any) => {
    setSelectedProject(project)
    setUploadFiles(null)
    setIsUploadDialogOpen(true)
  }

  const openViewDocsDialog = async (project: any) => {
    setSelectedProject(project)
    setIsViewDocsDialogOpen(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/projects/${project.id}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProjectDocuments(data)
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      setProjectDocuments([])
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.procuringEntity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderProjectForm = (isEdit: boolean) => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="identification">Identification</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="personnel">Personnel</TabsTrigger>
      </TabsList>

      {/* Project Identification Tab */}
      <TabsContent value="identification" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Identification Fields
            </CardTitle>
            <CardDescription>
              Primary identifiers for each project to ensure data integrity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference Number <span className="text-red-500">*</span></Label>
                <Input
                  id="referenceNumber"
                  placeholder="e.g., REF-2026-001234"
                  value={formData.referenceNumber}
                  onChange={(e) => handleChange("referenceNumber", e.target.value)}
                  className={formErrors.referenceNumber ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">Leave blank to auto-generate</p>
                {formErrors.referenceNumber && <p className="text-xs text-red-500">{formErrors.referenceNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="solicitationNumber">Solicitation Number</Label>
                <Input
                  id="solicitationNumber"
                  placeholder="e.g., ITB-2026-001"
                  value={formData.solicitationNumber}
                  onChange={(e) => handleChange("solicitationNumber", e.target.value)}
                />
                <p className="text-xs text-gray-500">Internal agency tracking number</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g., Procurement of Supplies for Moving Up and Graduation 2026"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="procuringEntity">Procuring Entity <span className="text-red-500">*</span></Label>
              <Input
                id="procuringEntity"
                placeholder="e.g., Department of Education - Division of Quezon City"
                value={formData.procuringEntity}
                onChange={(e) => handleChange("procuringEntity", e.target.value)}
                className={formErrors.procuringEntity ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-500">Name of the government agency requesting the project</p>
              {formErrors.procuringEntity && <p className="text-xs text-red-500">{formErrors.procuringEntity}</p>}
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

      {/* Financial & Classification Tab */}
      <TabsContent value="financial" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Financial & Classification Fields
            </CardTitle>
            <CardDescription>
              Budget reporting and data analytics information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abc">Approved Budget (ABC) <span className="text-red-500">*</span> (PHP)</Label>
                <Input
                  id="abc"
                  type="number"
                  placeholder="0.00"
                  value={formData.abc}
                  onChange={(e) => handleChange("abc", e.target.value)}
                  className={formErrors.abc ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">Total maximum budget allocated</p>
                {formErrors.abc && <p className="text-xs text-red-500">{formErrors.abc}</p>}
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procurementMode">Procurement Mode <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.procurementMode}
                  onValueChange={(value) => handleChange("procurementMode", value)}
                >
                  <SelectTrigger className={formErrors.procurementMode ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select mode..." />
                  </SelectTrigger>
                  <SelectContent>
                    {procurementModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.procurementMode && <p className="text-xs text-red-500">{formErrors.procurementMode}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="classification">Classification <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.classification}
                  onValueChange={(value) => handleChange("classification", value)}
                >
                  <SelectTrigger className={formErrors.classification ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select classification..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classifications.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.classification && <p className="text-xs text-red-500">{formErrors.classification}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessCategory">Business Category</Label>
                <Select
                  value={formData.businessCategory}
                  onValueChange={(value) => handleChange("businessCategory", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Specific industry sector</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Timeline & Logistics Tab */}
      <TabsContent value="timeline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Timeline & Logistics Fields
            </CardTitle>
            <CardDescription>
              Delivery schedules and project completion deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="areaOfDelivery">Area of Delivery <span className="text-red-500">*</span></Label>
                <Input
                  id="areaOfDelivery"
                  placeholder="e.g., Quezon City, Caloocan City"
                  value={formData.areaOfDelivery}
                  onChange={(e) => handleChange("areaOfDelivery", e.target.value)}
                  className={formErrors.areaOfDelivery ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">Specific location or province</p>
                {formErrors.areaOfDelivery && <p className="text-xs text-red-500">{formErrors.areaOfDelivery}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryPeriod">Delivery Period <span className="text-red-500">*</span></Label>
                <Input
                  id="deliveryPeriod"
                  placeholder="e.g., 45 Days, 3 Months"
                  value={formData.deliveryPeriod}
                  onChange={(e) => handleChange("deliveryPeriod", e.target.value)}
                  className={formErrors.deliveryPeriod ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">Required days to complete work</p>
                {formErrors.deliveryPeriod && <p className="text-xs text-red-500">{formErrors.deliveryPeriod}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Bid Closing Date <span className="text-red-500">*</span></Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className={formErrors.deadline ? "border-red-500" : ""}
                />
                {formErrors.deadline && <p className="text-xs text-red-500">{formErrors.deadline}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time</Label>
                <Input
                  id="closingTime"
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => handleChange("closingTime", e.target.value)}
                />
                <p className="text-xs text-gray-500">Final deadline for submissions</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="datePublished">Date Published <span className="text-red-500">*</span></Label>
              <Input
                id="datePublished"
                type="date"
                value={formData.datePublished}
                onChange={(e) => handleChange("datePublished", e.target.value)}
                className={formErrors.datePublished ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-500">Date first officially recorded in the system</p>
              {formErrors.datePublished && <p className="text-xs text-red-500">{formErrors.datePublished}</p>}
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Optional Schedule Events</p>
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

              <div className="grid grid-cols-2 gap-4 mt-3">
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Personnel & Documentation Tab */}
      <TabsContent value="personnel" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Personnel & Documentation Fields
            </CardTitle>
            <CardDescription>
              Contact information and project scope details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person Name <span className="text-red-500">*</span></Label>
                <Input
                  id="contactName"
                  placeholder="e.g., Engr. Maria Santos"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                  className={formErrors.contactName ? "border-red-500" : ""}
                />
                {formErrors.contactName && <p className="text-xs text-red-500">{formErrors.contactName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPosition">Position/Designation <span className="text-red-500">*</span></Label>
                <Input
                  id="contactPosition"
                  placeholder="e.g., BAC Chairperson / OIC-Engineering"
                  value={formData.contactPosition}
                  onChange={(e) => handleChange("contactPosition", e.target.value)}
                  className={formErrors.contactPosition ? "border-red-500" : ""}
                />
                {formErrors.contactPosition && <p className="text-xs text-red-500">{formErrors.contactPosition}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress">Office Address <span className="text-red-500">*</span></Label>
              <Textarea
                id="contactAddress"
                placeholder="Street, City/Municipality, Province, ZIP Code"
                rows={2}
                value={formData.contactAddress}
                onChange={(e) => handleChange("contactAddress", e.target.value)}
                className={formErrors.contactAddress ? "border-red-500" : ""}
              />
              {formErrors.contactAddress && <p className="text-xs text-red-500">{formErrors.contactAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="contactPhone"
                  placeholder="e.g., +63 (2) 8123-4567 loc. 234"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  className={formErrors.contactPhone ? "border-red-500" : ""}
                />
                {formErrors.contactPhone && <p className="text-xs text-red-500">{formErrors.contactPhone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g., bac@deped-quezoncity.gov.ph"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className={formErrors.contactEmail ? "border-red-500" : ""}
                />
                {formErrors.contactEmail && <p className="text-xs text-red-500">{formErrors.contactEmail}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Abstract</Label>
              <Textarea
                id="description"
                placeholder="Brief paragraph explaining the scope of work or a detailed list of required items..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <p className="text-xs text-gray-500">Project scope explanation or required items list</p>
            </div>
          </CardContent>
        </Card>

        {!isEdit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D]">Required Documents Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 space-y-3">
                {requirementTemplates.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`req-${index}`}
                      className="mt-1"
                      checked={formData.requirements.includes(req.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, requirements: [...prev.requirements, req.name] }))
                        } else {
                          setFormData(prev => ({ ...prev, requirements: prev.requirements.filter(r => r !== req.name) }))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`req-${index}`} className="font-medium cursor-pointer">
                        {req.name}
                        {req.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <p className="text-sm text-gray-500">{req.description}</p>
                    </div>
                    <Badge variant={req.required ? "default" : "outline"}>
                      {req.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage construction projects and bidding opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Import className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in all required project details. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                {renderProjectForm(false)}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage all construction projects</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference #</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Procuring Entity</TableHead>
                <TableHead>Budget (ABC)</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {isLoading ? "Loading..." : "No projects found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium text-[#002D5D]">{project.referenceNumber || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-xs text-gray-500">{project.category}</div>
                    </TableCell>
                    <TableCell>{project.procuringEntity || "N/A"}</TableCell>
                    <TableCell>₱{project.abc?.toLocaleString()}</TableCell>
                    <TableCell>
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={project.status === "Open" ? "default" : project.status === "Draft" ? "secondary" : "outline"}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUploadDialog(project)}
                          title="Upload Documents"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDocsDialog(project)}
                          title="View Documents"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(project)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => openDeleteDialog(project)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Viewing details for {selectedProject?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Title</p>
                <p className="font-medium">{selectedProject?.title}</p>
              </div>
              <div>
                <p className="text-gray-500">Budget (ABC)</p>
                <p className="font-medium">₱{selectedProject?.abc?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{selectedProject?.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Deadline</p>
                <p className="font-medium">{selectedProject?.deadline}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge className={selectedProject?.status === 'Open' ? 'bg-green-100 text-green-700' : selectedProject?.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}>
                  {selectedProject?.status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Bids</p>
                <p className="font-medium">{selectedProject?._count?.bids || 0}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Description</p>
              <p className="text-sm">{selectedProject?.description || "No description provided"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Edit project details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProject} className="space-y-4">
            {renderProjectForm(true)}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedProject?.title}</strong>?
              <br /><br />
              This action cannot be undone. All bids for this project will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Documents Dialog */}
      <Dialog open={isViewDocsDialogOpen} onOpenChange={setIsViewDocsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Documents</DialogTitle>
            <DialogDescription>
              Documents uploaded for <strong>{selectedProject?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {projectDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents uploaded yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setIsViewDocsDialogOpen(false)
                    openUploadDialog(selectedProject)
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            ) : (
              <div className="divide-y border rounded-lg">
                {projectDocuments.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#002D5D]" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.fileSize} • {doc.mimeType}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Upload className="w-4 h-4 rotate-180" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDocsDialogOpen(false)}>
              Close
            </Button>
            {projectDocuments.length > 0 && (
              <Button 
                onClick={() => {
                  setIsViewDocsDialogOpen(false)
                  openUploadDialog(selectedProject)
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload More
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Documents Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Project Documents</DialogTitle>
            <DialogDescription>
              Upload bidding documents for <strong>{selectedProject?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadDocuments} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documents">Select Documents</Label>
              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                onChange={(e) => setUploadFiles(e.target.files)}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, Word, Excel, ZIP. Max 10MB per file.
              </p>
              {uploadFiles && uploadFiles.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-[#002D5D]">
                    {uploadFiles.length} file(s) selected:
                  </p>
                  <ul className="text-sm text-gray-600 mt-1">
                    {Array.from(uploadFiles).map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading || !uploadFiles || uploadFiles.length === 0}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
