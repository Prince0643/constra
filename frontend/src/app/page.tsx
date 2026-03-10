import Link from "next/link";
import { Building2, Search, FolderOpen, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navigation Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">CONSTA</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">

          <Link href="/how-it-works" className="text-white/80 hover:text-white transition-colors text-sm">
            How It Works
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm">
            About Us
          </Link>
        </nav>

        {/* Login/Register Button */}
        <Link
          href="/login"
          className="px-5 py-2 bg-white text-slate-900 rounded-md font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Login / Register
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            PHILIPPINES&apos; MODERNIZED
            <br />
            CONSTRUCTION PROCUREMENT ENGINE
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            Access over 1,570 registered organizations and ₱90M+ in active project
            value through a centralized, transparent database
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Project Title or Reference ID..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Active Projects Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold text-white">5</span>
                <FolderOpen className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white font-semibold text-sm">ACTIVE PROJECTS</p>
            </div>

            {/* Verified Merchants Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold text-white">1,570</span>
                <div className="flex flex-col items-center">
                  <Users className="w-8 h-8 text-white/60" />
                  <span className="text-white/60 text-xs mt-1">Sector Summary</span>
                </div>
              </div>
              <p className="text-white font-semibold text-sm">VERIFIED MERCHANTS</p>
            </div>

            {/* Awarded Today Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold text-white">1</span>
                <TrendingUp className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white font-semibold text-sm">AWARDED TODAY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="bg-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/notices" className="text-white/60 hover:text-white text-sm transition-colors">
            Official Notices
          </Link>
          <Link href="/rules" className="text-white/60 hover:text-white text-sm transition-colors">
            Procurement Rules
          </Link>
          <Link href="/support" className="text-white/60 hover:text-white text-sm transition-colors">
            Technical Support
          </Link>
        </div>
      
      </footer>
    </main>
  );
}
