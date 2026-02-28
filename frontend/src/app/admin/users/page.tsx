"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Eye, Building2, Loader2, FileText } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewUser, setPreviewUser] = useState<any>(null)
  const [previewDocuments, setPreviewDocuments] = useState<any[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (userId: number, status: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/${userId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        fetchUsers()
      } else {
        alert("Failed to update verification status")
      }
    } catch (error) {
      console.error("Verify error:", error)
    }
  }

  const handlePreview = async (user: any) => {
    setPreviewUser(user)
    setIsPreviewDialogOpen(true)
    
    // Fetch user documents
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/${user.id}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPreviewDocuments(data.documents || [])
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage contractor accounts and verifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage contractor accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{user.companyName || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.verificationStatus === "Verified" ? "default" : user.verificationStatus === "Pending" ? "secondary" : "destructive"}
                    >
                      {user.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt?.split('T')[0]}</TableCell>
                  <TableCell>{user._count?.bids || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.verificationStatus === "Pending" && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleVerify(user.id, "Verified")}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleVerify(user.id, "Rejected")}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handlePreview(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Viewing details for <strong>{previewUser?.companyName}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{previewUser?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge className={previewUser?.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' : previewUser?.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                  {previewUser?.verificationStatus}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-medium">{previewUser?.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-medium">{previewUser?.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Joined</p>
                <p className="font-medium">{previewUser?.createdAt?.split('T')[0]}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Bids</p>
                <p className="font-medium">{previewUser?._count?.bids || 0}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Uploaded Documents</h4>
              {previewDocuments.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {previewDocuments.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.fileName} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <Badge className={doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
