"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, FileText, Eye, Loader2, Check, AlertTriangle, ExternalLink } from "lucide-react"

export default function VerificationPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewUser, setPreviewUser] = useState<any>(null)
  const [previewDocuments, setPreviewDocuments] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

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
        // Filter only users (not admin)
        const regularUsers = data.filter((u: any) => u.role === "User")
        setUsers(regularUsers)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/${userId}/verify`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Verified" })
      })

      if (response.ok) {
        fetchUsers()
        setIsVerifyDialogOpen(false)
      } else {
        alert("Failed to verify user")
      }
    } catch (error) {
      console.error("Verify error:", error)
    }
  }

  const handleReject = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/${userId}/verify`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Rejected" })
      })

      if (response.ok) {
        fetchUsers()
        setIsRejectDialogOpen(false)
      } else {
        alert("Failed to reject verification")
      }
    } catch (error) {
      console.error("Reject error:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-700">Verified</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleVerifyDocument = async (docId: number, status: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/documents/${docId}/verify`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        // Refresh documents after update
        if (previewUser) {
          fetchUserDocuments(previewUser.id)
        }
      } else {
        alert("Failed to update document status")
      }
    } catch (error) {
      console.error("Document verify error:", error)
    }
  }

  const fetchUserDocuments = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/${userId}/documents`, {
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

  const handlePreview = (user: any) => {
    setPreviewUser(user)
    fetchUserDocuments(user.id)
    setIsPreviewDialogOpen(true)
  }

  const filteredUsers = filterStatus === "all" 
    ? users 
    : users.filter(u => u.verificationStatus === filterStatus)

  const pendingCount = users.filter(u => u.verificationStatus === "Pending").length

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Verification</h2>
          <p className="text-gray-600">Review and verify user submitted documents</p>
        </div>
      </div>

      {/* Alert for pending */}
      {pendingCount > 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Pending Verifications</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {pendingCount} user(s) are waiting for document verification.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.verificationStatus === "Pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.verificationStatus === "Verified").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.verificationStatus === "Rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
          <CardDescription>Filter by verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Verifications</CardTitle>
          <CardDescription>
            {filteredUsers.length} user(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.companyName || "N/A"}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user._count?.bids || 0} bids</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.verificationStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.verificationStatus === "Pending" && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsVerifyDialogOpen(true)
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsRejectDialogOpen(true)
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Viewing documents for <strong>{previewUser?.companyName}</strong>
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
                <p>{previewUser && getStatusBadge(previewUser.verificationStatus)}</p>
              </div>
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-medium">{previewUser?.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Business Type</p>
                <p className="font-medium">{previewUser?.businessType || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">DTI Registration</p>
                <p className="font-medium">{previewUser?.dtiRegistration || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">TIN Number</p>
                <p className="font-medium">{previewUser?.tinNumber || "N/A"}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Uploaded Documents</h4>
              {previewDocuments.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              ) : (
                <div className="space-y-3">
                  {previewDocuments.map((doc: any) => (
                    <div key={doc.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.fileName} • {doc.fileSize}</p>
                          <Badge 
                            className={doc.status === 'verified' ? 'bg-green-100 text-green-700 mt-2' : 'bg-yellow-100 text-yellow-700 mt-2'}
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {doc.status !== 'verified' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerifyDocument(doc.id, 'verified')}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          {doc.status === 'verified' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleVerifyDocument(doc.id, 'pending')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
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

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify <strong>{selectedUser?.companyName}</strong>?
              <br /><br />
              Email: {selectedUser?.email}
              <br /><br />
              This will allow the user to bid on projects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedUser && handleVerify(selectedUser.id)}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject <strong>{selectedUser?.companyName}</strong>?
              <br /><br />
              Email: {selectedUser?.email}
              <br /><br />
              The user will not be able to bid on projects until they resubmit valid documents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedUser && handleReject(selectedUser.id)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
