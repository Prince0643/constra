"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  ArrowUpDown,
  Briefcase,
  Tag,
  DollarSign,
  Calendar,
  ExternalLink,
  Loader2,
  MapPin
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  abc: number
  location: string
  deadline: string
  status: "Open" | "Closed" | "Draft"
  category: string
  requirements?: any[]
  _count?: { bids: number }
}

interface Category {
  id: string
  name: string
  code: string
  opportunities: number
}

const categories: Category[] = [
  { id: "1", name: "Agriculture", code: "AGR", opportunities: 23 },
  { id: "2", name: "Communication", code: "COM", opportunities: 15 },
  { id: "3", name: "Construction", code: "CON", opportunities: 156 },
  { id: "4", name: "Consulting Services", code: "CNS", opportunities: 42 },
  { id: "5", name: "Defense", code: "DEF", opportunities: 8 },
  { id: "6", name: "Education", code: "EDU", opportunities: 67 },
  { id: "7", name: "Energy", code: "ENR", opportunities: 34 },
  { id: "8", name: "Engineering", code: "ENG", opportunities: 89 },
  { id: "9", name: "Environmental", code: "ENV", opportunities: 21 },
  { id: "10", name: "Facilities", code: "FAC", opportunities: 45 },
  { id: "11", name: "Furniture", code: "FUR", opportunities: 12 },
  { id: "12", name: "Health", code: "HLT", opportunities: 78 },
  { id: "13", name: "ICT Equipment", code: "ICT", opportunities: 56 },
  { id: "14", name: "Infrastructure", code: "INF", opportunities: 112 },
  { id: "15", name: "Machinery", code: "MCH", opportunities: 33 },
  { id: "16", name: "Office Supplies", code: "OFF", opportunities: 28 },
  { id: "17", name: "Security", code: "SEC", opportunities: 19 },
  { id: "18", name: "Transportation", code: "TRN", opportunities: 41 },
  { id: "19", name: "Vehicles", code: "VEH", opportunities: 24 },
  { id: "20", name: "Water Works", code: "WTR", opportunities: 37 },
]

const opportunities: any[] = []

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function OpportunitiesPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError("Failed to load opportunities. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null
    const end = new Date(deadline)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    return days > 0 ? days : 0
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLetter = selectedLetter 
      ? project.category?.startsWith(selectedLetter) 
      : true
    
    return matchesSearch && matchesLetter && project.status === "Open"
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openProjectsCount = projects.filter(p => p.status === "Open").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002D5D]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchProjects} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Business Opportunities</h2>
          <p className="text-gray-600 mt-1">Search and explore available procurement opportunities</p>
        </div>
        <Badge className="bg-[#002D5D] text-white text-lg px-4 py-2">
          {openProjectsCount} Active
        </Badge>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search by project title, category, or location..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={fetchProjects}>
                <Filter className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Bid Notices */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Active Bid Notices ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">ITB No.</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Project Title</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">ABC</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Closing Date</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Bids</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No active bid notices found
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => {
                    const daysLeft = getDaysRemaining(project.deadline)
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            ITB-{project.id.toString().padStart(4, '0')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-[#002D5D] max-w-md truncate">{project.title}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {project.location}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            {project.category || "General"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            {formatCurrency(project.abc)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(project.deadline)}
                          </div>
                          {daysLeft !== null && (
                            <Badge className={`text-xs mt-1 ${
                              daysLeft <= 7 ? "bg-red-100 text-red-700" : 
                              daysLeft <= 14 ? "bg-orange-100 text-orange-700" : 
                              "bg-green-100 text-green-700"
                            }`}>
                              {daysLeft} days left
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <Badge className="bg-blue-100 text-blue-700">
                            {project._count?.bids || 0}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/constra/opportunities/${project.id}`}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-[#002D5D] hover:bg-blue-50 gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} notices
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
