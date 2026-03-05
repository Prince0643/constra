"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function BidMatchingPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-[#002D5D]">Bid Match Profile</h2>

      {/* Initial Search Section */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <p className="font-semibold">Initial Search</p>
          </div>

          <div className="space-y-4">
            {/* Keyword(s) */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Keyword(s)</Label>
              <div>
                <p className="text-xs text-gray-500 italic mb-1">(Enter terms or phrases separated by commas &quot;,&quot;)</p>
                <Textarea className="h-16" placeholder="Enter keywords..." />
              </div>
            </div>

            {/* Classification */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Classification</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>Civil Works</option>
                <option>Consulting Services</option>
                <option>Goods</option>
                <option>Goods - General Support Services</option>
                <option>Goods - IT Equipment and Software</option>
                <option>Works - Infrastructure</option>
              </select>
            </div>

            {/* Procurement Mode */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Procurement Mode</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>International Competitive Bidding</option>
                <option>Limited Source Bidding (Sec. 49)</option>
                <option>Negotiated Procurement - Community Participation (Sec. 53)</option>
                <option>Negotiated Procurement - Small Value Procurement (Sec. 53.5)</option>
                <option>Shopping (Sec. 52)</option>
                <option>Direct Contracting (Sec. 50)</option>
              </select>
            </div>

            {/* Applicable Procurement Rules */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Applicable Procurement Rules</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>ADB Guidelines on the use of Consultants</option>
                <option>ADB Procurement Guidelines</option>
                <option>Implementing Rules and Regulations</option>
                <option>International / Executive Agreement</option>
                <option>Republic Act 9184 (GPRA)</option>
              </select>
            </div>

            {/* Funding Instrument */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Funding Instrument</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>General Appropriations Act</option>
                <option>National Expenditure Program (NEP) for the succeeding year</option>
                <option>Budget for the Contract Approved by the Sanggunian</option>
                <option>Foreign Funded</option>
                <option>Corporate Budget</option>
              </select>
            </div>

            {/* Category */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Category</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>Advertising Agency Services</option>
                <option>Agricultural Chemicals</option>
                <option>Agricultural Machinery and Equipment</option>
                <option>Agricultural Products (Seeds, Seedlings, Plants...)</option>
                <option>Construction Materials</option>
                <option>IT Equipment and Software</option>
              </select>
            </div>

            {/* Area of Delivery */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Area of Delivery</Label>
              <select className="w-full h-24 border rounded p-2 text-sm" multiple>
                <option>(Independent City)</option>
                <option>Abra</option>
                <option>Agusan Del Norte</option>
                <option>Agusan Del Sur</option>
                <option>Aklan</option>
                <option>Albay</option>
                <option>Metro Manila</option>
              </select>
            </div>

            {/* Approved Budget (Range) */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="text-sm font-semibold">Approved Budget (Range)</Label>
              <div className="flex items-center gap-2">
                <Input className="w-32" placeholder="From" />
                <span className="text-sm">To</span>
                <Input className="w-32" placeholder="To" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refine By Section */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <p className="font-semibold text-gray-500 italic">Refine By</p>
            <p className="text-xs text-gray-500 italic">(Enter terms or phrases separated by commas &quot;,&quot;)</p>
          </div>

          <div className="space-y-4">
            {/* Must Have */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Must Have</Label>
              <Textarea className="h-16" placeholder="Enter required terms..." />
            </div>

            {/* Must Not Have */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label className="text-sm font-semibold pt-2">Must Not Have</Label>
              <Textarea className="h-16" placeholder="Enter excluded terms..." />
            </div>

            {/* Delivery Method */}
            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="text-sm font-semibold">Delivery Method<span className="text-red-500">*</span></Label>
              <select className="w-48 p-2 border rounded text-sm">
                <option>Online Only</option>
                <option>Manual Only</option>
                <option>Both</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        <Button className="bg-[#002D5D]">Save</Button>
        <Button variant="outline">Test</Button>
        <Button variant="outline">Reset</Button>
      </div>
    </div>
  )
}
