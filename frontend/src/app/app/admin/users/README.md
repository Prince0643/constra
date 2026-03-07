# User Management Page

## Overview

The User Management page allows administrators to view all contractor accounts, manage verification statuses, approve or reject pending verifications, and preview user details including uploaded documents.

## File Location

`frontend/src/app/admin/users/page.tsx`

## Key Features

### Page Header

- **Title**: "User Management"
- **Description**: "Manage contractor accounts and verifications"

### Users Table

**Columns**:
1. Company (with Building2 icon in blue badge)
2. Email
3. Status Badge
4. Joined Date
5. Bids Count
6. Actions

**Company Display**:
- Building2 icon in blue-100 background
- Company name (or "N/A" if not set)

**Status Badges**:
| Status | Variant |
|--------|---------|
| Verified | default (green) |
| Pending | secondary (yellow) |
| Rejected | destructive (red) |

**Action Buttons**:
- **Approve** (Pending only) - Green CheckCircle icon
- **Reject** (Pending only) - Red XCircle icon
- **Preview** (all users) - Eye icon (ghost button)

## User Preview Dialog

### Dialog Header

- **Title**: "User Details"
- **Description**: "Viewing details for {companyName}"

### User Information Grid (2 columns)

| Field | Value |
|-------|-------|
| Email | {email} |
| Status | {verificationStatus} (colored badge) |
| Company | {companyName} or "N/A" |
| Role | {role} |
| Joined | {createdAt?.split('T')[0]} |
| Total Bids | {_count?.bids or 0} |

### Uploaded Documents Section

**Header**: "Uploaded Documents"

**Document List**:
```
┌────────────────────────────────────────────────────┐
│ [📄] {doc.name}                                    │
│ {fileName} • {fileSize}          [{status}]       │
└────────────────────────────────────────────────────┘
```

**Document Status Badges**:
| Status | Style |
|--------|-------|
| verified | bg-green-100 text-green-700 |
| pending | bg-yellow-100 text-yellow-700 |

**Empty State**: "No documents uploaded"

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Fetch all users |
| `/api/users/:id/verify` | PUT | Update verification status |
| `/api/users/:id/documents` | GET | Fetch user documents |

### Verify Handler

```typescript
const handleVerify = async (userId: number, status: string) => {
  // PUT /api/users/:id/verify
  // Body: { status: "Verified" | "Rejected" }
  // Refreshes user list on success
}
```

### Preview Handler

```typescript
const handlePreview = async (user: any) => {
  // Sets previewUser state
  // Opens preview dialog
  // Fetches documents: GET /api/users/:id/documents
}
```

## State Management

```typescript
const [users, setUsers] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
const [previewUser, setPreviewUser] = useState<any>(null)
const [previewDocuments, setPreviewDocuments] = useState<any[]>([])
```

## Data Transformations

### User Object Structure
```typescript
{
  id: number
  email: string
  companyName: string | null
  role: "User" | "Admin"
  verificationStatus: "Verified" | "Pending" | "Rejected"
  createdAt: string (ISO date)
  _count: {
    bids: number
  }
}
```

### Document Object Structure
```typescript
{
  id: number
  name: string
  fileName: string
  fileSize: string
  status: "verified" | "pending"
}
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Badge`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`

### Icons (Lucide React)
- CheckCircle, XCircle, Eye, Building2, Loader2, FileText

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  User Management                                            │
│  Manage contractor accounts and verifications               │
├─────────────────────────────────────────────────────────────┤
│  USERS TABLE                                                │
│  All Users                                                  │
│  View and manage contractor accounts                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Company | Email | Status | Joined | Bids | Actions   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 🏢 ABC Construction | abc@... | [Verified] | 2026-03-01 │   │
│  │                                    12  [👁️]          │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 🏢 XYZ Builders | xyz@... | [Pending] | 2026-03-05  │   │
│  │                                    0   [✓][✗][👁️]   │   │
│  └──────────────────────────────────────────────────────┘   │
│  No users found (shown when empty)                          │
└─────────────────────────────────────────────────────────────┘

PREVIEW DIALOG:
┌─────────────────────────────────────────────────────────────┐
│  User Details                                               │
│  Viewing details for [Company Name]                          │
├─────────────────────────────────────────────────────────────┤
│  USER INFORMATION (2 columns):                              │
│  Email: xxx@example.com                                     │
│  Status: [Verified/Pending/Rejected]                        │
│  Company: ABC Construction                                    │
│  Role: User                                                 │
│  Joined: 2026-03-01                                         │
│  Total Bids: 12                                             │
├─────────────────────────────────────────────────────────────┤
│  UPLOADED DOCUMENTS:                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 📄 DTI Certificate                                   │   │
│  │ dti_cert.pdf • 2.4MB                  [Verified]   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 📄 BIR Registration                                  │   │
│  │ bir_reg.pdf • 1.8MB                   [Verified]   │   │
│  └──────────────────────────────────────────────────────┘   │
│  No documents uploaded (when empty)                         │
├─────────────────────────────────────────────────────────────┤
│  [Close]                                                    │
└─────────────────────────────────────────────────────────────┘
```

## Loading State

- Centered spinner with `Loader2` icon
- Animate spin with `text-blue-600` color
- Shown during initial data fetch

## Empty State

- Centered text: "No users found"
- Displayed when users array is empty

## Related Pages

- `/admin/verification` - Dedicated document verification page
- `/admin/merchants` - Merchant registration approvals
- `/admin/directory` - Global organization directory

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer ${token}` header

## Differences from Verification Page

| Feature | Users Page | Verification Page |
|---------|------------|-------------------|
| Primary Focus | Account management | Document verification |
| User List | All users | Users only (role: "User") |
| Quick Actions | Approve/Reject/Preview | Filter by status, detailed doc review |
| Document View | List in preview dialog | Full document verification UI |
| Stats | Joined date, bid count | Pending/Verified/Rejected counts |

## Usage Flow

1. Admin navigates to Users page
2. Sees list of all contractor accounts
3. Can quickly approve/reject pending users
4. Can preview any user's details and documents
5. Clicking preview opens detailed view dialog
6. Can verify individual documents within preview
