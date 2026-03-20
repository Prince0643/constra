"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Eye, Building2, Loader2, FileText, Plus, Edit, Trash2, Search, Shield } from "lucide-react"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [previewUser, setPreviewUser] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [previewDocuments, setPreviewDocuments] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    businessType: "",
    phoneNumber: "",
    businessAddress: "",
    role: "User",
    verificationStatus: "Pending"
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.businessType?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return
    }
    try {
      setSubmitting(true)
      setError(null)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create user")
      }
      setIsCreateDialogOpen(false)
      setFormData({
        email: "", password: "", companyName: "", businessType: "",
        phoneNumber: "", businessAddress: "", role: "User", verificationStatus: "Pending"
      })
      fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to create user")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    try {
      setSubmitting(true)
      setError(null)
      const token = localStorage.getItem("token")
      const updateData: any = {}
      if (formData.email !== selectedUser.email) updateData.email = formData.email
      if (formData.companyName !== selectedUser.companyName) updateData.companyName = formData.companyName
      if (formData.businessType !== selectedUser.businessType) updateData.businessType = formData.businessType
      if (formData.phoneNumber !== selectedUser.phoneNumber) updateData.phoneNumber = formData.phoneNumber
      if (formData.businessAddress !== selectedUser.businessAddress) updateData.businessAddress = formData.businessAddress
      if (formData.role !== selectedUser.role) updateData.role = formData.role
      if (formData.verificationStatus !== selectedUser.verificationStatus) updateData.verificationStatus = formData.verificationStatus
      if (formData.password) updateData.password = formData.password
      
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update user")
      }
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to update user")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete user")
      }
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (user: any) => {
    setSelectedUser(user)
    setFormData({
      email: user.email || "",
      password: "",
      companyName: user.companyName || "",
      businessType: user.businessType || "",
      phoneNumber: user.phoneNumber || "",
      businessAddress: user.businessAddress || "",
      role: user.role || "User",
      verificationStatus: user.verificationStatus || "Pending"
    })
    setIsEditDialogOpen(true)
    setError(null)
  }

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
    setError(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage contractor accounts and verifications</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#002D5D] hover:bg-[#001d3d]">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#002D5D]">Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}
              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="user@example.com" /></div>
              <div className="space-y-2"><Label htmlFor="password">Password *</Label><Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" /></div>
              <div className="space-y-2"><Label htmlFor="companyName">Company Name</Label><Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="Company name" /></div>
              <div className="space-y-2"><Label htmlFor="businessType">Business Type</Label><Input id="businessType" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} placeholder="Business type" /></div>
              <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone number" /></div>
              <div className="space-y-2"><Label htmlFor="businessAddress">Business Address</Label><Input id="businessAddress" value={formData.businessAddress} onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })} placeholder="Business address" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="User">User</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationStatus">Status</Label>
                  <Select value={formData.verificationStatus} onValueChange={(value) => setFormData({ ...formData, verificationStatus: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Verified">Verified</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={submitting} className="bg-[#002D5D] hover:bg-[#001d3d]">{submitting ? "Creating..." : "Create User"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search users by email, company, or type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Total: {filteredUsers.length}</span>
          <span className="text-green-600">Verified: {filteredUsers.filter(u => u.verificationStatus === "Verified").length}</span>
          <span className="text-yellow-600">Pending: {filteredUsers.filter(u => u.verificationStatus === "Pending").length}</span>
        </div>
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
              {filteredUsers.map((user) => (
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
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openEditDialog(user)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openDeleteDialog(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#002D5D]">Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
            )}
            <div className="space-y-2"><Label htmlFor="edit-email">Email</Label><Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-password">New Password (leave blank to keep current)</Label><Input id="edit-password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter new password (optional)" /></div>
            <div className="space-y-2"><Label htmlFor="edit-companyName">Company Name</Label><Input id="edit-companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-businessType">Business Type</Label><Input id="edit-businessType" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-phoneNumber">Phone Number</Label><Input id="edit-phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-businessAddress">Business Address</Label><Input id="edit-businessAddress" value={formData.businessAddress} onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="User">User</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-verificationStatus">Status</Label>
                <Select value={formData.verificationStatus} onValueChange={(value) => setFormData({ ...formData, verificationStatus: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Verified">Verified</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser} disabled={submitting} className="bg-[#002D5D] hover:bg-[#001d3d]">{submitting ? "Updating..." : "Update User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">{error}</div>
            )}
            <p className="text-gray-700">Are you sure you want to delete the user <strong>{selectedUser?.email}</strong>?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone. All associated data (bids, documents) will also be deleted.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteUser} disabled={submitting} variant="destructive">{submitting ? "Deleting..." : "Delete User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
