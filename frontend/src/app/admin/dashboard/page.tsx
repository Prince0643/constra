"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, Users, Gavel, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

const stats = [
  { title: "Total Projects", value: "24", change: "+3 this month", icon: FolderOpen },
  { title: "Active Bidders", value: "156", change: "+12 this week", icon: Users },
  { title: "Pending Bids", value: "48", change: "8 require review", icon: Gavel },
  { title: "Projects Awarded", value: "18", change: "75% success rate", icon: TrendingUp },
]

const recentProjects = [
  { id: 1, title: "Highway Expansion Project", budget: "₱50,000,000", bids: 8, status: "Open", deadline: "2024-03-15" },
  { id: 2, title: "School Building Construction", budget: "₱25,000,000", bids: 12, status: "Evaluation", deadline: "2024-03-10" },
  { id: 3, title: "Bridge Rehabilitation", budget: "₱35,000,000", bids: 5, status: "Closed", deadline: "2024-02-28" },
  { id: 4, title: "Road Paving - District 5", budget: "₱15,000,000", bids: 15, status: "Open", deadline: "2024-03-20" },
]

const pendingVerifications = [
  { id: 1, company: "ABC Construction Corp", submitted: "2 days ago", documents: 3 },
  { id: 2, company: "XYZ Builders Inc", submitted: "1 day ago", documents: 3 },
  { id: 3, company: "Metro Engineering Ltd", submitted: "5 hours ago", documents: 2 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest project postings and their status</CardDescription>
            </div>
            <Link href="/admin/projects/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-500">Budget: {project.budget}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Deadline: {project.deadline}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{project.bids} bids</span>
                    </div>
                  </div>
                  <Badge 
                    variant={project.status === "Open" ? "default" : project.status === "Evaluation" ? "secondary" : "outline"}
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>Contractors awaiting document approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.company}</h4>
                      <p className="text-sm text-gray-500">Submitted {item.submitted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.documents} docs</Badge>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">
                View all pending verifications →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
