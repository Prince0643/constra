"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2,
  Scale,
  FileText,
  Gavel,
  Globe,
  Shield,
  Users,
  Target,
  BookOpen
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">About Constra</h2>
        <p className="text-gray-600 mt-1">Philippine Construction Procurement System</p>
      </div>

      {/* Company Info Hero */}
      <Card className="bg-gradient-to-r from-[#002D5D] to-blue-800 text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-[#002D5D]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CONSTRA</h1>
              <p className="text-blue-200 text-lg">Construction Procurement Excellence</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed max-w-3xl">
            Constra is the Philippine Construction Procurement System, a modern platform designed 
            to streamline government and private sector procurement processes in the construction 
            industry. Built in compliance with the Government Procurement Reform Act (R.A. 9184), 
            Constra provides transparency, efficiency, and accountability in public procurement.
          </p>
        </CardContent>
      </Card>

      {/* GPRA Section */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl text-[#002D5D] flex items-center gap-2">
            <Scale className="w-6 h-6" />
            Government Procurement Reform Act
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              <strong>Republic Act No. 9184</strong>, also known as the Government Procurement 
              Reform Act, is the primary law governing the procurement of goods, services, and 
              infrastructure projects by the Philippine government. This landmark legislation 
              was enacted to promote transparency, accountability, and efficiency in government 
              procurement processes.
            </p>
            
            <h3 className="text-lg font-semibold text-[#002D5D] mt-6 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Declaration of Policy
            </h3>
            <p className="mb-4">
              It is the declared policy of the State to promote the ideals of good governance 
              in all its transactions involving public interest. To this end, all branches, 
              constitutional commissions, offices, agencies, or instrumentalities of the Government, 
              including government-owned and/or controlled corporations (GOCCs), government financial 
              institutions (GFIs), state universities and colleges (SUCs), and local government units 
              (LGUs), shall adopt a competitive and transparent procurement process that aims to:
            </p>
            
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-[#002D5D] mt-1">•</span>
                <span>Ensure the most efficient use of public funds through transparent and competitive procedures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#002D5D] mt-1">•</span>
                <span>Standardize procurement processes across government agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#002D5D] mt-1">•</span>
                <span>Promote fairness and equal opportunity for all qualified contractors and suppliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#002D5D] mt-1">•</span>
                <span>Prevent fraud, collusion, and corruption in government procurement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#002D5D] mt-1">•</span>
                <span>Establish effective monitoring and audit mechanisms</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#002D5D] mt-6 mb-3 flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              Scope and Application
            </h3>
            <p className="mb-4">
              The Act applies to all procurement of goods, consulting services, and infrastructure 
              projects, including construction, by all branches, agencies, departments, bureaus, 
              offices, and instrumentalities of the Government, including GOCCs, GFIs, SUCs, and LGUs. 
              It also applies to government procurement involving public-private partnership 
              agreements, as well as to private entities acting as contractors or suppliers.
            </p>

            <h3 className="text-lg font-semibold text-[#002D5D] mt-6 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Competitive Bidding
            </h3>
            <p className="mb-4">
              Competitive public bidding is the default method of procurement. All procurement 
              shall be done through competitive public bidding, except as provided in the Act 
              and its implementing rules and regulations. This process involves the receipt of 
              bids from contractors or suppliers, evaluation of such bids, and award of contract 
              to the bidder with the lowest calculated and responsive bid or highest rated 
              and responsive bid, as the case may be.
            </p>

            <h3 className="text-lg font-semibold text-[#002D5D] mt-6 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Electronic Procurement
            </h3>
            <p className="mb-4">
              To promote transparency and efficiency, the Act mandates the use of electronic 
              procurement systems. The Government Electronic Procurement System (PhilGEPS) serves 
              as the single portal for all government procurement opportunities. Constra extends 
              this mandate to the construction sector, providing specialized tools and processes 
              tailored to the unique requirements of construction procurement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700 leading-relaxed">
              To revolutionize construction procurement in the Philippines by providing a 
              transparent, efficient, and accessible digital platform that connects qualified 
              contractors with government and private sector opportunities, fostering economic 
              growth and infrastructure development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <Target className="w-5 h-5" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700 leading-relaxed">
              To become the leading construction procurement platform in Southeast Asia, 
              recognized for excellence in transparency, innovation, and service delivery, 
              contributing to the nation&apos;s infrastructure goals and sustainable development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Badge className="bg-[#002D5D] text-white text-xs">Transparency</Badge>
                Open and honest processes
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-[#002D5D] text-white text-xs">Integrity</Badge>
                Ethical conduct always
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-[#002D5D] text-white text-xs">Excellence</Badge>
                Quality in everything
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-[#002D5D] text-white text-xs">Innovation</Badge>
                Continuous improvement
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-[#002D5D] text-white text-xs">Service</Badge>
                Customer-focused approach
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg text-[#002D5D] flex items-center gap-2">
            <Users className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[#002D5D] mb-3">Main Office</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Jajr Construction Corporation</p>
                <p>Pias, San Fernando City, La Union 2500</p>
                <p>Philippines</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-[#002D5D] mb-3">Contact Details</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Phone:</strong> +63 9325365015</p>
                <p><strong>Email:</strong> jajrconstruction123@gmail.com</p>
                <p><strong>Support:</strong> danrillera.va@gmail.com</p>
                <p><strong>Website:</strong> www.jajrconstruction.com</p>
                <p><strong>Hours:</strong> Monday - Saturday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Constra is registered under the Philippine Government Electronic Procurement System (PhilGEPS)</p>
        <p className="mt-1">Republic Act No. 9184 | Government Procurement Reform Act</p>
      </div>
    </div>
  )
}
