"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, FileText, Eye, Edit, Trash2 } from "lucide-react"

const projects = [
  { id: 1, title: "Highway Expansion Project", abc: "₱50,000,000", location: "Metro Manila", status: "Open", deadline: "2024-03-15", bids: 8 },
  { id: 2, title: "School Building Construction", abc: "₱25,000,000", location: "Cebu City", status: "Evaluation", deadline: "2024-03-10", bids: 12 },
  { id: 3, title: "Bridge Rehabilitation", abc: "₱35,000,000", location: "Davao City", status: "Closed", deadline: "2024-02-28", bids: 5 },
  { id: 4, title: "Road Paving - District 5", abc: "₱15,000,000", location: "Quezon City", status: "Open", deadline: "2024-03-20", bids: 15 },
  { id: 5, title: "Government Office Renovation", abc: "₱8,000,000", location: "Makati City", status: "Open", deadline: "2024-03-25", bids: 6 },
]

const requirementTemplates = [
  { name: "Financial Proposal", description: "Must include cost breakdown", required: true },
  { name: "Technical Specifications", description: "Detailed project specs", required: true },
  { name: "Company Profile", description: "Company background and experience", required: false },
  { name: "Certificate of PhilGEPS Registration", description: "Valid PhilGEPS registration", required: true },
]

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    abc: "",
    location: "",
    deadline: "",
    description: "",
    requirements: [] as string[],
  })

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock project creation
    setIsCreateDialogOpen(false)
    setFormData({ title: "", abc: "", location: "", deadline: "", description: "", requirements: [] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage construction projects and bidding opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the project details and specify required documents for bidding.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abc">Approved Budget (ABC)</Label>
                  <Input
                    id="abc"
                    placeholder="₱0.00"
                    value={formData.abc}
                    onChange={(e) => setFormData({ ...formData, abc: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Project location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Bid Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project scope, requirements, and other relevant details..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Required Documents Checklist</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  {requirementTemplates.map((req, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`req-${index}`}
                        className="mt-1"
                        checked={formData.requirements.includes(req.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, requirements: [...formData.requirements, req.name] })
                          } else {
                            setFormData({ ...formData, requirements: formData.requirements.filter(r => r !== req.name) })
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`req-${index}`} className="font-medium cursor-pointer">
                          {req.name}
                          {req.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <p className="text-sm text-gray-500">{req.description}</p>
                      </div>
                      <Badge variant={req.required ? "default" : "outline"}>
                        {req.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage all construction projects</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input placeholder="Search projects..." className="w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Budget (ABC)</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                  </TableCell>
                  <TableCell>{project.abc}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {project.bids}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={project.status === "Open" ? "default" : project.status === "Evaluation" ? "secondary" : "outline"}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
