# Document Verification Page

## Overview

The Document Verification page is a dedicated interface for reviewing and verifying user-submitted documents. It provides filtering, statistics, and individual document approval/rejection capabilities with detailed user information.

## File Location

`frontend/src/app/admin/verification/page.tsx`

## Key Features

### Page Header

- **Title**: "Document Verification"
- **Description**: "Review and verify user submitted documents"

### Pending Alert Banner

**Condition**: Displayed when `pendingCount > 0`

**Content**:
- AlertTriangle icon (yellow)
- Title: "Pending Verifications"
- Message: "{X} user(s) are waiting for document verification."

**Styling**: bg-yellow-50, border-yellow-200

### Statistics Cards (4 Cards)

| Card | Value | Color | Description |
|------|-------|-------|-------------|
| Total Users | users.length | default | All regular users |
| Pending | pending count | yellow-600 | Awaiting verification |
| Verified | verified count | green-600 | Approved users |
| Rejected | rejected count | red-600 | Denied users |

### Filter Section

**Filter Card**:
- Title: "Filter Users"
- Description: "Filter by verification status"
- Dropdown: All Users, Pending, Verified, Rejected

### Users Table

**Columns**:
1. Company (bold)
2. Email (gray text)
3. Documents (file icon + bid count)
4. Status Badge
5. Actions

**Status Badges**:
| Status | Style |
|--------|-------|
| Verified | bg-green-100 text-green-700 |
| Rejected | variant="destructive" |
| Pending | variant="secondary" |

**Action Buttons**:
- **Verify** (Pending only) - Green button with Check icon
- **Reject** (Pending only) - Red outline button with XCircle icon
- **Preview** (all users) - Ghost button with Eye icon

## User Preview Dialog

### Header

- **Title**: "User Details"
- **Description**: "Viewing documents for {companyName}"

### User Information Grid (2 columns)

| Field | Value |
|-------|-------|
| Email | {email} |
| Status | {statusBadge} |
| Company | {companyName} |
| Business Type | {businessType} |
| DTI Registration | {dtiRegistration} |
| TIN Number | {tinNumber} |

### Uploaded Documents Section

**Header**: "Uploaded Documents"

**Document Cards**:
```
┌────────────────────────────────────────────────────────────┐
│ {doc.name}                                                  │
│ {fileName} • {fileSize}                                    │
│ [{statusBadge}]           [Approve] / [Reject]             │
└────────────────────────────────────────────────────────────┘
```

**Document Status**:
- pending → [Approve] button visible
- verified → [Reject] button visible

**Individual Document Verification**:
```typescript
const handleVerifyDocument = async (docId: number, status: string) => {
  // PUT /api/documents/:id/verify
  // Body: { status: 'verified' | 'pending' }
  // Refreshes documents on success
}
```

## Verify User Dialog

### Content

- **Title**: "Verify User"
- Confirmation message with company name
- Email display
- Impact note: "This will allow the user to bid on projects."

### Actions

- Cancel (outline button)
- Confirm Verification (green button with Check icon)

## Reject User Dialog

### Content

- **Title**: "Reject Verification"
- Confirmation message with company name
- Email display
- Impact note: "The user will not be able to bid on projects until they resubmit valid documents."

### Actions

- Cancel (outline button)
- Confirm Rejection (destructive button with XCircle icon)

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Fetch all users |
| `/api/users/:id/verify` | PUT | Verify/reject user |
| `/api/users/:id/documents` | GET | Fetch user documents |
| `/api/documents/:id/verify` | PUT | Verify individual document |

### Handlers

**Fetch Users**:
```typescript
const fetchUsers = async () => {
  // GET /api/users
  // Filters for role === "User" only
}
```

**Verify User**:
```typescript
const handleVerify = async (userId: number) => {
  // PUT /api/users/:id/verify
  // Body: { status: "Verified" }
}
```

**Reject User**:
```typescript
const handleReject = async (userId: number) => {
  // PUT /api/users/:id/verify
  // Body: { status: "Rejected" }
}
```

## State Management

```typescript
const [users, setUsers] = useState<any[]>([])
const [selectedUser, setSelectedUser] = useState<any>(null)
const [isLoading, setIsLoading] = useState(true)
const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
const [previewUser, setPreviewUser] = useState<any>(null)
const [previewDocuments, setPreviewDocuments] = useState<any[]>([])
const [filterStatus, setFilterStatus] = useState<string>("all")
```

## Data Transformations

### User Filter
```typescript
const filteredUsers = filterStatus === "all" 
  ? users 
  : users.filter(u => u.verificationStatus === filterStatus)
```

