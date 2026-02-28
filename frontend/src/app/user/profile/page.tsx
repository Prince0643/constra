"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Building2, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">ABC Construction Corp</h3>
            <p className="text-gray-500">Verified Contractor</p>
            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>user@abc-construction.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Metro Manila, Philippines</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since Jan 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <p className="text-gray-900">ABC Construction Corporation</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Business Type</label>
                <p className="text-gray-900">Construction & Engineering</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">DTI Registration</label>
                <p className="text-gray-900">DTI-123456-2024</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">TIN Number</label>
                <p className="text-gray-900">123-456-789-000</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Business Address</label>
              <p className="text-gray-900">123 Main Street, Makati City, Metro Manila, Philippines</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Company Description</label>
              <p className="text-gray-900">
                ABC Construction Corporation is a leading construction company specializing in infrastructure 
                projects, commercial buildings, and government contracts. With over 10 years of experience, 
                we deliver quality construction services across the Philippines.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
