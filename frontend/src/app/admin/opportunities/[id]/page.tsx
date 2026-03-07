"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Users,
  Edit,
  Download,
  Printer
} from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Project {
  id: string
  title: string
  description: string
  abc: number
  location: string
  deadline: string
  status: string
  category: string
  procuringEntity: string
  clientAgency: string
  referenceNumber: string
  solicitationNumber: string
  procurementMode: string
  classification: string
  deliveryPeriod: string
  createdBy: string
  createdAt: string
  requirements: { name: string; description: string; required: boolean }[]
  bids: { id: string; bidAmount: number; companyName: string; bidStatus: string }[]
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectId = params?.id as string

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in')
        setLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch project')

      const data = await res.json()
      setProject(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + (amount || 0).toLocaleString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="p-6">Loading opportunity details...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  if (!project) {
    return <div className="p-6">Opportunity not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/opportunities')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Opportunities
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[#002D5D]">{project.title}</h2>
            <p className="text-gray-600 mt-1">
              ITB #{project.id} • {project.procuringEntity || 'Unknown Agency'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Link href={`/admin/opportunities/new?edit=${project.id}`}>
            <Button className="gap-2 bg-[#002D5D]">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg ${
        project.status === 'Open' ? 'bg-green-50 border border-green-200' :
        project.status === 'Draft' ? 'bg-orange-50 border border-orange-200' :
        'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={
              project.status === 'Open' ? 'bg-green-600' :
              project.status === 'Draft' ? 'bg-orange-500' :
              project.status === 'Closed' ? 'bg-gray-600' :
              'bg-blue-600'
            }>
              {project.status}
            </Badge>
            <span className="text-sm text-gray-600">
              Created {formatDate(project.createdAt)} by {project.createdBy}
            </span>
          </div>
          {project.status === 'Draft' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Publish Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D]">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Approved Budget (ABC)</p>
                  <p className="text-xl font-bold text-[#002D5D]">{formatCurrency(project.abc)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bid Deadline</p>
                  <p className="text-lg font-medium">{formatDate(project.deadline)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-medium">{project.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-lg font-medium">{project.category || 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{project.description || 'No description provided.'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D]">Bid Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {project.requirements && project.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {project.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{req.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No requirements specified.</p>
              )}
            </CardContent>
          </Card>

          {/* Bids Received */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Bids Received ({project.bids?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.bids && project.bids.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Bidder</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Amount</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.bids.map((bid) => (
                      <tr key={bid.id} className="border-b">
                        <td className="py-3">{bid.companyName}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(bid.bidAmount)}</td>
                        <td className="py-3 text-center">
                          <Badge className={
                            bid.bidStatus === 'Won' ? 'bg-green-100 text-green-700' :
                            bid.bidStatus === 'Lost' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {bid.bidStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No bids received yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agency Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D]">Agency Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Procuring Entity</p>
                <p className="font-medium">{project.procuringEntity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client Agency</p>
                <p className="font-medium">{project.clientAgency || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-medium">{project.referenceNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Procurement Mode</p>
                <p className="font-medium">{project.procurementMode || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="w-4 h-4" />
                  Download ITB Documents
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  View Terms of Reference
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
