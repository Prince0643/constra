"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Mail, Phone, Briefcase } from "lucide-react"

interface Consultant {
  id: number
  name: string
  position: string
  email: string
  phone: string
  specialization: string
  status: "Active" | "Inactive"
}

const consultantsData: Consultant[] = [
  {
    id: 1,
    name: "Engr. Maria Santos",
    position: "Senior Project Manager",
    email: "maria.santos@abc-construction.com",
    phone: "+63 912 345 6789",
    specialization: "Infrastructure Development",
    status: "Active",
  },
  {
    id: 2,
    name: "Engr. Jose Reyes",
    position: "Civil Engineer",
    email: "jose.reyes@abc-construction.com",
    phone: "+63 913 456 7890",
    specialization: "Structural Engineering",
    status: "Active",
  },
  {
    id: 3,
    name: "Ar. Anna Cruz",
    position: "Architect",
    email: "anna.cruz@abc-construction.com",
    phone: "+63 914 567 8901",
    specialization: "Building Design",
    status: "Active",
  },
]

export default function ConsultantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Consultants</h2>
        <Button className="bg-[#002D5D]">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Consultant
        </Button>
      </div>

      <div className="grid gap-4">
        {consultantsData.map((consultant) => (
          <Card key={consultant.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{consultant.name}</CardTitle>
                  <p className="text-sm text-gray-500">{consultant.position}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  consultant.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {consultant.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{consultant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{consultant.phone}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Specialization: </span>
                  <span className="font-medium">{consultant.specialization}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
