"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function DirectoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">Global Directory</h2>
        <p className="text-gray-600 mt-1">Browse all registered contractors and organizations</p>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Construction className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500 max-w-md">
            This feature is currently under development. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
