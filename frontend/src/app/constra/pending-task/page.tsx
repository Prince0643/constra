"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface TaskCategory {
  category: string
  count: number
  href?: string
}

const pendingTasksData: TaskCategory[] = [
  { category: "Registration", count: 0 },
  { category: "Pending Payment", count: 0 },
  { category: "Bid Matches", count: 0 },
  { category: "Since Last login", count: 0 },
  { category: "Invitations to Bid", count: 0 },
  { category: "Pending Orders", count: 3, href: "#" },
  { category: "Pending Bid Submission", count: 0 },
  { category: "Joint Venture Confirmation", count: 0 },
  { category: "Joint Venture Response", count: 0 },
  { category: "Invitation to Negotiate / Post Qualification", count: 0 },
  { category: "Award/Shortlisting Notices", count: 16, href: "#" },
  { category: "Notice To Proceed", count: 15, href: "#" },
  { category: "Notice of Ineligibility", count: 0 },
  { category: "Request for Adm. Review Received", count: 0 },
]

export default function PendingTaskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">Pending Tasks</h2>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="bg-[#2E5C8A] text-white p-3">
          <CardTitle className="text-lg font-semibold text-center">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#2E5C8A] text-white">
                <th className="p-3 text-left font-semibold w-1/2">Category</th>
                <th className="p-3 text-center font-semibold w-1/2">Number/Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingTasksData.map((task, index) => (
                <tr 
                  key={task.category} 
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="p-3 border-b border-gray-200">
                    {task.category}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-center">
                    {task.count > 0 ? (
                      <Link 
                        href={task.href || "#"}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {task.count}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{task.count}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
