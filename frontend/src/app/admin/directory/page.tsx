"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Filter,
  Building2,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  FileText,
  Award,
  Calendar,
  Briefcase,
  ExternalLink,
  Shield
} from "lucide-react"

interface Sector {
  id: string
  name: string
  organizations: number
  active: number
  blacklisted: number
  pending: number
}

interface Organization {
  id: string
  name: string
  sector: string
  tin: string
  location: string
  status: "Active" | "Blacklisted" | "Pending"
  registrationDate: string
  projectsWon: number
}

const sectors: Sector[] = [
  { id: "1", name: "Construction", organizations: 567, active: 523, blacklisted: 12, pending: 32 },
  { id: "2", name: "Infrastructure", organizations: 234, active: 218, blacklisted: 5, pending: 11 },
  { id: "3", name: "Consulting Services", organizations: 189, active: 176, blacklisted: 3, pending: 10 },
  { id: "4", name: "IT & Technology", organizations: 156, active: 145, blacklisted: 2, pending: 9 },
  { id: "5", name: "Health & Medical", organizations: 134, active: 128, blacklisted: 1, pending: 5 },
  { id: "6", name: "Education", organizations: 123, active: 115, blacklisted: 3, pending: 5 },
  { id: "7", name: "Agriculture", organizations: 89, active: 82, blacklisted: 4, pending: 3 },
  { id: "8", name: "Transportation", organizations: 78, active: 73, blacklisted: 2, pending: 3 },
]

const organizations: Organization[] = [
  { id: "1", name: "JAJR CONSTRUCTION", sector: "Construction", tin: "123-456-789-000", location: "Quezon City", status: "Pending", registrationDate: "2026-03-01", projectsWon: 0 },
  { id: "2", name: "ABC Builders Corp", sector: "Construction", tin: "987-654-321-000", location: "Makati City", status: "Active", registrationDate: "2025-01-15", projectsWon: 12 },
  { id: "3", name: "Mega Construction Inc", sector: "Infrastructure", tin: "456-789-123-000", location: "Taguig City", status: "Active", registrationDate: "2024-06-20", projectsWon: 28 },
  { id: "4", name: "BuildRight Co.", sector: "Construction", tin: "789-123-456-000", location: "Pasig City", status: "Blacklisted", registrationDate: "2023-09-10", projectsWon: 3 },
  { id: "5", name: "Highway Builders Inc", sector: "Infrastructure", tin: "321-654-987-000", location: "Mandaluyong", status: "Active", registrationDate: "2025-03-15", projectsWon: 15 },
]

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const itemsPerPage = 10

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.tin.includes(searchQuery)
    const matchesSector = sectorFilter === "all" || org.sector === sectorFilter
    const matchesStatus = statusFilter === "all" || org.status.toLowerCase() === statusFilter
    return matchesSearch && matchesSector && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage)
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalOrgs = sectors.reduce((sum, s) => sum + s.organizations, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Global Directory</h2>
          <p className="text-gray-600 mt-1">Overview of all registered sectors and organizations</p>
        </div>
        <Badge className="bg-[#002D5D] text-white text-lg px-4 py-2">
          {totalOrgs.toLocaleString()} Total Organizations
        </Badge>
      </div>

      {/* Sector Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Active Organizations</p>
                <p className="text-2xl font-bold text-green-800">
                  {sectors.reduce((sum, s) => sum + s.active, 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Blacklisted</p>
                <p className="text-2xl font-bold text-red-800">
                  {sectors.reduce((sum, s) => sum + s.blacklisted, 0).toLocaleString()}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-800">
                  {sectors.reduce((sum, s) => sum + s.pending, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Sectors</p>
                <p className="text-2xl font-bold text-blue-800">{sectors.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectors Table */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Sector Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Sector Name</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Active</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Blacklisted</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sectors.map((sector) => (
                  <tr key={sector.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-[#002D5D]">{sector.name}</td>
                    <td className="p-4 text-center">
                      <Badge className="bg-[#002D5D] text-white">
                        {sector.organizations}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className="bg-green-100 text-green-700">
                        {sector.active}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className="bg-red-100 text-red-700">
                        {sector.blacklisted}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className="bg-orange-100 text-orange-700">
                        {sector.pending}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registered Organizations
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or TIN..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blacklisted">Blacklisted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Organization</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Sector</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">TIN</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Projects Won</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-[#002D5D]">{org.name}</div>
                      <div className="text-sm text-gray-500">Since {org.registrationDate}</div>
                    </td>
                    <td className="p-4">{org.sector}</td>
                    <td className="p-4 font-mono text-sm">{org.tin}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {org.location}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={
                        org.status === "Active" ? "bg-green-100 text-green-700" :
                        org.status === "Blacklisted" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }>
                        {org.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className="bg-blue-100 text-blue-700">
                        {org.projectsWon}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrg(org)
                            setIsProfileOpen(true)
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrgs.length)} of {filteredOrgs.length} organizations
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={currentPage === page ? "bg-[#002D5D]" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrg && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl text-[#002D5D] flex items-center gap-2">
                      <Building2 className="w-6 h-6" />
                      {selectedOrg.name}
                    </DialogTitle>
                    <p className="text-gray-500 mt-1">Organization Profile</p>
                  </div>
                  <Badge className={
                    selectedOrg.status === "Active" ? "bg-green-100 text-green-700" :
                    selectedOrg.status === "Blacklisted" ? "bg-red-100 text-red-700" :
                    "bg-orange-100 text-orange-700"
                  }>
                    {selectedOrg.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-800">{selectedOrg.projectsWon}</p>
                      <p className="text-sm text-blue-600">Projects Won</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <Briefcase className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-800">{selectedOrg.sector}</p>
                      <p className="text-sm text-purple-600">Sector</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-800">
                        {new Date(selectedOrg.registrationDate).getFullYear()}
                      </p>
                      <p className="text-sm text-green-600">Member Since</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Organization Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#002D5D] flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{selectedOrg.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tax Identification Number (TIN)</p>
                      <p className="font-mono font-medium">{selectedOrg.tin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Sector</p>
                      <p className="font-medium">{selectedOrg.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{selectedOrg.registrationDate}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#002D5D] flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedOrg.location}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information (Mock) */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#002D5D] flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>+63 (2) 8123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>contact@{selectedOrg.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Documents & Certifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#002D5D] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents & Certifications
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "DTI Business Registration", status: "Verified" },
                      { name: "BIR Certificate of Registration", status: "Verified" },
                      { name: "Mayor's Business Permit", status: "Verified" },
                      { name: "PCAB License", status: selectedOrg.status === "Active" ? "Verified" : "Pending" },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Badge className={doc.status === "Verified" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 gap-2 bg-[#002D5D] hover:bg-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Full Details
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
