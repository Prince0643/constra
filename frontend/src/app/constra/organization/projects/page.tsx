"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, CheckCircle, Clock } from "lucide-react"

interface Project {
  id: number
  title: string
  location: string
  abc: number
  startDate: string
  completionDate: string
  status: "Ongoing" | "Completed"
  progress: number
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Highway Expansion Project",
    location: "Metro Manila",
    abc: 50000000,
    startDate: "2026-01-15",
    completionDate: "2026-12-31",
    status: "Ongoing",
    progress: 45,
  },
  {
    id: 2,
    title: "School Building Construction",
    location: "Cebu City",
    abc: 25000000,
    startDate: "2025-06-01",
    completionDate: "2026-02-28",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    title: "Bridge Rehabilitation",
    location: "Davao City",
    abc: 35000000,
    startDate: "2026-03-01",
    completionDate: "2026-09-30",
    status: "Ongoing",
    progress: 25,
  },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function OrganizationProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">Ongoing/Completed Projects</h2>
        <p className="text-gray-600">Track your organization&apos;s project portfolio</p>
      </div>

      <div className="grid gap-4">
        {projectsData.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              </div>
              <Badge 
                className={
                  project.status === "Completed" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-blue-100 text-blue-700"
                }
              >
                {project.status === "Completed" ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                ) : (
                  <><Clock className="w-3 h-3 mr-1" /> Ongoing</>
                )}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Contract Amount</p>
                  <p className="font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(project.abc)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-semibold">{project.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Completion Date</p>
                  <p className="font-semibold">{project.completionDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Progress</p>
                  <p className="font-semibold">{project.progress}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    project.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
