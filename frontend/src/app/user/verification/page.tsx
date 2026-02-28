"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react"

const documents = [
  { 
    id: 1, 
    name: "DTI Registration", 
    description: "Department of Trade and Industry Business Registration",
    status: "verified", 
    submittedAt: "2024-01-15",
    fileName: "DTI_Registration_ABC_Corp.pdf",
    fileSize: "2.4 MB"
  },
  { 
    id: 2, 
    name: "Business Permit", 
    description: "Mayor's Business Permit",
    status: "verified", 
    submittedAt: "2024-01-15",
    fileName: "Business_Permit_2024.pdf",
    fileSize: "1.8 MB"
  },
  { 
    id: 3, 
    name: "Mayor's Permit", 
    description: "Mayor's Permit to Operate",
    status: "verified", 
    submittedAt: "2024-01-15",
    fileName: "Mayors_Permit_ABC_Corp.pdf",
    fileSize: "1.2 MB"
  },
]

export default function VerificationPage() {
  // Mock verification status - can be "Pending", "Verified", or "Rejected"
  let verificationStatus: "Pending" | "Verified" | "Rejected" = "Verified"
  let rejectionReason = ""

  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null)

  const handleFileUpload = (docId: number, file: File | null) => {
    if (file) {
      setUploadingDoc(docId)
      // Simulate upload
      setTimeout(() => {
        setUploadingDoc(null)
      }, 2000)
    }
  }

  const verifiedCount = documents.filter(d => d.status === "verified").length
  const progress = (verifiedCount / documents.length) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Verification</h2>
        <p className="text-gray-600">Manage your company documents and verification status</p>
      </div>

      {/* Verification Status Alert */}
      {verificationStatus === "Pending" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Clock className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your documents are under review. You will be notified once the verification is complete. 
            This typically takes 1-2 business days.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Verified" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertTitle className="text-green-800">Account Verified</AlertTitle>
          <AlertDescription className="text-green-700">
            Congratulations! Your account has been verified. You can now bid on all available projects.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "Rejected" && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            {rejectionReason || "Your verification was rejected. Please review the feedback below and resubmit your documents."}
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
          <CardDescription>
            {verifiedCount} of {documents.length} documents verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{Math.round(progress)}% Complete</span>
            <Badge variant={verificationStatus === "Verified" ? "default" : verificationStatus === "Pending" ? "secondary" : "destructive"}>
              {verificationStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload the following documents to complete your verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className={`p-4 border rounded-lg ${
                doc.status === "verified" 
                  ? "bg-green-50 border-green-200" 
                  : doc.status === "rejected"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.status === "verified" 
                      ? "bg-green-100" 
                      : doc.status === "rejected"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}>
                    {doc.status === "verified" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : doc.status === "rejected" ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                    
                    {doc.status === "verified" && (
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">File:</span> {doc.fileName}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Size:</span> {doc.fileSize}
                          <span className="mx-1">•</span>
                          <span>Submitted: {doc.submittedAt}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.status === "verified" ? (
                    <>
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  ) : doc.status === "rejected" ? (
                    <Badge variant="destructive">Rejected</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              </div>

              {/* Upload Area - Only show if not verified */}
              {doc.status !== "verified" && (
                <div className="mt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {uploadingDoc === doc.id ? "Uploading..." : "Drop your file here or click to browse"}
                    </p>
                    <p className="text-xs text-gray-400">PDF, JPG, or PNG (max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                      disabled={uploadingDoc === doc.id}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Optional Documents</CardTitle>
          <CardDescription>Additional documents that may strengthen your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-white border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">BIR Registration</h4>
                  <p className="text-sm text-gray-500">Bureau of Internal Revenue Certificate of Registration</p>
                </div>
              </div>
              <Badge variant="outline">Optional</Badge>
            </div>
            <div className="mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Upload optional document</p>
                <p className="text-xs text-gray-400">PDF, JPG, or PNG (max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
