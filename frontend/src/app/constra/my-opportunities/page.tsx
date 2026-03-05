"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Gavel } from "lucide-react"
import Link from "next/link"

interface Notice {
  sNo: number
  referenceNumber: string
  title: string
  orderedBy: string
  autoUpdate: string
  lastUpdated: string
  query: string
  bidSupplement: string
  bidNoticeStatus: string
  submissionDeadline: string
  preparedBy: string
  bidSubmissionStatus: string
}

const noticesData: Notice[] = [
  // Empty for now - will be populated from API
]

export default function MyOpportunitiesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Notices</h2>
        <Link href="/constra/opportunities">
          <Button className="bg-[#002D5D]">
            <Gavel className="w-4 h-4 mr-2" />
            Find More Projects
          </Button>
        </Link>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        {/* Search/Filter Bar */}
        <div className="bg-gray-100 p-2 border-b flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Order by</span>
          <select className="text-sm border rounded px-2 py-1 bg-white">
            <option>Date</option>
            <option>Reference Number</option>
            <option>Title</option>
          </select>
          <Input 
            placeholder="Search..." 
            className="w-64 text-sm h-8"
          />
          <Button size="sm" variant="outline" className="h-8">
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>
        </div>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2E5C8A] text-white">
                <th className="p-2 text-left font-semibold border-r border-blue-700">S.No.</th>
                <th className="p-2 text-left font-semibold border-r border-blue-700">Reference Number</th>
                <th className="p-2 text-left font-semibold border-r border-blue-700">Title</th>
                <th className="p-2 text-left font-semibold border-r border-blue-700">Ordered By</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Auto Update</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Last Updated</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Query</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Bid Supplement</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Bid Notice Status</th>
                <th className="p-2 text-center font-semibold border-r border-blue-700">Submission Deadline</th>
                <th className="p-2 text-left font-semibold border-r border-blue-700">Prepared By</th>
                <th className="p-2 text-center font-semibold">Bid Submission Status</th>
              </tr>
            </thead>
            <tbody>
              {noticesData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-gray-500 bg-white">
                    No records found.
                  </td>
                </tr>
              ) : (
                noticesData.map((notice, index) => (
                  <tr 
                    key={notice.sNo} 
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 border-b border-gray-200">{notice.sNo}</td>
                    <td className="p-2 border-b border-gray-200 text-blue-600 hover:underline cursor-pointer">
                      {notice.referenceNumber}
                    </td>
                    <td className="p-2 border-b border-gray-200">{notice.title}</td>
                    <td className="p-2 border-b border-gray-200">{notice.orderedBy}</td>
                    <td className="p-2 border-b border-gray-200 text-center">{notice.autoUpdate}</td>
                    <td className="p-2 border-b border-gray-200 text-center">{notice.lastUpdated}</td>
                    <td className="p-2 border-b border-gray-200 text-center">{notice.query}</td>
                    <td className="p-2 border-b border-gray-200 text-center">{notice.bidSupplement}</td>
                    <td className="p-2 border-b border-gray-200 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        notice.bidNoticeStatus === 'Open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {notice.bidNoticeStatus}
                      </span>
                    </td>
                    <td className="p-2 border-b border-gray-200 text-center">{notice.submissionDeadline}</td>
                    <td className="p-2 border-b border-gray-200">{notice.preparedBy}</td>
                    <td className="p-2 border-b border-gray-200 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        notice.bidSubmissionStatus === 'Submitted' 
                          ? 'bg-blue-100 text-blue-700' 
                          : notice.bidSubmissionStatus === 'Awarded'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {notice.bidSubmissionStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination */}
        <div className="bg-gray-100 p-2 border-t flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>Page 1 of 1</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled>{'<<'}</Button>
              <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled>{'<'}</Button>
              <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled>{'>'}</Button>
              <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled>{'>>'}</Button>
            </div>
          </div>
          <div className="text-gray-600">
            Showing 0 to 0 of 0 entries
          </div>
        </div>
      </Card>

      {/* Footer Links */}
      <div className="flex justify-end gap-4 text-xs text-blue-600">
        <Link href="#" className="hover:underline">Help</Link>
        <span className="text-gray-400">|</span>
        <Link href="#" className="hover:underline">Contact Us</Link>
        <span className="text-gray-400">|</span>
        <Link href="#" className="hover:underline">Sitemap</Link>
      </div>
    </div>
  )
}
