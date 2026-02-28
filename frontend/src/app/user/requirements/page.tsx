"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle, FileText, Upload, Loader2, Check, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MyRequirementsPage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const hasDocument = (docType: string) => {
    return documents.some(d => d.name === requiredDocs.find(r => r.key === docType)?.name)
  }

  const getDocument = (docType: string) => {
    return documents.find(d => d.name === requiredDocs.find(r => r.key === docType)?.name)
  }

  const uploadedCount = requiredDocs.filter(d => hasDocument(d.key)).length
  const progress = (uploadedCount / requiredDocs.length) * 100
  const allUploaded = uploadedCount === requiredDocs.length

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Requirements</h2>
        <p className="text-gray-600">View and confirm your uploaded company documents</p>
      </div>

      {/* Status Alert */}
      {!allUploaded && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Documents Incomplete</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You have uploaded {uploadedCount} of {requiredDocs.length} required documents. 
            Please upload all documents to complete your verification.
          </AlertDescription>
        </Alert>
      )}

      {allUploaded && user?.verificationStatus !== "Verified" && (
        <Alert className="bg-blue-50 border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Under Review</AlertTitle>
          <AlertDescription className="text-blue-700">
            All required documents have been uploaded. Your account is pending admin verification.
          </AlertDescription>
        </Alert>
      )}

      {allUploaded && user?.verificationStatus === "Verified" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertTitle className="text-green-800">Verification Complete</AlertTitle>
          <AlertDescription className="text-green-700">
            All documents verified! You can now bid on projects.
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Document Completion</CardTitle>
          <CardDescription>
            {uploadedCount} of {requiredDocs.length} documents uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {allUploaded 
              ? "All required documents have been submitted!" 
              : `Upload ${requiredDocs.length - uploadedCount} more document(s) to complete your profile.`}
          </p>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Review your submitted documents and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredDocs.map((doc) => {
              const uploadedDoc = getDocument(doc.key)
              const isUploaded = !!uploadedDoc

              return (
                <div 
                  key={doc.key} 
                  className={`p-4 rounded-lg border-2 ${
                    isUploaded 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isUploaded ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {isUploaded ? (
                        <Check className={`w-5 h-5 ${uploadedDoc?.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`} />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        {isUploaded ? (
                          <Badge className={uploadedDoc?.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {uploadedDoc?.status === 'verified' ? 'Verified' : 'Pending Review'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Not Uploaded</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{doc.description}</p>

                      {isUploaded && uploadedDoc && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <p className="text-gray-900 font-medium">{uploadedDoc.fileName}</p>
                              <p className="text-gray-500">{uploadedDoc.fileSize} • Uploaded on {uploadedDoc.createdAt?.split('T')[0]}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      )}

                      {!isUploaded && (
                        <div className="mt-3">
                          <Link href="/user/profile">
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-1" />
                              Upload Now
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/user/profile" className="flex-1">
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload More Documents
          </Button>
        </Link>
        <Link href="/user/verification" className="flex-1">
          <Button variant="outline" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Verification Status
          </Button>
        </Link>
      </div>
    </div>
  )
}
