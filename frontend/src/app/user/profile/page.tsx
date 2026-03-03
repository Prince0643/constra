"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle, UserCircle, Mail, Phone, MapPin, Calendar, Loader2, Upload, FileText, X } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  const requiredDocs = [
    { key: "dtiRegistration", name: "DTI Registration", description: "Department of Trade and Industry registration certificate" },
    { key: "businessPermit", name: "Business Permit", description: "Valid business permit from local government" },
    { key: "mayorsPermit", name: "Mayor's Permit", description: "Mayor's permit to operate" }
  ]

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (docType: string, file: File) => {
    setUploadingDoc(docType)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", requiredDocs.find(d => d.key === docType)?.name || docType)
      formData.append("description", requiredDocs.find(d => d.key === docType)?.description || "")

      const response = await fetch(`${API_URL}/users/me/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        await fetchProfile()
      } else {
        alert("Failed to upload document")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload document")
    } finally {
      setUploadingDoc(null)
    }
  }

  const hasDocument = (docType: string) => {
    return documents.some(d => d.name === requiredDocs.find(r => r.key === docType)?.name)
  }

  const getDocument = (docType: string) => {
    return documents.find(d => d.name === requiredDocs.find(r => r.key === docType)?.name)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return <p className="text-center text-gray-500">Failed to load profile</p>
  }

  const verificationStatus = user.verificationStatus || "Pending"
  const verifiedCount = documents.filter((d: any) => d.status === "verified").length
  const progress = documents.length > 0 ? (verifiedCount / documents.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">Manage your account information and company documents</p>
      </div>

      {/* Verification Status Alert */}
      {verificationStatus === "Pending" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Clock className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your documents are under review. You will be notified once the verification is complete.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Verified" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertTitle className="text-green-800">Account Verified</AlertTitle>
          <AlertDescription className="text-green-700">
            Your account and all documents have been verified. You can now bid on all available projects.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Rejected" && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            Your verification was rejected. Please review the feedback and resubmit your documents.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">{user.companyName || "Company Name"}</h3>
            <Badge className="mt-2" variant={verificationStatus === "Verified" ? "default" : verificationStatus === "Pending" ? "secondary" : "destructive"}>
              {verificationStatus}
            </Badge>
            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.businessAddress || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since {user.createdAt?.split('T')[0]}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                  <p className="text-gray-900">{user.companyName || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Business Type</Label>
                  <p className="text-gray-900">{user.businessType || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">DTI Registration</Label>
                  <p className="text-gray-900">{user.dtiRegistration || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">TIN Number</Label>
                  <p className="text-gray-900">{user.tinNumber || "N/A"}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Business Address</Label>
                <p className="text-gray-900">{user.businessAddress || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Document Verification Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload required documents for bidding verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Document Completion</span>
                  <span className="text-sm font-medium">
                    {requiredDocs.filter(d => hasDocument(d.key)).length}/{requiredDocs.length}
                  </span>
                </div>
                <Progress 
                  value={(requiredDocs.filter(d => hasDocument(d.key)).length / requiredDocs.length) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-4">
                {requiredDocs.map((doc) => {
                  const uploadedDoc = getDocument(doc.key)
                  const isUploaded = !!uploadedDoc

                  return (
                    <div 
                      key={doc.key} 
                      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                        isUploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {isUploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-400" />
                            )}
                            <h4 className={`font-medium ${isUploaded ? 'text-green-800' : 'text-gray-900'}`}>
                              {doc.name}
                            </h4>
                            {isUploaded && (
                              <Badge className="bg-green-100 text-green-700">Uploaded</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-7">{doc.description}</p>
                          
                          {isUploaded && uploadedDoc && (
                            <div className="ml-7 mt-2 text-xs text-gray-600">
                              <p>File: {uploadedDoc.fileName}</p>
                              <p>Size: {uploadedDoc.fileSize}</p>
                              <p>Status: <span className={uploadedDoc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}>{uploadedDoc.status}</span></p>
                            </div>
                          )}
                        </div>

                        {!isUploaded ? (
                          <div className="ml-4">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id={`file-${doc.key}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(doc.key, file)
                              }}
                              disabled={uploadingDoc === doc.key}
                            />
                            <Label htmlFor={`file-${doc.key}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="cursor-pointer"
                                disabled={uploadingDoc === doc.key}
                                asChild
                              >
                                <span>
                                  {uploadingDoc === doc.key ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4 mr-1" />
                                  )}
                                  {uploadingDoc === doc.key ? 'Uploading...' : 'Upload'}
                                </span>
                              </Button>
                            </Label>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-900 mb-1">Documents Auto-Attached to Bids</h4>
                <p className="text-sm text-blue-700">
                  These documents are required for bidding verification. Once uploaded and verified, 
                  they will be automatically attached to all your bid submissions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
