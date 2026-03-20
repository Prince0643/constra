"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Database, Loader2, Smartphone } from "lucide-react"

interface Settings {
  platformName: string
  supportEmail: string
  sessionTimeout: number
  require2FA: boolean
  documentVerification: boolean
  newBidNotifications: boolean
  verificationRequestNotifications: boolean
  projectDeadlineNotifications: boolean
}

const defaultSettings: Settings = {
  platformName: "Constra",
  supportEmail: "support@constra.com",
  sessionTimeout: 30,
  require2FA: false,
  documentVerification: true,
  newBidNotifications: true,
  verificationRequestNotifications: true,
  projectDeadlineNotifications: true
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

// 2FA Management Component
function My2FACard() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [showDisable, setShowDisable] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState("")
  const [disableCode, setDisableCode] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"qr" | "verify">("qr")

  useEffect(() => {
    fetch2FAStatus()
  }, [])

  const fetch2FAStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me/2fa/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTwoFAEnabled(data.enabled)
      }
    } catch (error) {
      console.error("Failed to fetch 2FA status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetup = async () => {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me/2fa/setup`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setQrCodeUrl(data.qrCodeUrl)
        setSecret(data.secret)
        setBackupCodes(data.backupCodes)
        setShowSetup(true)
        setStep("qr")
      } else {
        setError("Failed to setup 2FA")
      }
    } catch (error) {
      setError("Failed to setup 2FA")
    }
  }

  const handleEnable = async () => {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me/2fa/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode })
      })
      if (response.ok) {
        setTwoFAEnabled(true)
        setShowSetup(false)
        setVerificationCode("")
        alert("2FA enabled successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Invalid verification code")
      }
    } catch (error) {
      setError("Failed to enable 2FA")
    }
  }

  const handleDisable = async () => {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me/2fa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: disableCode })
      })
      if (response.ok) {
        setTwoFAEnabled(false)
        setShowDisable(false)
        setDisableCode("")
        alert("2FA disabled successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Invalid code")
      }
    } catch (error) {
      setError("Failed to disable 2FA")
    }
  }

  const downloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "constra-2fa-backup-codes.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <CardTitle>My 2FA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <CardTitle>My Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>Manage your personal 2FA settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                {twoFAEnabled ? "Enabled - Your account is protected" : "Disabled - Enable for extra security"}
              </p>
            </div>
            <Badge className={twoFAEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {twoFAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          {twoFAEnabled ? (
            <Button variant="outline" className="w-full" onClick={() => setShowDisable(true)}>
              Disable 2FA
            </Button>
          ) : (
            <Button className="w-full" onClick={handleSetup}>
              Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{step === "qr" ? "Setup 2FA" : "Verify Setup"}</CardTitle>
              <CardDescription>
                {step === "qr" ? "Scan the QR code with your authenticator app" : "Enter the 6-digit code from your app"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
              )}
              {step === "qr" ? (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                    <p className="text-sm text-gray-600 text-center">
                      Scan with Google Authenticator or Microsoft Authenticator
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-xs">Manual Code</Label>
                    <code className="block text-sm font-mono mt-1">{secret}</code>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                    <strong>Important:</strong> Save these backup codes before continuing:
                    <div className="grid grid-cols-2 gap-1 mt-2 font-mono text-xs">
                      {backupCodes.map((code, i) => <div key={i}>{code}</div>)}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2" onClick={downloadBackupCodes}>
                      Download backup codes
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowSetup(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={() => setStep("verify")}>I&apos;ve scanned it</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Enter 6-digit code</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStep("qr")}>Back</Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleEnable}
                      disabled={verificationCode.length !== 6}
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disable Modal */}
      {showDisable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Disable 2FA</CardTitle>
              <CardDescription>Enter your 2FA code or a backup code to disable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
              )}
              <div className="space-y-2">
                <Label>Authentication Code or Backup Code</Label>
                <Input
                  type="text"
                  placeholder="Enter code"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDisable(false)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  className="flex-1" 
                  onClick={handleDisable}
                  disabled={!disableCode}
                >
                  Disable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof Settings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      if (response.ok) {
        setHasChanges(false)
        alert("Settings saved successfully")
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    fetchSettings()
    setHasChanges(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002D5D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input 
                id="platform-name" 
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input 
                id="support-email" 
                type="email" 
                value={settings.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Manila (GMT+8)" disabled />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure email and system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New Bid Notifications</Label>
                <p className="text-sm text-gray-500">Notify admins when new bids are submitted</p>
              </div>
              <Switch 
                checked={settings.newBidNotifications}
                onCheckedChange={(checked) => handleChange("newBidNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Verification Requests</Label>
                <p className="text-sm text-gray-500">Notify when users submit documents</p>
              </div>
              <Switch 
                checked={settings.verificationRequestNotifications}
                onCheckedChange={(checked) => handleChange("verificationRequestNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Project Deadlines</Label>
                <p className="text-sm text-gray-500">Send reminders before bid deadlines</p>
              </div>
              <Switch 
                checked={settings.projectDeadlineNotifications}
                onCheckedChange={(checked) => handleChange("projectDeadlineNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <Switch 
                checked={settings.require2FA}
                onCheckedChange={(checked) => handleChange("require2FA", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Document Verification</Label>
                <p className="text-sm text-gray-500">Require verification before bidding</p>
              </div>
              <Switch 
                checked={settings.documentVerification}
                onCheckedChange={(checked) => handleChange("documentVerification", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input 
                type="number" 
                value={settings.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value) || 30)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <CardTitle>System Status</CardTitle>
            </div>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <Badge className="bg-green-100 text-green-700">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">File Storage</span>
              <Badge className="bg-green-100 text-green-700">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Service</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        {/* My 2FA Settings */}
        <My2FACard />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>Reset Changes</Button>
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  )
}
