"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Key, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ResetPassphrasePage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002D5D]">Reset Passphrase</h2>
        <p className="text-gray-600">Reset your security passphrase for account recovery</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="w-5 h-5" />
            Reset Security Passphrase
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your passphrase is used for account recovery and sensitive operations. 
                  Choose something memorable but secure. Minimum 8 characters.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current">Current Passphrase</Label>
            <div className="relative">
              <Input 
                id="current" 
                type={showCurrent ? "text" : "password"} 
                placeholder="Enter current passphrase"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">New Passphrase</Label>
            <div className="relative">
              <Input 
                id="new" 
                type={showNew ? "text" : "password"} 
                placeholder="Enter new passphrase"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Passphrase</Label>
            <div className="relative">
              <Input 
                id="confirm" 
                type={showConfirm ? "text" : "password"} 
                placeholder="Confirm new passphrase"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button className="bg-[#002D5D]">
              <Lock className="w-4 h-4 mr-2" />
              Reset Passphrase
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
