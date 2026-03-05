"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Trash2 } from "lucide-react"

interface Document {
  id: number
  name: string
  type: string
  size: string
  uploadedAt: string
  uploadedBy: string
}

const documentsData: Document[] = [
  {
    id: 1,
    name: "DTI Registration Certificate.pdf",
    type: "PDF",
    size: "2.5 MB",
    uploadedAt: "2026-02-15",
    uploadedBy: "Admin",
  },
  {
    id: 2,
    name: "Business Permit 2026.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "2026-02-20",
    uploadedBy: "Admin",
  },
  {
    id: 3,
    name: "Mayor's Permit.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedAt: "2026-02-25",
    uploadedBy: "Admin",
  },
]

export default function DocumentLibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Document Library</h2>
        <Button className="bg-[#002D5D]">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organization Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left font-medium">Document Name</th>
                <th className="p-3 text-center font-medium">Type</th>
                <th className="p-3 text-center font-medium">Size</th>
                <th className="p-3 text-center font-medium">Uploaded Date</th>
                <th className="p-3 text-center font-medium">Uploaded By</th>
                <th className="p-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentsData.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      {doc.name}
                    </div>
                  </td>
                  <td className="p-3 text-center">{doc.type}</td>
                  <td className="p-3 text-center">{doc.size}</td>
                  <td className="p-3 text-center">{doc.uploadedAt}</td>
                  <td className="p-3 text-center">{doc.uploadedBy}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {documentsData.length === 0 && (
            <p className="text-center text-gray-500 py-8">No documents found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
