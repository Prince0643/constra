"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, Mail, Phone, Briefcase } from "lucide-react"

interface Contact {
  id: number
  name: string
  position: string
  email: string
  phone: string
  department: string
  isPrimary: boolean
}

const contacts: Contact[] = [
  {
    id: 1,
    name: "Marc Justin Arzadon",
    position: "General Manager",
    email: "marc.arzadon@jajr-construction.com",
    phone: "+63 912 345 6789",
    department: "Management",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    position: "Finance Manager",
    email: "maria.santos@jajr-construction.com",
    phone: "+63 913 456 7890",
    department: "Finance",
    isPrimary: false,
  },
  {
    id: 3,
    name: "Jose Reyes",
    position: "Operations Manager",
    email: "jose.reyes@jajr-construction.com",
    phone: "+63 914 567 8901",
    department: "Operations",
    isPrimary: false,
  },
]

export default function OrganizationContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#002D5D]">Organization Contact List</h2>
        <Button className="bg-[#002D5D]">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#002D5D]" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {contact.name}
                    {contact.isPrimary && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Primary</span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{contact.position}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{contact.department}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Contacts</h3>
            <p className="text-gray-500">Add organization contacts.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
