"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react"

export default function VerificationPage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  const requiredDocs = [
    { name: "DTI Registration", description: "Department of Trade and Industry registration certificate" },
    { name: "Business Permit", description: "Mayor's Business Permit" },
    { name: "Company Profile", description: "Company background and portfolio" },
    { name: "Financial Documents", description: "Financial statements or bank certificate" },
  ]

  useEffect(() => {
    fetchVerificationData()
  }, [])

  const fetchVerificationData = async () => {
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
      console.error("Failed to fetch verification data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (docName: string, file: File | null) => {
    if (!file) return
    
    try {
      setUploadingDoc(docName)
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", docName)
      formData.append("description", requiredDocs.find(d => d.name === docName)?.description || "")
      
      const response = await fetch(`${API_URL}/users/me/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      
      if (response.ok) {
        fetchVerificationData()
      } else {
        alert("Failed to upload document")
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploadingDoc(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return <p className="text-center text-gray-500">Failed to load verification data</p>
  }

  const verificationStatus = user.verificationStatus || "Pending"
  const uploadedCount = documents.length
  const totalRequired = requiredDocs.length
  const progress = (uploadedCount / totalRequired) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Verification</h2>
        <p className="text-gray-600">Submit required documents to verify your account</p>
      </div>

      {/* Status Alert */}
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

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Document Submission Progress</CardTitle>
          <CardDescription>Upload all required documents for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-sm font-medium">{uploadedCount}/{totalRequired}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {requiredDocs.map((doc) => {
              const uploadedDoc = documents.find((d: any) => d.name === doc.name)
              const isUploaded = !!uploadedDoc

              return (
                <div key={doc.name} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${isUploaded ? "bg-green-100" : "bg-gray-100"}`}>
                        {isUploaded ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                        {uploadedDoc && (
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded: {uploadedDoc.fileName} ({uploadedDoc.fileSize})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <Badge className="bg-green-100 text-green-700">Uploaded</Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-40 text-sm"
                            onChange={(e) => handleFileUpload(doc.name, e.target.files?.[0] || null)}
                            disabled={uploadingDoc === doc.name}
                          />
                          {uploadingDoc === doc.name && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
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

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>All documents must be clear and readable</li>
            <li>Accepted formats: PDF, JPG, PNG</li>
            <li>Maximum file size: 10MB per document</li>
            <li>Documents will be reviewed within 1-2 business days</li>
            <li>You will be notified via email once verification is complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
