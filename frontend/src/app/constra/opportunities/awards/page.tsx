"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface AwardNotice {
  id: number
  awardNoticeNumber: string
  awardDate: string
  referenceNumber: string
  classification: string
  title: string
  supplierName: string
}

const awardData: AwardNotice[] = [
  {
    id: 1,
    awardNoticeNumber: "0501264",
    awardDate: "30-Dec-2026",
    referenceNumber: "2024-001",
    classification: "Goods",
    title: "Various Office Supplies for Regional Office",
    supplierName: "MARCUSTREND TRADING",
  },
  {
    id: 2,
    awardNoticeNumber: "0501263",
    awardDate: "28-Dec-2026",
    referenceNumber: "2024-002",
    classification: "Civil Works",
    title: "Construction of School Building Phase 1",
    supplierName: "JAJR CONSTRUCTION",
  },
  {
    id: 3,
    awardNoticeNumber: "0501254",
    awardDate: "28-Dec-2026",
    referenceNumber: "2023-089",
    classification: "Services",
    title: "IT Equipment Supply and Installation",
    supplierName: "VSTECH ENTERPRISES",
  },
  {
    id: 4,
    awardNoticeNumber: "0501218",
    awardDate: "26-Dec-2026",
    referenceNumber: "2024-015",
    classification: "Civil Works",
    title: "Road Rehabilitation and Improvement",
    supplierName: "GATEWAY 25-25 CONSTRUCTION CORPORATION",
  },
  {
    id: 5,
    awardNoticeNumber: "0501213",
    awardDate: "22-Dec-2026",
    referenceNumber: "2023-112",
    classification: "Goods",
    title: "Procurement of IT Equipment 2024",
    supplierName: "PAULS OFFICE SUPPLIES",
  },
  {
    id: 6,
    awardNoticeNumber: "0501202",
    awardDate: "22-Dec-2026",
    referenceNumber: "2024-003",
    classification: "Goods",
    title: "Electrical Supply and Materials",
    supplierName: "VST ELECTRICAL SUPPLY AND SERVICES",
  },
  {
    id: 7,
    awardNoticeNumber: "0501222",
    awardDate: "20-Dec-2026",
    referenceNumber: "2024-025",
    classification: "Civil Works",
    title: "Construction of Drainage Canal System",
    supplierName: "MARCHEN CONCRETE GOODS TRADING",
  },
  {
    id: 8,
    awardNoticeNumber: "0501189",
    awardDate: "22-Dec-2026",
    referenceNumber: "2023-156",
    classification: "Goods",
    title: "Office Furniture and Fixtures",
    supplierName: "JOSEPH ENTERPRISES",
  },
  {
    id: 9,
    awardNoticeNumber: "0501175",
    awardDate: "19-Dec-2026",
    referenceNumber: "2024-018",
    classification: "Services",
    title: "Consultancy Services for Infrastructure Project",
    supplierName: "PINZON CONSULTANCY",
  },
  {
    id: 10,
    awardNoticeNumber: "0501123",
    awardDate: "18-Dec-2026",
    referenceNumber: "2024-007",
    classification: "Civil Works",
    title: "Repair and Maintenance of Provincial Road",
    supplierName: "TIMOTHY BUILDERS INC.",
  },
]

export default function AwardsNoticesPage() {
  return (
    <div className="space-y-4">
      {/* Header with Search link */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-[#002D5D]">Award Notices</h2>
        <a href="#" className="text-sm text-blue-600 hover:underline">Search</a>
        <a href="#" className="text-sm text-blue-600 hover:underline">Detailed Search</a>
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
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Award Notice Number</th>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Award</th>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Reference Number</th>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Classification</th>
                  <th className="text-white py-2 px-3 text-left font-semibold border-r border-blue-400">Title</th>
                  <th className="text-white py-2 px-3 text-left font-semibold">Supplier Name</th>
                </tr>
              </thead>
              <tbody>
                {awardData.map((award, index) => (
                  <tr key={award.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-center">{index + 1}</td>
                    <td className="py-2 px-3 text-blue-600 hover:underline cursor-pointer">
                      {award.awardNoticeNumber}
                    </td>
                    <td className="py-2 px-3">{award.awardDate}</td>
                    <td className="py-2 px-3 text-blue-600 hover:underline cursor-pointer">
                      {award.referenceNumber}
                    </td>
                    <td className="py-2 px-3 text-blue-600 hover:underline cursor-pointer">
                      {award.classification}
                    </td>
                    <td className="py-2 px-3">{award.title}</td>
                    <td className="py-2 px-3">{award.supplierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-[#002D5D]">First</span>
              <span className="font-semibold text-[#002D5D]">« Prev</span>
              <span className="px-2">Page 1 of 892</span>
              <span className="font-semibold text-[#002D5D]">Next »</span>
              <span className="font-semibold text-[#002D5D]">Last</span>
            </div>
            <div className="text-xs text-gray-500">
              148,291 award notices found.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
