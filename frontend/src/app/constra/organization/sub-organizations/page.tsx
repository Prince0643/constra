"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SubOrganization {
  id: number
  name: string
  location: string
  status: "Active" | "Inactive"
}

const subOrganizations: SubOrganization[] = [
  // Empty array to match the reference showing "no sub-organizations"
]

export default function SubOrganizationsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#002D5D]">Sub-Organization List</h2>

      {/* Parent Organization Info */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-700">Parent Organization</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#002D5D] mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">JAJR CONSTRUCTION</p>
              <p className="text-sm text-gray-600">SS P ZAMORA ST BRGY II</p>
              <p className="text-sm text-gray-600">San Fernando City</p>
              <p className="text-sm text-gray-600">La Union</p>
              <p className="text-sm text-gray-600">Region I</p>
              <p className="text-sm text-gray-600">Philippines</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-Organizations Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1e5a8e]">
            <tr>
              <th className="text-white text-sm font-semibold py-2 px-4 text-left w-12">#</th>
              <th className="text-white text-sm font-semibold py-2 px-4 text-left border-l border-blue-400">Organization Name</th>
              <th className="text-white text-sm font-semibold py-2 px-4 text-left border-l border-blue-400">Location</th>
              <th className="text-white text-sm font-semibold py-2 px-4 text-left border-l border-blue-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {subOrganizations.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-blue-600 italic font-medium">
                  The organization has no sub-organizations
                </td>
              </tr>
            ) : (
              subOrganizations.map((org, index) => (
                <tr key={org.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{index + 1}</td>
                  <td className="py-3 px-4 text-sm border-l border-gray-200">{org.name}</td>
                  <td className="py-3 px-4 text-sm border-l border-gray-200">{org.location}</td>
                  <td className="py-3 px-4 text-sm border-l border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      org.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {org.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="bg-[#1e5a8e] hover:bg-blue-800">
          Create New Sub-Organization
        </Button>
        <Button variant="outline" asChild>
          <Link href="/constra/organization">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>
    </div>
  )
}
