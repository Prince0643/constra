"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface Sector {
  id: number
  name: string
  count: number
}

const sectors: Sector[] = [
  { id: 1, name: "Agriculture, Agrarian Reform and Natural Resources", count: 1433 },
  { id: 2, name: "Communications, Roads and Other Transportation", count: 243 },
  { id: 3, name: "Defense Security", count: 22 },
  { id: 4, name: "Economic Services", count: 1061 },
  { id: 5, name: "Education, Culture, and Manpower Development", count: 22233 },
  { id: 6, name: "General Government", count: 2189 },
  { id: 7, name: "General Public Services", count: 24232 },
  { id: 8, name: "Health", count: 203 },
  { id: 9, name: "Housing and Community Development", count: 30 },
  { id: 10, name: "Power and Energy", count: 61 },
  { id: 11, name: "Public Order and Safety", count: 1383 },
  { id: 12, name: "Social Security, Welfare and Employment", count: 3885 },
  { id: 13, name: "Social Services", count: 527 },
  { id: 14, name: "Transportation", count: 22 },
  { id: 15, name: "Trade and Industry", count: 37 },
  { id: 16, name: "Water Resources Development and Flood Control", count: 327 },
]

export default function DirectoryPage() {
  return (
    <div className="space-y-4">
      {/* Header with links */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-[#002D5D]">Buyer Directory</h2>
          <a href="#" className="text-sm text-blue-600 hover:underline">View By Sector</a>
          <a href="#" className="text-sm text-blue-600 hover:underline">Search Organization</a>
          <a href="#" className="text-sm text-blue-600 hover:underline">Search Contact</a>
        </div>
      </div>

      {/* Search Box */}
      <Card className="bg-gray-100">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Search</span>
            <Input className="w-64 h-8 text-sm" placeholder="Enter keywords..." />
            <Button className="bg-[#002D5D] h-8 text-sm">
              <Search className="w-3 h-3 mr-1" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1e5a8e]">
                <tr>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400 w-12">#</th>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Sector</th>
                  <th className="text-white py-2 px-3 text-left font-semibold">No. of Organizations</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((sector, index) => (
                  <tr key={sector.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-center">{index + 1}</td>
                    <td className="py-2 px-3">{sector.name}</td>
                    <td className="py-2 px-3">
                      <a href="#" className="text-blue-600 hover:underline">
                        {sector.count.toLocaleString()}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          <div className="flex justify-end p-3 border-t">
            <span className="text-sm text-gray-600 font-semibold">{sectors.length} Sectors Found</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
