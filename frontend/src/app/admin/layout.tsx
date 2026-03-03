"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  FolderPlus, 
  Gavel,
  BarChart3,
  Settings, 
  LogOut, 
  Search,
  Shield
} from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/merchants", label: "Merchant Approvals", icon: Users },
  { href: "/admin/opportunities", label: "Manage Opportunities", icon: FolderPlus },
  { href: "/admin/bids", label: "Bid Evaluations", icon: Gavel },
  { href: "/admin/directory", label: "Global Directory", icon: BarChart3 },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
]

export default function AdminLayout({
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

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Navy Blue Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#002D5D] text-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#002D5D]" />
            </div>
            <div>
              <h1 className="text-lg font-bold">CONSTRA</h1>
              <p className="text-xs text-blue-300">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.href === "/admin/merchants" && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">12</Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-blue-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-blue-200 hover:text-white hover:bg-blue-800" 
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-[#002D5D]">Admin Control Panel</h1>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search Reference ID..." 
                  className="pl-9 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="w-8 h-8 bg-[#002D5D] rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">System Admin</p>
                  <p className="text-gray-500">admin@constra.com</p>
                </div>
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
