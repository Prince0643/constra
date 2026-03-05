"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Bell, User, Search, LogOut, Clock, ChevronDown } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"

const mainNavItems = [
  { href: "/constra", label: "My Constra" },
  { href: "/constra/organization", label: "My Organization" },
  { href: "/constra/profile", label: "My Profile" },
  { href: "/constra/opportunities", label: "Opportunities" },
  { href: "/constra/directory", label: "Directory" },
  { href: "/constra/about", label: "About Company" },
]

const subNavConfig: Record<string, { href: string; label: string }[]> = {
  "/constra/organization": [
    { href: "/constra/organization/sub-organizations", label: "Sub-organization List" },
    { href: "/constra/organization/contacts", label: "Organization Contact List" },
    { href: "/constra/organization/certificates", label: "View Certificate" },
    { href: "/constra/organization/history", label: "View History" },
    { href: "/constra/organization/bank-account", label: "Bank Account" },
  ],
  "/constra": [],
  "/constra/profile": [
    { href: "/constra/profile", label: "Own Profile" },
    { href: "/constra/profile/reset-passphrase", label: "Reset Passphrase" },
    { href: "/constra/profile/change-password", label: "Change Password" },
    { href: "/constra/profile/activity", label: "Activity" },
    { href: "/constra/profile/bid-matching", label: "Bid Matching" },
  ],
  "/constra/opportunities/open": [
    { href: "/constra/opportunities/open", label: "Search" },
    { href: "/constra/opportunities/open/detailed-search", label: "Detailed Search" },
    { href: "/constra/opportunities/open/category", label: "View by Category" },
    { href: "/constra/opportunities/open/agency", label: "View by Agency" },
  ],
  "/constra/opportunities/former": [
    { href: "/constra/opportunities/former", label: "Search" },
    { href: "/constra/opportunities/former/detailed-search", label: "Detailed Search" },
    { href: "/constra/opportunities/former/category", label: "View by Category" },
    { href: "/constra/opportunities/former/agency", label: "View by Agency" },
  ],
  "/constra/opportunities/awards": [
    { href: "/constra/opportunities/awards", label: "Awards Notices" },
  ],
  "/constra/directory": [
    { href: "/constra/directory", label: "Buyers" },
    { href: "/constra/directory/cso", label: "CSO" },
    { href: "/constra/directory/auditor", label: "Auditor" },
  ],
  "/constra/about": [
    { href: "/constra/about", label: "Company Info" },
    { href: "/constra/about/gpra", label: "GPRA" },
    { href: "/constra/about/contact", label: "Contact" },
  ],
}

export default function ConstraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [myConstraOpen, setMyConstraOpen] = useState(false)
  const [myOrganizationOpen, setMyOrganizationOpen] = useState(false)
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false)
  
  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Get current date and time
  const now = new Date()
  const dateTimeStr = now.toLocaleString("en-PH", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Determine active section for sub-nav - sort by longest key first to match specific paths
  const activeSection = Object.keys(subNavConfig)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname === key || pathname.startsWith(`${key}/`)) || "/constra"
  const subNavItems = subNavConfig[activeSection] || []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Header - Deep Navy */}
      <header className="sticky top-0 z-50 bg-[#002D5D] text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - Logo & User Info */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#002D5D]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CONSTRA</h1>
                <p className="text-xs text-blue-200">Philippine Construction Procurement System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span className="font-semibold">MARC JUSTIN ARZADON</span>
                <span className="text-blue-300">|</span>
                <Clock className="w-4 h-4" />
                <span>{dateTimeStr}</span>
              </div>
              <NotificationBell />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-800"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Log-out
              </Button>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex px-4">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              // Special handling for My Constra with dropdown
              if (item.href === "/constra") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setMyConstraOpen(true)}
                    onMouseLeave={() => setMyConstraOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1 ${
                        isActive
                          ? "text-white border-white bg-blue-800"
                          : "text-blue-200 border-transparent hover:text-white hover:bg-blue-800/50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${myConstraOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {myConstraOpen && (
                      <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-b-lg min-w-[180px] z-50">
                        <Link
                          href="/constra/pending-task"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/pending-task" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Pending Task
                        </Link>
                        <Link
                          href="/constra/my-opportunities"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/my-opportunities" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          My Opportunities
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              
              // Special handling for My Organization with dropdown
              if (item.href === "/constra/organization") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setMyOrganizationOpen(true)}
                    onMouseLeave={() => setMyOrganizationOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1 ${
                        isActive
                          ? "text-white border-white bg-blue-800"
                          : "text-blue-200 border-transparent hover:text-white hover:bg-blue-800/50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${myOrganizationOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Dropdown Menu - 6 items */}
                    {myOrganizationOpen && (
                      <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-b-lg min-w-[200px] z-50">
                        <Link
                          href="/constra/organization"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Organization Profile
                        </Link>
                        <Link
                          href="/constra/organization/documents"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization/documents" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Document Library
                        </Link>
                        <Link
                          href="/constra/organization/projects"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization/projects" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Ongoing/Completed Project
                        </Link>
                        <Link
                          href="/constra/organization/consultant"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization/consultant" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Consultant
                        </Link>
                        <Link
                          href="/constra/organization/activity"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization/activity" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Activity
                        </Link>
                        <Link
                          href="/constra/organization/products"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/organization/products" 
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Product/Service Listing
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              
              // Special handling for Opportunities with dropdown
              if (item.href === "/constra/opportunities") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpportunitiesOpen(true)}
                    onMouseLeave={() => setOpportunitiesOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1 ${
                        isActive
                          ? "text-white border-white bg-blue-800"
                          : "text-blue-200 border-transparent hover:text-white hover:bg-blue-800/50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${opportunitiesOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Dropdown Menu - 3 items */}
                    {opportunitiesOpen && (
                      <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-b-lg min-w-[200px] z-50">
                        <Link
                          href="/constra/opportunities/open"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/opportunities/open" || pathname.startsWith("/constra/opportunities/open")
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Open Opportunities
                        </Link>
                        <Link
                          href="/constra/opportunities/former"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/opportunities/former" || pathname.startsWith("/constra/opportunities/former")
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Former Opportunities
                        </Link>
                        <Link
                          href="/constra/opportunities/awards"
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
                            pathname === "/constra/opportunities/awards" || pathname.startsWith("/constra/opportunities/awards")
                              ? "text-[#002D5D] font-medium bg-blue-50" 
                              : "text-gray-700"
                          }`}
                        >
                          Awards Notices
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? "text-white border-white bg-blue-800"
                      : "text-blue-200 border-transparent hover:text-white hover:bg-blue-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {subNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 text-sm transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "text-[#002D5D] border-[#002D5D] font-medium"
                      : "text-gray-600 border-transparent hover:text-[#002D5D] hover:border-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#002D5D] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            <p>&copy; 2026 Constra - Philippine Construction Procurement System</p>
            <p>Republic Act 9184 - Government Procurement Reform Act</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
