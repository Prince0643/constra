"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  Calendar,
  Edit,
  Lock,
  Activity,
  Target,
  ChevronRight,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react"

interface Document {
  id: number
  name: string
  description: string
  fileName: string
  filePath: string
  fileSize: string
  status: string
  uploadedAt?: string
  createdAt: string
}

interface UserProfile {
  id: number
  email: string
  companyName: string
  businessType: string
  dtiRegistration: string
  tinNumber: string
  businessAddress: string
  phoneNumber: string
  role: string
  verificationStatus: string
  createdAt: string
  documents: Document[]
}

const requiredDocuments = [
  { key: "DTI Registration", name: "DTI Business Registration", description: "Department of Trade and Industry Certificate" },
  { key: "Mayor's Permit", name: "Mayor's Business Permit", description: "Valid Mayor's Permit from local government" },
  { key: "BIR Registration", name: "BIR Certificate of Registration", description: "Bureau of Internal Revenue COR" },
  { key: "PCAB License", name: "PCAB License", description: "Philippine Contractors Accreditation Board License" },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState("")
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editForm, setEditForm] = useState({
    companyName: "",
    businessType: "",
    phoneNumber: "",
    businessAddress: ""
  })

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setEditForm({
          companyName: data.companyName || "",
          businessType: data.businessType || "",
          phoneNumber: data.phoneNumber || "",
          businessAddress: data.businessAddress || ""
        })
      } else {
        setError("Failed to load profile")
      }
    } catch (err) {
      setError("Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocType || !user) return
    
    setUploading(true)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("name", selectedDocType)
      formData.append("description", requiredDocuments.find(d => d.name === selectedDocType)?.description || "")

      const response = await fetch(`${API_URL}/users/me/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        await fetchProfile()
        setIsUploadOpen(false)
        setSelectedFile(null)
        setSelectedDocType("")
      } else {
        alert("Failed to upload document")
      }
    } catch (err) {
      alert("Error uploading document")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return
    
    try {
      const token = localStorage.getItem("token")
      await fetch(`${API_URL}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchProfile()
    } catch (err) {
      alert("Error deleting document")
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        await fetchProfile()
        setIsEditOpen(false)
      } else {
        alert("Failed to update profile")
      }
    } catch (err) {
      alert("Error updating profile")
    }
  }

  const getDocumentStatus = (docName: string) => {
    if (!user?.documents) return "missing"
    const doc = user.documents.find(d => d.name === docName)
    return doc ? doc.status : "missing"
  }

  const getDocumentByName = (docName: string) => {
    return user?.documents?.find(d => d.name === docName)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002D5D]" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">{error || "Failed to load profile"}</p>
          <Button onClick={fetchProfile} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">My Profile</h2>
          <p className="text-gray-600 mt-1">Personal Information and Account Details</p>
        </div>
        <Button 
          className="gap-2 bg-[#002D5D] hover:bg-blue-800"
          onClick={() => setIsEditOpen(true)}
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[#002D5D] to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-[#002D5D]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user.companyName}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={
                  user.verificationStatus === "Verified" 
                    ? "bg-green-500 text-white border-none" 
                    : "bg-orange-500 text-white border-none"
                }>
                  {user.verificationStatus}
                </Badge>
                <Badge className="bg-white/20 text-white border-none">{user.role}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{user.businessType || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y">
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1">Company Name</dt>
                <dd className="font-medium text-[#002D5D]">{user.companyName}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1">Business Type</dt>
                <dd className="font-medium">{user.businessType || "Not specified"}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1">DTI Registration</dt>
                <dd className="font-mono font-medium">{user.dtiRegistration || "Not provided"}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1">TIN Number</dt>
                <dd className="font-mono font-medium">{user.tinNumber || "Not provided"}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1">Business Address</dt>
                <dd className="font-medium">{user.businessAddress || "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y">
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </dt>
                <dd className="font-medium">{user.phoneNumber || "Not provided"}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </dt>
                <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Role
                </dt>
                <dd>
                  <Badge className="bg-[#002D5D] text-white">{user.role}</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Required Documents Section */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Required Documents
            </CardTitle>
            <Button 
              className="gap-2 bg-[#002D5D] hover:bg-blue-800"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {requiredDocuments.map((doc) => {
              const status = getDocumentStatus(doc.name)
              const uploadedDoc = getDocumentByName(doc.name)
              
              return (
                <div key={doc.key} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      status === "verified" ? "bg-green-100" :
                      status === "pending" ? "bg-orange-100" :
                      "bg-gray-100"
                    }`}>
                      {status === "verified" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : status === "pending" ? (
                        <Clock className="w-5 h-5 text-orange-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#002D5D]">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                      {uploadedDoc && (
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded: {new Date(uploadedDoc.uploadedAt || uploadedDoc.createdAt).toLocaleDateString()}
                          {" "}• {uploadedDoc.fileSize}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      status === "verified" ? "bg-green-100 text-green-700" :
                      status === "pending" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    }>
                      {status === "missing" ? "Required" : status}
                    </Badge>
                    {uploadedDoc && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => window.open(`${API_URL}/uploads/${uploadedDoc.filePath}`, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteDocument(uploadedDoc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Account Status</p>
              <Badge className={user.verificationStatus === "Verified" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                {user.verificationStatus}
              </Badge>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="font-medium text-[#002D5D]">
                {user.documents?.filter(d => d.status === "verified").length || 0} / {requiredDocuments.length}
              </p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="font-medium text-[#002D5D]">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Bids Submitted</p>
              <p className="font-medium text-[#002D5D]">Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Lock className="w-6 h-6 text-[#002D5D]" />
              </div>
              <div>
                <h3 className="font-medium text-[#002D5D]">Reset Passphrase</h3>
                <p className="text-sm text-gray-500">Change your password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#002D5D]" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Activity className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium text-green-700">Activity Log</h3>
                <p className="text-sm text-gray-500">View your activity</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-700" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Target className="w-6 h-6 text-orange-700" />
              </div>
              <div>
                <h3 className="font-medium text-orange-700">Bid Matching</h3>
                <p className="text-sm text-gray-500">Set preferences</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-700" />
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D]">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={editForm.companyName}
                onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={editForm.businessType}
                onChange={(e) => setEditForm({...editForm, businessType: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                value={editForm.businessAddress}
                onChange={(e) => setEditForm({...editForm, businessAddress: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#002D5D] hover:bg-blue-800"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D]">Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <select
                id="docType"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
              >
                <option value="">Select document type...</option>
                {requiredDocuments.map((doc) => (
                  <option key={doc.key} value={doc.name}>{doc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG (max 10MB)
              </p>
            </div>
            {selectedFile && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                setIsUploadOpen(false)
                setSelectedFile(null)
                setSelectedDocType("")
              }}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#002D5D] hover:bg-blue-800"
              onClick={handleUpload}
              disabled={!selectedFile || !selectedDocType || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
