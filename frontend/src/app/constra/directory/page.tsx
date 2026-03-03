"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Building2,
  Users,
  Scale,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin,
  Phone,
  ExternalLink,
  Mail
} from "lucide-react"

interface Sector {
  id: string
  name: string
  organizations: number
  description: string
}

interface Organization {
  id: string
  name: string
  location: string
  status: "Active" | "Pending" | "Blacklisted"
  contact: string
  email: string
  phone: string
  tin: string
  sector: string
}

const sectors: Sector[] = [
  { id: "1", name: "Agriculture", organizations: 234, description: "Farming, livestock, fisheries" },
  { id: "2", name: "Communications", organizations: 89, description: "Telecom, media, broadcasting" },
  { id: "3", name: "Construction", organizations: 567, description: "Building, infrastructure, engineering" },
  { id: "4", name: "Domestic Security", organizations: 45, description: "Defense, police, emergency" },
  { id: "5", name: "Education", organizations: 445, description: "Schools, universities, training" },
  { id: "6", name: "Energy", organizations: 123, description: "Power, utilities, renewables" },
  { id: "7", name: "Environment", organizations: 167, description: "Conservation, protection, waste" },
  { id: "8", name: "Finance", organizations: 234, description: "Banking, insurance, investments" },
  { id: "9", name: "Health", organizations: 678, description: "Hospitals, clinics, pharma" },
  { id: "10", name: "ICT", organizations: 345, description: "Software, hardware, services" },
  { id: "11", name: "Infrastructure", organizations: 234, description: "Roads, bridges, transport" },
  { id: "12", name: "Justice", organizations: 78, description: "Courts, legal, corrections" },
  { id: "13", name: "Labor", organizations: 89, description: "Employment, welfare, skills" },
  { id: "14", name: "Local Government", organizations: 1890, description: "Provincial, city, municipal" },
  { id: "15", name: "Science & Tech", organizations: 123, description: "Research, innovation, labs" },
  { id: "16", name: "Social Services", organizations: 234, description: "Welfare, community, housing" },
  { id: "17", name: "Tourism", organizations: 156, description: "Travel, culture, heritage" },
  { id: "18", name: "Trade", organizations: 178, description: "Commerce, industry, SMEs" },
  { id: "19", name: "Transportation", organizations: 289, description: "Aviation, maritime, land" },
  { id: "20", name: "Water Resources", organizations: 134, description: "Supply, sanitation, flood" },
]

const organizations: Organization[] = [
  { id: "1", name: "Department of Public Works", location: "Quezon City", status: "Active", contact: "Engr. Maria Santos", email: "dpwh@example.com", phone: "+63 (2) 8924-0000", tin: "000-123-456-000", sector: "Construction" },
  { id: "2", name: "Department of Agriculture", location: "Quezon City", status: "Active", contact: "Dr. Juan Cruz", email: "da@example.com", phone: "+63 (2) 8927-0000", tin: "000-456-789-000", sector: "Agriculture" },
  { id: "3", name: "Department of Education", location: "Pasig City", status: "Active", contact: "Dr. Ana Reyes", email: "deped@example.com", phone: "+63 (2) 8633-0000", tin: "000-789-123-000", sector: "Education" },
  { id: "4", name: "Department of Health", location: "Manila", status: "Active", contact: "Dr. Pedro Lim", email: "doh@example.com", phone: "+63 (2) 8651-0000", tin: "000-321-654-000", sector: "Health" },
  { id: "5", name: "Department of ICT", location: "Makati City", status: "Active", contact: "Mr. Jose Garcia", email: "dict@example.com", phone: "+63 (2) 8844-0000", tin: "000-654-987-000", sector: "ICT" },
]

type FilterTab = "buyers" | "cso" | "auditor"

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("buyers")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const itemsPerPage = 10

  const handleViewList = (sector: Sector) => {
    setSelectedSector(sector)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
      case "Blacklisted":
        return <Badge className="bg-red-100 text-red-700">Blacklisted</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>
    }
  }

  const filteredOrganizations = selectedSector
    ? organizations.filter(org => org.sector.toLowerCase() === selectedSector.name.toLowerCase())
    : []

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredSectors.length / itemsPerPage)
  const paginatedSectors = filteredSectors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalOrganizations = sectors.reduce((sum, s) => sum + s.organizations, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Buyer Directory</h2>
          <p className="text-gray-600 mt-1">Browse registered government and private sector buyers</p>
        </div>
        <Badge className="bg-[#002D5D] text-white text-lg px-4 py-2">
          {totalOrganizations.toLocaleString()} Organizations
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "buyers" ? "default" : "outline"}
              className={activeTab === "buyers" ? "bg-[#002D5D]" : ""}
              onClick={() => setActiveTab("buyers")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Buyers
            </Button>
            <Button
              variant={activeTab === "cso" ? "default" : "outline"}
              className={activeTab === "cso" ? "bg-[#002D5D]" : ""}
              onClick={() => setActiveTab("cso")}
            >
              <Users className="w-4 h-4 mr-2" />
              CSO
            </Button>
            <Button
              variant={activeTab === "auditor" ? "default" : "outline"}
              className={activeTab === "auditor" ? "bg-[#002D5D]" : ""}
              onClick={() => setActiveTab("auditor")}
            >
              <Scale className="w-4 h-4 mr-2" />
              Auditor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input 
          placeholder={`Search ${activeTab} by name...`} 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
        />
      </div>

      {/* Sector Table */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Industry Sectors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Sector Name
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">
                    Registered Organizations
                  </th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedSectors.map((sector) => (
                  <tr key={sector.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-[#002D5D]">{sector.name}</div>
                    </td>
                    <td className="p-4 text-gray-600">{sector.description}</td>
                    <td className="p-4 text-center">
                      <Badge className="bg-[#002D5D] text-white hover:bg-blue-800">
                        {sector.organizations.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-[#002D5D] hover:bg-blue-50"
                        onClick={() => handleViewList(sector)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View List
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSectors.length)} of {filteredSectors.length} sectors
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">4,567</p>
            <p className="text-sm text-gray-600">Government Agencies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">12,345</p>
            <p className="text-sm text-gray-600">Private Sector</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">189</p>
            <p className="text-sm text-gray-600">Local Government Units</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">24/7</p>
            <p className="text-sm text-gray-600">Support Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization List Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D] flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              {selectedSector?.name} - Registered Organizations
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sector Description</p>
              <p className="font-medium">{selectedSector?.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredOrganizations.length} of {selectedSector?.organizations.toLocaleString()} registered organizations
              </p>
            </div>

            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No sample organizations available for this sector</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrganizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#002D5D]">{org.name}</h3>
                            {getStatusBadge(org.status)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{org.tin}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {org.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {org.contact}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {org.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {org.phone}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Separator />

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
