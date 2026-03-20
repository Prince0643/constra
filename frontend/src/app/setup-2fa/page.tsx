"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Download, Copy, CheckCircle, Loader2 } from "lucide-react"

export default function Setup2FAPage() {
  const router = useRouter()
  const [step, setStep] = useState<"qr" | "verify" | "backup">("qr")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if tempToken exists
    const tempToken = localStorage.getItem("tempToken")
    if (!tempToken) {
      router.push("/login")
      return
    }
    
    // Setup 2FA
    setup2FA(tempToken)
  }, [router])

  const setup2FA = async (tempToken: string) => {
    setIsLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      
      const response = await fetch(`${API_URL}/users/me/2fa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to setup 2FA")
      }
      
      const data = await response.json()
      setQrCodeUrl(data.qrCodeUrl)
      setSecret(data.secret)
      setBackupCodes(data.backupCodes)
    } catch (err: any) {
      setError(err.message || "Failed to setup 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const tempToken = localStorage.getItem("tempToken")
      if (!tempToken) {
        router.push("/login")
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      
      const response = await fetch(`${API_URL}/users/me/2fa/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        },
        body: JSON.stringify({ code: verificationCode })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Invalid verification code")
        return
      }
      
      // Move to backup codes step
      setStep("backup")
    } catch (err) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    const tempToken = localStorage.getItem("tempToken")
    if (!tempToken) {
      router.push("/login")
      return
    }

    // Complete login with temp token
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      
      // Get user info first
      const userResponse = await fetch(`${API_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${tempToken}`
        }
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        
        // Store as if logged in
        localStorage.setItem("token", tempToken)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.removeItem("tempToken")
        
        // Redirect to dashboard
        router.push("/admin/dashboard")
      }
    } catch (err) {
      // If user endpoint fails, just store token and redirect
      localStorage.setItem("token", tempToken)
      localStorage.removeItem("tempToken")
      router.push("/admin/dashboard")
    }
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  if (isLoading && step === "qr" && !qrCodeUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Setting up 2FA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "qr" && "Setup Two-Factor Authentication"}
            {step === "verify" && "Verify Setup"}
            {step === "backup" && "Save Backup Codes"}
          </CardTitle>
          <CardDescription>
            {step === "qr" && "Scan the QR code with your authenticator app"}
            {step === "verify" && "Enter the 6-digit code from your app"}
            {step === "backup" && "Save these backup codes in a secure location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "qr" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img 
                      src={qrCodeUrl} 
                      alt="2FA QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 text-center">
                  Scan this QR code with Google Authenticator or Microsoft Authenticator
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Manual Entry Code</Label>
                <div className="flex gap-2">
                  <Input 
                    value={secret} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(secret)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  If you can&apos;t scan the QR code, enter this code manually
                </p>
              </div>

              <Button 
                onClick={() => setStep("verify")} 
                className="w-full"
              >
                I&apos;ve scanned the QR code
              </Button>
            </div>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-code">Enter 6-digit code</Label>
                <Input
                  id="verify-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className="text-center text-2xl tracking-widest"
                  autoFocus
                />
                <p className="text-sm text-gray-600">
                  Open your authenticator app and enter the current 6-digit code
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("qr")}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          )}

          {step === "backup" && (
            <div className="space-y-6">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Save these backup codes in a secure location. 
                  You&apos;ll need them if you lose access to your authenticator app.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={copyBackupCodes}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={downloadBackupCodes}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <Button 
                onClick={handleComplete}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                I&apos;ve saved my backup codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
