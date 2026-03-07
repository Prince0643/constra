"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  FileText,
  Building2,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Calendar,
  Hash,
  CreditCard,
  MapPin,
  User,
  FileCheck
} from "lucide-react"

interface Merchant {
  id: string
  companyName: string
  tin: string
  tinNumber: string
  registrationDate: string
  createdAt: string
  status: "Pending" | "Approved" | "Rejected"
  businessType: string
  dtiRegistration: string
  address: string
  businessAddress: string
  contactPerson: string
  email: string
  phone: string
  phoneNumber: string
  documents: {
    dti: string
    mayorsPermit: string
    bir: string
  }
}

const API_URL = '/api'

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [merchantList, setMerchantList] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch merchants on mount
  useEffect(() => {
    fetchMerchants()
  }, [])

  const fetchMerchants = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in')
        setLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/merchants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch merchants')

      const data = await res.json()
      // Transform API data to match our interface
      const transformed: Merchant[] = data.map((m: any) => ({
        ...m,
        tin: m.tinNumber,
        registrationDate: m.createdAt?.split('T')[0],
        address: m.businessAddress,
        contactPerson: m.companyName,
        phone: m.phoneNumber,
        documents: {
          dti: 'dti_certificate.pdf',
          mayorsPermit: 'mayors_permit.pdf',
          bir: 'bir_registration.pdf'
        }
      }))
      setMerchantList(transformed)
    } catch (err: any) {
      setError(err.message || 'Failed to load merchants')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (merchantId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch(`${API_URL}/merchants/${merchantId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Approved' })
      })

      if (!res.ok) throw new Error('Failed to approve merchant')

      // Update local state
      setMerchantList(prev => prev.map(m => 
        m.id === merchantId ? { ...m, status: "Approved" as const } : m
      ))
      if (selectedMerchant?.id === merchantId) {
        setSelectedMerchant({ ...selectedMerchant, status: "Approved" })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to approve merchant')
    }
  }

  const handleReject = async (merchantId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch(`${API_URL}/merchants/${merchantId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Rejected' })
      })

      if (!res.ok) throw new Error('Failed to reject merchant')

      // Update local state
      setMerchantList(prev => prev.map(m => 
        m.id === merchantId ? { ...m, status: "Rejected" as const } : m
      ))
      if (selectedMerchant?.id === merchantId) {
        setSelectedMerchant({ ...selectedMerchant, status: "Rejected" })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject merchant')
    }
  }

  const filteredMerchants = merchantList.filter((m) =>
    m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tin.includes(searchQuery)
  )

  const pendingCount = merchantList.filter((m) => m.status === "Pending").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Merchant Approvals</h2>
          <p className="text-gray-600 mt-1">Review and approve contractor registrations</p>
        </div>
        <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
          {pendingCount} Pending
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-[#002D5D]">{merchantList.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {merchantList.filter((m: Merchant) => m.status === "Approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {merchantList.filter((m: Merchant) => m.status === "Rejected").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by company name or TIN..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Merchants Table */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D]">Organization Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Company Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">TIN</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Registration Date</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-[#002D5D]">{merchant.companyName}</div>
                      <div className="text-sm text-gray-500">{merchant.businessType}</div>
                    </td>
                    <td className="p-4 font-mono text-sm">{merchant.tin}</td>
                    <td className="p-4 text-sm">{merchant.registrationDate}</td>
                    <td className="p-4 text-center">
                      <Badge className={
                        merchant.status === "Approved" ? "bg-green-100 text-green-700" :
                        merchant.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }>
                        {merchant.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            setSelectedMerchant(merchant)
                            setIsAuditOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Audit
                        </Button>
                        {merchant.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(merchant.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(merchant.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Documents Modal */}
      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D] flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Audit Documents - {selectedMerchant?.companyName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMerchant && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">DTI Reg:</span>
                  <span className="text-sm font-medium">{selectedMerchant.dtiRegistration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">TIN:</span>
                  <span className="text-sm font-medium">{selectedMerchant.tin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Address:</span>
                  <span className="text-sm font-medium">{selectedMerchant.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Registered:</span>
                  <span className="text-sm font-medium">{selectedMerchant.registrationDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Contact:</span>
                  <span className="text-sm font-medium">{selectedMerchant.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium">{selectedMerchant.phone}</span>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Submitted Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">DTI Certificate</p>
                        <p className="text-xs text-gray-500">{selectedMerchant.documents.dti}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">Mayor&apos;s Permit</p>
                        <p className="text-xs text-gray-500">{selectedMerchant.documents.mayorsPermit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">BIR Registration</p>
                        <p className="text-xs text-gray-500">{selectedMerchant.documents.bir}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedMerchant.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedMerchant.id)
                      setIsAuditOpen(false)
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Registration
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleReject(selectedMerchant.id)
                      setIsAuditOpen(false)
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
