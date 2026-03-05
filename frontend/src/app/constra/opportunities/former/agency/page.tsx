"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight, MapPin } from "lucide-react"

const agencies = [
  { name: "Department of Public Works and Highways", region: "Nationwide", count: 145 },
  { name: "Department of Education", region: "Nationwide", count: 98 },
  { name: "Department of Health", region: "Nationwide", count: 45 },
  { name: "Department of Agriculture", region: "Nationwide", count: 67 },
  { name: "Local Government Units", region: "Various Provinces", count: 198 },
  { name: "State Universities and Colleges", region: "Various Regions", count: 34 },
]

export default function FormerAgencyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">View by Agency - Former Opportunities</h2>

      <div className="grid grid-cols-1 gap-3">
        {agencies.map((agency) => (
          <Card key={agency.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002D5D]">{agency.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {agency.region}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">{agency.count} closed</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
