"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Building2, CreditCard, CheckCircle, Landmark } from "lucide-react"

interface BankAccount {
  id: number
  accountName: string
  bankName: string
  accountNumber: string
  accountType: string
  branch: string
  status: "Active" | "Inactive"
  isPrimary: boolean
}

const bankAccounts: BankAccount[] = [
  {
    id: 1,
    accountName: "JAJR CONSTRUCTION",
    bankName: "BDO Unibank",
    accountNumber: "**** **** **** 1234",
    accountType: "Current Account",
    branch: "Quezon City Main",
    status: "Active",
    isPrimary: true,
  },
  {
    id: 2,
    accountName: "JAJR CONSTRUCTION",
    bankName: "Bank of the Philippine Islands",
    accountNumber: "**** **** **** 5678",
    accountType: "Savings Account",
    branch: "Makati City",
    status: "Active",
    isPrimary: false,
  },
  {
    id: 3,
    accountName: "JAJR CONSTRUCTION - Payroll",
    bankName: "Metrobank",
    accountNumber: "**** **** **** 9012",
    accountType: "Payroll Account",
    branch: "Pasig City",
    status: "Active",
    isPrimary: false,
  },
]

export default function BankAccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Bank Account</h2>
        <Button className="bg-[#002D5D]">
          <Plus className="w-4 h-4 mr-2" />
          Add Bank Account
        </Button>
      </div>

      <div className="grid gap-4">
        {bankAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-[#002D5D]" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {account.bankName}
                    {account.isPrimary && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{account.accountName}</p>
                </div>
              </div>
              <Badge className={account.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {account.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Account Number:</span>
                  <p className="font-medium text-lg">{account.accountNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Account Type:</span>
                  <p className="font-medium">{account.accountType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Branch:</span>
                  <p className="font-medium">{account.branch}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {!account.isPrimary && (
                  <Button size="sm" variant="outline">
                    Set as Primary
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bankAccounts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Bank Accounts</h3>
            <p className="text-gray-500 mb-4">Add bank accounts for payment processing.</p>
            <Button className="bg-[#002D5D]">
              <Plus className="w-4 h-4 mr-2" />
              Add First Account
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-yellow-700" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-900">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please ensure all bank account information is accurate. 
                Payments and refunds will be processed using your primary account.
                Contact support if you need to update account details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
