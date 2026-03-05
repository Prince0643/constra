"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ChangePasswordPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#002D5D]">Change Password</h2>

      <p className="text-sm text-gray-600">
        <span className="font-semibold">Note:</span> New Password must be at least 6 characters long and must not be the same as your Current Password.
      </p>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <Label className="font-semibold">User ID</Label>
            <span className="text-gray-700">marzadon1</span>
          </div>

          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <Label htmlFor="current" className="font-semibold">Current Password</Label>
            <Input 
              id="current" 
              type="password" 
              className="max-w-xs"
            />
          </div>

          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <Label htmlFor="new" className="font-semibold">New Password</Label>
            <Input 
              id="new" 
              type="password" 
              className="max-w-xs"
            />
          </div>

          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <Label htmlFor="confirm" className="font-semibold">Re-type New Password</Label>
            <Input 
              id="confirm" 
              type="password" 
              className="max-w-xs"
            />
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button className="bg-[#002D5D]">
              Submit
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm">
        <p className="font-semibold mb-2">Conditions in creating a new password</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Not similar to the user&apos;s Current password</li>
          <li>Must have at least six (6) characters</li>
          <li>Not same as the user&apos;s first/last name</li>
          <li>Must include at least one (1) alphabet and one (1) numeral</li>
        </ul>
      </div>
    </div>
  )
}
