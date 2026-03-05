"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Tag, Box, Wrench } from "lucide-react"

interface ProductService {
  id: number
  name: string
  category: string
  description: string
  priceRange: string
  availability: "Available" | "Limited" | "Not Available"
}

const productsData: ProductService[] = [
  {
    id: 1,
    name: "Construction Materials Supply",
    category: "Supply",
    description: "High-quality cement, steel, aggregates, and other construction materials",
    priceRange: "₱500 - ₱50,000",
    availability: "Available",
  },
  {
    id: 2,
    name: "Heavy Equipment Rental",
    category: "Rental",
    description: "Excavators, bulldozers, cranes, and other heavy machinery for construction projects",
    priceRange: "₱5,000 - ₱50,000 per day",
    availability: "Available",
  },
  {
    id: 3,
    name: "Project Management Services",
    category: "Service",
    description: "Complete project planning, scheduling, and management for construction projects",
    priceRange: "Project-based quotation",
    availability: "Available",
  },
  {
    id: 4,
    name: "Architectural Design Services",
    category: "Service",
    description: "Professional building design, 3D modeling, and blueprint creation",
    priceRange: "₱50,000 - ₱500,000",
    availability: "Limited",
  },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Supply":
      return <Box className="w-5 h-5 text-blue-500" />
    case "Rental":
      return <Wrench className="w-5 h-5 text-orange-500" />
    case "Service":
      return <Tag className="w-5 h-5 text-green-500" />
    default:
      return <Box className="w-5 h-5 text-gray-500" />
  }
}

export default function ProductsServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Product/Service Listing</h2>
        <Button className="bg-[#002D5D]">
          <Plus className="w-4 h-4 mr-2" />
          Add Product/Service
        </Button>
      </div>

      <div className="grid gap-4">
        {productsData.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                      {item.category}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-medium ${
                  item.availability === "Available" 
                    ? "bg-green-100 text-green-700" 
                    : item.availability === "Limited"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {item.availability}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Price Range:</span>
                <span className="font-semibold text-[#002D5D]">{item.priceRange}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productsData.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Products/Services Listed</h3>
            <p className="text-gray-500 mb-4">Add your company&apos;s products and services to showcase to potential clients.</p>
            <Button className="bg-[#002D5D]">
              <Plus className="w-4 h-4 mr-2" />
              Add First Product/Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
