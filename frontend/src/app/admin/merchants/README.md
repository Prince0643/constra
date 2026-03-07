# Merchant Approvals Page

## Overview

The Merchant Approvals page allows administrators to review, audit, and approve or reject contractor (merchant) registration applications. It provides a comprehensive interface for document verification and organization onboarding.

## File Location

`frontend/src/app/admin/merchants/page.tsx`

## Key Features

### Statistics Overview (4 Cards)

| Stat | Color | Description |
|------|-------|-------------|
| Total Applications | #002D5D | All merchant registrations |
| Pending Review | orange-600 | Awaiting admin action |
| Approved | green-600 | Successfully verified merchants |
| Rejected | red-600 | Denied applications |

### Merchant Applications Table

**Columns**:
1. Company Name (with business type subtitle)
2. TIN (Tax Identification Number)
3. Registration Date
4. Status Badge
5. Actions

**Status Badges**:
- `Approved` - bg-green-100 text-green-700
- `Rejected` - bg-red-100 text-red-700
- `Pending` - bg-orange-100 text-orange-700

**Action Buttons**:
- **Audit** - Opens document review modal
- **Approve** (Pending only) - Green button with CheckCircle icon
- **Reject** (Pending only) - Red button with XCircle icon

### Search & Filter

- **Search Field**: Filters by company name or TIN
- **Filter Button**: Placeholder for advanced filtering

## Data Interface

```typescript
interface Merchant {
  id: string
  companyName: string
  tin: string
  tinNumber: string
  registrationDate: string
  createdAt: string
  status: "Pending" | "Approved" | "Rejected"
  businessType: string
  dtiRegistration: string
  address: string
  businessAddress: string
  contactPerson: string
  email: string
  phone: string
  phoneNumber: string
  documents: {
    dti: string
    mayorsPermit: string
    bir: string
  }
}
```

## Document Audit Modal

### Company Information Section
- DTI Registration Number
- TIN Number
- Business Address
- Registration Date
- Contact Person
- Phone Number

### Submitted Documents

| Document | Icon Color | Actions |
|----------|------------|---------|
| DTI Certificate | Blue | View, Download |
| Mayor's Permit | Green | View, Download |
| BIR Registration | Orange | View, Download |

### Modal Actions (Pending Status)
- **Approve Registration** - Green button (full width)
- **Reject** - Outline button (full width)

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/merchants` | GET | Fetch all merchant applications |
| `/api/merchants/:id/verify` | PUT | Approve or reject merchant |

### Request/Response Examples

```typescript
// GET /api/merchants
// Response: Merchant[]

// PUT /api/merchants/:id/verify
// Body: { status: 'Approved' | 'Rejected' }
// Headers: { Authorization: `Bearer ${token}` }
```

## State Management

```typescript
const [searchQuery, setSearchQuery] = useState("")
const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
const [isAuditOpen, setIsAuditOpen] = useState(false)
const [merchantList, setMerchantList] = useState<Merchant[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

## Action Handlers

### Approve Merchant
```typescript
const handleApprove = async (merchantId: string) => {
  // PUT request to /api/merchants/:id/verify
  // Updates local state on success
}
```

### Reject Merchant
```typescript
const handleReject = async (merchantId: string) => {
  // PUT request to /api/merchants/:id/verify
  // Updates local state on success
}
```

### Filter Merchants
```typescript
const filteredMerchants = merchantList.filter((m) =>
  m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  m.tin.includes(searchQuery)
)
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- `Input`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`

### Icons (Lucide React)
- Search, Filter, FileText, Building2, CheckCircle, XCircle
- Download, Eye, Calendar, Hash, CreditCard, MapPin, User, FileCheck

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Title & Description]                    [X Pending Badge] │
├─────────────────────────────────────────────────────────────┤
│  STATS GRID (4 cards)                                      │
│  [Total] [Pending] [Approved] [Rejected]                  │
├─────────────────────────────────────────────────────────────┤
│  SEARCH & FILTER                                           │
│  [Search Input                    ] [Filter Button]        │
├─────────────────────────────────────────────────────────────┤
│  MERCHANTS TABLE                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Company | TIN | Date | Status | Actions             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ ABC Construction | 123... | 2026-03-01 | [Pending]  │   │
│  │                    [Audit] [Approve] [Reject]       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

AUDIT MODAL (when open):
┌─────────────────────────────────────────────────────────────┐
│  Audit Documents - [Company Name]                            │
├─────────────────────────────────────────────────────────────┤
│  Company Info Grid (2 columns):                              │
│  DTI: XXX | TIN: XXX | Address: XXX | Date: XXX | etc       │
├─────────────────────────────────────────────────────────────┤
│  SUBMITTED DOCUMENTS:                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Icon] DTI Certificate                               │   │
│  │ filename.pdf           [View] [Download]              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ [Icon] Mayor's Permit                                 │   │
│  │ filename.pdf           [View] [Download]              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ [Icon] BIR Registration                               │   │
│  │ filename.pdf           [View] [Download]              │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  [Approve Registration] [Reject]                           │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

- Validates authentication token before API calls
- Displays error message if fetch fails
- Graceful handling of missing merchant data

## Related Pages

- `/admin/directory` - View all registered organizations
- `/admin/verification` - User document verification