### Pending Count
```typescript
const pendingCount = users.filter(u => u.verificationStatus === "Pending").length
```

### Status Badge Component
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Verified": return <Badge className="bg-green-100 text-green-700">Verified</Badge>
    case "Rejected": return <Badge variant="destructive">Rejected</Badge>
    default: return <Badge variant="secondary">Pending</Badge>
  }
}
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Badge`
- `Button`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Alert`, `AlertDescription`, `AlertTitle`

### Icons (Lucide React)
- CheckCircle, XCircle, Clock, FileText, Eye, Loader2, Check
- AlertTriangle, ExternalLink

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  Document Verification                                      │
│  Review and verify user submitted documents                 │
├─────────────────────────────────────────────────────────────┤
│  ⚠️ PENDING ALERT (when applicable)                       │
│  Pending Verifications                                      │
│  X user(s) are waiting for document verification.           │
├─────────────────────────────────────────────────────────────┤
│  STATS GRID (4 cards)                                      │
│  [Total Users] [Pending] [Verified] [Rejected]              │
├─────────────────────────────────────────────────────────────┤
│  FILTER CARD                                               │
│  Filter Users                                               │
│  [All Users ▼]                                              │
├─────────────────────────────────────────────────────────────┤
│  USERS TABLE                                               │
│  User Verifications (X users found)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Company | Email | Documents | Status | Actions       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ ABC Construction | abc@... | 📄 5 bids | [Pending]     │   │
│  │                                       [Verify][Reject][👁️]│
│  ├──────────────────────────────────────────────────────┤   │
│  │ XYZ Builders | xyz@... | 📄 0 bids | [Verified]      │   │
│  │                                       [👁️]            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

PREVIEW DIALOG:
┌─────────────────────────────────────────────────────────────┐
│  User Details                                               │
│  Viewing documents for [Company Name]                        │
├─────────────────────────────────────────────────────────────┤
│  USER INFO (2 columns):                                     │
│  Email: xxx@example.com                                     │
│  Status: [Verified/Pending/Rejected]                        │
│  Company: ABC Construction                                  │
│  Business Type: Construction                                │
│  DTI: 123456789 | TIN: 123-456-789-000                     │
├─────────────────────────────────────────────────────────────┤
│  UPLOADED DOCUMENTS:                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ DTI Certificate                                       │   │
│  │ dti_cert.pdf • 2.4MB                                  │   │
│  │ [Pending]              [✓ Approve]                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Mayor's Permit                                        │   │
│  │ mayors_permit.pdf • 1.8MB                             │   │
│  │ [Verified]             [✗ Reject]                     │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  [Close]                                                    │
└─────────────────────────────────────────────────────────────┘

VERIFY DIALOG:
┌─────────────────────────────────────────────────────────────┐
│  Verify User                                                │
│  Are you sure you want to verify [Company]?                  │
│  Email: xxx@example.com                                      │
│  This will allow the user to bid on projects.               │
├─────────────────────────────────────────────────────────────┤
│  [Cancel] [✓ Confirm Verification]                        │
└─────────────────────────────────────────────────────────────┘

REJECT DIALOG:
┌─────────────────────────────────────────────────────────────┐
│  Reject Verification                                        │
│  Are you sure you want to reject [Company]?                  │
│  Email: xxx@example.com                                      │
│  User will not be able to bid until resubmitting.          │
├─────────────────────────────────────────────────────────────┤
│  [Cancel] [✗ Confirm Rejection]                           │
└─────────────────────────────────────────────────────────────┘
```

## Loading State

- Centered spinner with `Loader2` icon
- Animate spin with `text-blue-600` color

## Empty State

- Large FileText icon (gray-300)
- "No users found" message

## Related Pages

- `/admin/users` - User management with account focus
- `/admin/merchants` - Merchant registration approvals
- `/admin/directory` - Organization directory
- `/admin/dashboard` - Overview with pending count

## Differences from Users Page

| Feature | Verification Page | Users Page |
|---------|-------------------|------------|
| Primary Focus | Document verification | Account management |
| User Filter | Role = "User" only | All users |
| Alert Banner | Pending verifications alert | None |
| Document Actions | Individual doc approval/reject | View only |
| Stats | Status distribution | Joined/bids |

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer ${token}` header

## Workflow

1. Admin sees pending verifications alert
2. Reviews list of users with documents to verify
3. Filters by status if needed
4. Clicks preview to see detailed document list
5. Verifies individual documents or entire user
6. User status updates allow/prevent bidding
