"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Building2, Calendar, MapPin, XCircle } from "lucide-react"

export default function FormerOpportunitiesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">Former Opportunities</h2>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <Label className="font-semibold">Search Projects</Label>
            <div className="flex gap-2">
              <Input placeholder="Enter project name, agency, or keywords..." className="flex-1" />
              <Button className="bg-[#002D5D]">
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Results */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#002D5D]">
                    Construction of Municipal Hall - Package {item}
                  </h3>
                  <span className="text-sm text-gray-500">Closed: Feb {10 + item}, 2026</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    LGU San Fernando
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    La Union
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted: Jan {15 + item}, 2026
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  ABC: ₱{8 + item}0,000,000.00 | Status: <span className="text-red-600 font-medium flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Bidding Closed
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
