"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  MapPin, 
  Hash, 
  Award, 
  Briefcase, 
  Tag,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit,
  Download,
  FileText,
  Users,
  Clock
} from "lucide-react"

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002D5D]">My Organization</h2>
          <p className="text-gray-600 mt-1">Organization Information and Details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#002D5D] hover:bg-blue-800">
            <Edit className="w-4 h-4" />
            Edit Info
          </Button>
        </div>
      </div>

      {/* Company Header Card */}
      <Card className="bg-gradient-to-r from-[#002D5D] to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-[#002D5D]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">JAJR CONSTRUCTION</h1>
                <Badge className="bg-red-600 text-white border-none hover:bg-red-700">RED/PLATINUM</Badge>
              </div>
              <div className="flex items-center gap-2 text-blue-200 mb-4">
                <MapPin className="w-4 h-4" />
                <span>123 Construction Ave., Quezon City, Metro Manila, Philippines</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Verified Organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Member since 2018</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Last updated: March 1, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y">
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Organization Number
                </dt>
                <dd className="font-medium text-[#002D5D]">ORG-2024-001234</dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Registration Type
                </dt>
                <dd>
                  <Badge className="bg-red-600 text-white border-none">RED / PLATINUM</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Form of Organization
                </dt>
                <dd className="font-medium">Single Proprietorship</dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Business Category
                </dt>
                <dd className="font-medium">Construction Materials and Supplies</dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Tax ID (TIN)
                </dt>
                <dd className="font-medium text-[#002D5D]">123-456-789-000</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Status & Compliance */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Status & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y">
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600">Blacklisted Status</dt>
                <dd>
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    No
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600">Suspension Status</dt>
                <dd>
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    None
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600">License Status</dt>
                <dd>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Active</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600">PCAB License</dt>
                <dd className="font-medium">AAA-2024-5678</dd>
              </div>
              <div className="flex items-center justify-between p-4">
                <dt className="text-sm text-gray-600">Expiry Date</dt>
                <dd className="font-medium text-orange-600">December 31, 2026</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Business Address</h4>
              <div className="space-y-2 text-sm">
                <p className="font-medium">JAJR CONSTRUCTION</p>
                <p>123 Construction Avenue</p>
                <p>Quezon City, Metro Manila 1100</p>
                <p>Philippines</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">+63 (2) 8123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">info@jajr-construction.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium">www.jajr-construction.com</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">24</p>
            <p className="text-sm text-gray-600">Organization Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">156</p>
            <p className="text-sm text-gray-600">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">47</p>
            <p className="text-sm text-gray-600">Awards Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="w-8 h-8 text-[#002D5D] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#002D5D]">892</p>
            <p className="text-sm text-gray-600">Bids Submitted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
