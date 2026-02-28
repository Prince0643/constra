"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, Users, Gavel, TrendingUp, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeBidders: 0,
    pendingBids: 0,
    projectsAwarded: 0
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Fetch projects
      const projectsRes = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const projects = projectsRes.ok ? await projectsRes.json() : []
      
      // Fetch users
      const usersRes = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const users = usersRes.ok ? await usersRes.json() : []
      
      // Calculate stats
      const totalProjects = projects.length
      const projectsAwarded = projects.filter((p: any) => p.status === "Closed").length
      const activeBidders = users.filter((u: any) => u.role === "User").length
      const pendingVerifications = users.filter((u: any) => u.verificationStatus === "Pending")
      
      // Get recent projects (last 4)
      const recent = [...projects].reverse().slice(0, 4)
      
      setStats({
        totalProjects,
        activeBidders,
        pendingBids: pendingVerifications.length,
        projectsAwarded
      })
      setRecentProjects(recent)
      setPendingVerifications(pendingVerifications.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return "₱" + amount?.toLocaleString()
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-gray-500">Active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Bidders</CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBidders}</div>
            <p className="text-xs text-gray-500">Registered contractors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
            <Gavel className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBids}</div>
            <p className="text-xs text-gray-500">Require review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Projects Awarded</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsAwarded}</div>
            <p className="text-xs text-gray-500">Completed projects</p>
          </CardContent>
        </Card>
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
            <Link href="/admin/projects">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No projects yet</p>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-500">Budget: {formatCurrency(project.abc)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">Deadline: {project.deadline?.split('T')[0]}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{project._count?.bids || 0} bids</span>
                      </div>
                    </div>
                    <Badge 
                      variant={project.status === "Open" ? "default" : project.status === "Evaluation" ? "secondary" : "outline"}
                    >
                      {project.status}
                    </Badge>
                  </div>
                ))
              )}
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
              {pendingVerifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending verifications</p>
              ) : (
                pendingVerifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.companyName}</h4>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pending</Badge>
                      <Link href="/admin/users">
                        <Button size="sm" variant="outline">Review</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
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
