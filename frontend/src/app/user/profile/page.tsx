"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, Download, UserCircle, Mail, Phone, MapPin, Calendar } from "lucide-react"

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
  { 
    id: 4, 
    name: "Financial Proposal Template", 
    description: "Template for project bidding financial proposals",
    status: "verified", 
    submittedAt: "2024-01-20",
    fileName: "Financial_Proposal_Template.pdf",
    fileSize: "850 KB"
  },
  { 
    id: 5, 
    name: "Technical Specs Template", 
    description: "Standard technical specifications document",
    status: "verified", 
    submittedAt: "2024-01-20",
    fileName: "Technical_Specs_Template.pdf",
    fileSize: "1.5 MB"
  },
  { 
    id: 6, 
    name: "Company Profile", 
    description: "Company background and portfolio",
    status: "verified", 
    submittedAt: "2024-01-20",
    fileName: "ABC_Company_Profile.pdf",
    fileSize: "3.2 MB"
  },
]

export default function ProfilePage() {
  let verificationStatus: "Pending" | "Verified" | "Rejected" = "Verified"
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null)

  const handleFileUpload = (docId: number, file: File | null) => {
    if (file) {
      setUploadingDoc(docId)
      setTimeout(() => setUploadingDoc(null), 2000)
    }
  }

  const verifiedCount = documents.filter(d => d.status === "verified").length
  const progress = (verifiedCount / documents.length) * 100

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
            <h3 className="text-xl font-semibold">ABC Construction Corp</h3>
            <Badge className="mt-2" variant={verificationStatus === "Verified" ? "default" : verificationStatus === "Pending" ? "secondary" : "destructive"}>
              {verificationStatus}
            </Badge>
            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>user@abc-construction.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Metro Manila, Philippines</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since Jan 2024</span>
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
                  <p className="text-gray-900">ABC Construction Corporation</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Business Type</Label>
                  <p className="text-gray-900">Construction & Engineering</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">DTI Registration</Label>
                  <p className="text-gray-900">DTI-123456-2024</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">TIN Number</Label>
                  <p className="text-gray-900">123-456-789-000</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Business Address</Label>
                <p className="text-gray-900">123 Main Street, Makati City, Metro Manila, Philippines</p>
              </div>
            </CardContent>
          </Card>

          {/* Document Verification Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
              <CardDescription>Required documents for bidding (managed here, attached automatically to bids)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Document Completion</span>
                  <span className="text-sm font-medium">{verifiedCount}/{documents.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{doc.name}</h4>
                          <p className="text-xs text-gray-500">{doc.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{doc.fileName}</span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-900 mb-1">Documents Auto-Attached to Bids</h4>
                <p className="text-sm text-blue-700">
                  These documents are pre-verified in your profile. When you place a bid, 
                  the system automatically attaches them to your submission - no need to upload again!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
