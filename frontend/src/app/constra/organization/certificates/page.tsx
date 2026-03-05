"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Award, CheckCircle } from "lucide-react"

interface Certificate {
  id: number
  name: string
  type: string
  issuedBy: string
  issuedDate: string
  expiryDate: string
  status: "Valid" | "Expired" | "Pending Renewal"
  fileUrl: string
}

const certificates: Certificate[] = [
  {
    id: 1,
    name: "DTI Business Registration",
    type: "Business Registration",
    issuedBy: "Department of Trade and Industry",
    issuedDate: "2024-01-15",
    expiryDate: "2029-01-15",
    status: "Valid",
    fileUrl: "#",
  },
  {
    id: 2,
    name: "PCAB License AAA",
    type: "Contractor's License",
    issuedBy: "Philippine Contractors Accreditation Board",
    issuedDate: "2024-06-01",
    expiryDate: "2026-12-31",
    status: "Valid",
    fileUrl: "#",
  },
  {
    id: 3,
    name: "Mayor's Business Permit",
    type: "Business Permit",
    issuedBy: "Quezon City Government",
    issuedDate: "2026-01-01",
    expiryDate: "2026-12-31",
    status: "Valid",
    fileUrl: "#",
  },
  {
    id: 4,
    name: "BIR Certificate of Registration",
    type: "Tax Registration",
    issuedBy: "Bureau of Internal Revenue",
    issuedDate: "2024-01-15",
    expiryDate: "N/A",
    status: "Valid",
    fileUrl: "#",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Valid":
      return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Valid</Badge>
    case "Expired":
      return <Badge variant="destructive">Expired</Badge>
    case "Pending Renewal":
      return <Badge className="bg-yellow-100 text-yellow-700">Pending Renewal</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">View Certificate</h2>
        <Button className="bg-[#002D5D]">
          <FileText className="w-4 h-4 mr-2" />
          Upload Certificate
        </Button>
      </div>

      <div className="grid gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <CardTitle className="text-base">{cert.name}</CardTitle>
                  <p className="text-sm text-gray-500">{cert.type}</p>
                </div>
              </div>
              {getStatusBadge(cert.status)}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Issued By:</span>
                  <p className="font-medium">{cert.issuedBy}</p>
                </div>
                <div>
                  <span className="text-gray-500">Issued Date:</span>
                  <p className="font-medium">{cert.issuedDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Expiry Date:</span>
                  <p className={`font-medium ${cert.expiryDate !== 'N/A' && new Date(cert.expiryDate) < new Date('2026-12-31') ? 'text-orange-600' : ''}`}>
                    {cert.expiryDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Certificates</h3>
            <p className="text-gray-500">Upload organization certificates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
