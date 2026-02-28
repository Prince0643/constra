"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, LayoutDashboard, FolderSearch, Gavel, UserCircle, FileText, LogOut } from "lucide-react"

const navItems = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/projects", label: "Find Projects", icon: FolderSearch },
  { href: "/user/bids", label: "My Bids", icon: Gavel },
  { href: "/user/verification", label: "Verification", icon: FileText },
  { href: "/user/profile", label: "Profile", icon: UserCircle },
]

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Mock verification status - in real app this comes from API
  const verificationStatus = "Verified" // "Pending", "Verified", "Rejected"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Constra</span>
            <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">User</span>
          </div>

          {/* Verification Status */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge 
                variant={verificationStatus === "Verified" ? "default" : verificationStatus === "Pending" ? "secondary" : "destructive"}
                className="text-xs"
              >
                {verificationStatus}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              // Disable Bidding tab if not verified
              const isDisabled = (item.href === "/user/projects" || item.href === "/user/bids") && verificationStatus !== "Verified"
              
              return (
                <Link
                  key={item.href}
                  href={isDisabled ? "#" : item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : isDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault()
                    }
                  }}
                  title={isDisabled ? "Complete verification to access this feature" : item.label}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isDisabled && <span className="ml-auto text-xs">🔒</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label || "Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">ABC Construction Corp</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-gray-500">user@abc-construction.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
