"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight } from "lucide-react"

const categories = [
  { name: "Civil Works", count: 156, subcategories: ["Roads and Bridges", "Buildings", "Water Systems", "Flood Control"] },
  { name: "Goods", count: 89, subcategories: ["IT Equipment", "Office Supplies", "Medical Supplies", "Machinery"] },
  { name: "Consulting Services", count: 45, subcategories: ["Engineering", "Architectural", "Planning", "Project Management"] },
  { name: "Infrastructure", count: 234, subcategories: ["Transportation", "Energy", "Communications", "Water Resources"] },
]

export default function OpenCategoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">View by Category - Open Opportunities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#002D5D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002D5D]">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} opportunities</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <span key={sub} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {sub}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
