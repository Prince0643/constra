"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight } from "lucide-react"

const categories = [
  { name: "Civil Works", count: 89, subcategories: ["Roads and Bridges", "Buildings", "Water Systems"] },
  { name: "Goods", count: 45, subcategories: ["IT Equipment", "Office Supplies", "Machinery"] },
  { name: "Consulting Services", count: 23, subcategories: ["Engineering", "Architectural", "Planning"] },
  { name: "Infrastructure", count: 156, subcategories: ["Transportation", "Energy", "Water Resources"] },
]

export default function FormerCategoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#002D5D]">View by Category - Former Opportunities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002D5D]">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} closed opportunities</p>
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
