"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Search,
  Calendar,
  DollarSign,
  FolderPlus,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Edit,
  Eye,
  ExternalLink
} from "lucide-react"

interface Opportunity {
  id: string
  title: string
  abc: number
  category: string
  deadline: string
  status: "Draft" | "Published" | "Closed" | "Awarded"
  bids: number
  agency: string
}

const categories = [
  "Civil Works",
  "Infrastructure",
  "Construction Materials",
  "Electrical Works",
  "Mechanical Works",
  "IT Equipment",
  "Consulting Services",
  "Office Supplies",
]

const agencies = [
  "DPWH - Department of Public Works",
  "DOH - Department of Health",
  "DepEd - Department of Education",
  "DPWH Region IV",
  "City of Quezon",
  "City of Manila",
]

const opportunities: Opportunity[] = [
  {
    id: "ITB-2026-001",
    title: "Construction of 2-Storey School Building",
    abc: 12500000,
    category: "Civil Works",
    deadline: "2026-03-30",
    status: "Published",
    bids: 8,
    agency: "DepEd - Department of Education"
  },
  {
    id: "ITB-2026-002",
    title: "Road Improvement and Asphalting Project",
    abc: 45600000,
    category: "Infrastructure",
    deadline: "2026-04-15",
    status: "Published",
    bids: 12,
    agency: "DPWH - Department of Public Works"
  },
  {
    id: "ITB-2026-003",
    title: "Supply of Medical Equipment",
    abc: 8500000,
    category: "IT Equipment",
    deadline: "2026-03-20",
    status: "Draft",
    bids: 0,
    agency: "DOH - Department of Health"
  },
]

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    abc: "",
    category: "",
    deadline: "",
    agency: "",
    location: "",
    eligibility: ""
  })

  const filteredOpportunities = opportunities.filter((o) =>
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return "₱" + amount.toLocaleString()
  }

  const handleNext = () => setStep((s) => Math.min(3, s + 1))
  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">Manage Opportunities</h2>
          <p className="text-gray-600 mt-1">Create and manage Invitation to Bid postings</p>
        </div>
        <Link href="/admin/opportunities/new">
          <Button 
            className="gap-2 bg-[#002D5D] hover:bg-blue-800"
          >
            <Plus className="w-4 h-4" />
            Post New ITB
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active ITBs</p>
            <p className="text-2xl font-bold text-[#002D5D]">
              {opportunities.filter((o) => o.status === "Published").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-orange-600">
              {opportunities.filter((o) => o.status === "Draft").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Bids Received</p>
            <p className="text-2xl font-bold text-blue-600">
              {opportunities.reduce((sum, o) => sum + o.bids, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(opportunities.reduce((sum, o) => sum + o.abc, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by ITB number or project title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities Table */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D]">Posted Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">ITB Number</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Project Title</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">ABC</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Deadline</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Bids</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-mono text-sm font-medium text-[#002D5D]">{opp.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{opp.title}</div>
                      <div className="text-sm text-gray-500">{opp.agency}</div>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(opp.abc)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {opp.deadline}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={opp.bids > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}>
                        {opp.bids}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={
                        opp.status === "Published" ? "bg-green-100 text-green-700" :
                        opp.status === "Draft" ? "bg-orange-100 text-orange-700" :
                        opp.status === "Awarded" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }>
                        {opp.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/constra/opportunities/${opp.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/opportunities/new?edit=${opp.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        {opp.status === "Draft" && (
                          <Button size="sm" className="bg-[#002D5D]">
                            Publish
                          </Button>
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

      {/* Create ITB Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002D5D] flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              Create New ITB Posting
            </DialogTitle>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? "bg-[#002D5D] text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? "text-[#002D5D]" : "text-gray-500"}`}>
                  {s === 1 ? "Project Info" : s === 2 ? "Budget & Category" : "Eligibility"}
                </span>
                {s < 3 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </div>

          <Separator />

          {/* Step 1: Project Info */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title"
                  placeholder="Enter project title..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe the project scope and requirements..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agency">Procuring Agency</Label>
                  <Select 
                    value={formData.agency}
                    onValueChange={(v) => setFormData({...formData, agency: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Project Location</Label>
                  <Input 
                    id="location"
                    placeholder="City, Province"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Category */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="abc" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Approved Budget (ABC)
                  </Label>
                  <Input 
                    id="abc"
                    type="number"
                    placeholder="Enter amount..."
                    value={formData.abc}
                    onChange={(e) => setFormData({...formData, abc: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Bid Deadline
                  </Label>
                  <Input 
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Sector/Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(v) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#002D5D] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  ABC Guidelines
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• ABC should be based on detailed cost estimates</li>
                  <li>• Include all applicable taxes and fees</li>
                  <li>• Must not exceed available appropriations</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Eligibility */}
          {step === 3 && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="eligibility">Eligibility Requirements</Label>
                <Textarea 
                  id="eligibility"
                  placeholder="List contractor eligibility requirements..."
                  rows={4}
                  value={formData.eligibility}
                  onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-[#002D5D]">Required Documents Checklist</h4>
                <div className="space-y-2">
                  {[
                    "Valid PCAB License",
                    "DTI/SEC Registration",
                    "Mayor's Permit",
                    "BIR Registration",
                    "Latest Income Tax Return",
                    "Audited Financial Statements"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Review Before Publishing</h4>
                  <p className="text-sm text-yellow-700">
                    Once published, this ITB will be visible to all registered contractors. 
                    Ensure all details are accurate before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext} className="gap-2 bg-[#002D5D]">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4" />
                  Publish ITB
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
