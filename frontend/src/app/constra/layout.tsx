"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Bell, User, Search, LogOut, Clock } from "lucide-react"
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
  "/constra": [],
  "/constra/organization": [
    { href: "/constra/organization", label: "Information" },
    { href: "/constra/organization/documents", label: "Documents" },
    { href: "/constra/organization/users", label: "Users" },
  ],
  "/constra/profile": [
    { href: "/constra/profile", label: "Own Profile" },
    { href: "/constra/profile/reset-password", label: "Reset Passphrase" },
    { href: "/constra/profile/activity", label: "Activity" },
    { href: "/constra/profile/bid-matching", label: "Bid Matching" },
  ],
  "/constra/opportunities": [
    { href: "/constra/opportunities", label: "Search" },
    { href: "/constra/opportunities/detailed-search", label: "Detailed Search" },
    { href: "/constra/opportunities/category", label: "By Category" },
    { href: "/constra/opportunities/agency", label: "By Agency" },
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

  // Determine active section for sub-nav
  const activeSection = Object.keys(subNavConfig).find((key) =>
    pathname === key || pathname.startsWith(`${key}/`)
  ) || "/constra"
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
          <nav className="flex">
            {subNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 text-sm transition-colors border-b-2 ${
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
