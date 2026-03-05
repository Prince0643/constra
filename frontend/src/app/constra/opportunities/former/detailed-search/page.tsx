"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Calendar } from "lucide-react"

export default function FormerDetailedSearchPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">Detailed Search - Former Opportunities</h2>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label className="font-semibold">Project Title</Label>
            <Input placeholder="Enter project title keywords..." />
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label className="font-semibold">Agency/Office</Label>
            <select className="w-full p-2 border rounded text-sm">
              <option>All Agencies</option>
              <option>Department of Public Works and Highways</option>
              <option>Department of Education</option>
              <option>Department of Health</option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label className="font-semibold">Location</Label>
            <select className="w-full p-2 border rounded text-sm">
              <option>All Locations</option>
              <option>Region I - Ilocos</option>
              <option>Region II - Cagayan Valley</option>
              <option>Region III - Central Luzon</option>
              <option>NCR - National Capital Region</option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label className="font-semibold">Closed Date (Range)</Label>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-40" />
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">To</span>
              <Input type="date" className="w-40" />
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label className="font-semibold">Status</Label>
            <select className="w-full p-2 border rounded text-sm">
              <option>All Status</option>
              <option>Awarded</option>
              <option>Cancelled</option>
              <option>Failed Bidding</option>
              <option>Negotiated Procurement</option>
            </select>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button className="bg-[#002D5D]">
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
