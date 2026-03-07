# Opportunity Detail Page

## Overview

The Opportunity Detail page displays comprehensive information about a specific Invitation to Bid (ITB) posting, including project overview, requirements, bids received, and agency information. Admins can edit the posting or print/export the details.

## File Location

`frontend/src/app/admin/opportunities/[id]/page.tsx`

## Key Features

### Header Section

- **Back Button**: Returns to `/admin/opportunities`
- **Title**: Project title (#002D5D color)
- **Subtitle**: ITB #{id} • {procuringEntity}
- **Action Buttons**:
  - Print (outline with Printer icon)
  - Edit (primary with Edit icon) → Links to `/admin/opportunities/new?edit={id}`

### Status Banner

**Conditional Styling**:
| Status | Background | Border |
|--------|------------|--------|
| Open | green-50 | green-200 |
| Draft | orange-50 | orange-200 |
| Closed/Awarded | gray-50 | gray-200 |

**Content**:
- Status badge (colored based on status)
- Creation info: "Created {date} by {createdBy}"
- Publish Now button (visible for Draft status only)

## Main Content Grid (3-Column Layout)

### Left Column (2/3 width)

#### 1. Project Overview Card

**Fields Displayed** (2-column grid):
| Field | Value |
|-------|-------|
| Approved Budget (ABC) | ₱XXX,XXX (large bold #002D5D) |
| Bid Deadline | Formatted date |
| Location | {location || 'N/A'} |
| Category | {category || 'N/A'} |

**Separator**

**Description Section**:
- Shows project description or "No description provided."

#### 2. Bid Requirements Card

**Content**:
- List of requirements with checkmarks
- Shows "No requirements specified" if empty

**Requirement Display**:
```
✓ {requirement.name}
```

#### 3. Bids Received Card

**Header**: "Bids Received ({count})" with Users icon

**Table Columns**:
1. Bidder (company name)
2. Amount (right-aligned, formatted currency)
3. Status (badge)

**Status Badges**:
| Status | Style |
|--------|-------|
| Won | bg-green-100 text-green-700 |
| Lost | bg-red-100 text-red-700 |
| Submitted/Other | bg-blue-100 text-blue-700 |

**Empty State**: "No bids received yet."

### Right Column (1/3 width)

#### 1. Agency Information Card

**Fields**:
| Field | Value |
|-------|-------|
| Procuring Entity | {procuringEntity || 'N/A'} |
| Client Agency | {clientAgency || 'N/A'} |
| Reference Number | {referenceNumber || 'N/A'} |
| Procurement Mode | {procurementMode || 'N/A'} |

#### 2. Documents Card

**Header**: "Documents" with FileText icon

**Action Buttons**:
- Download ITB Documents
- View Terms of Reference

## Data Interface

```typescript
interface Project {
  id: string
  title: string
  description: string
  abc: number
  location: string
  deadline: string
  status: string
  category: string
  procuringEntity: string
  clientAgency: string
  referenceNumber: string
  solicitationNumber: string
  procurementMode: string
  classification: string
  deliveryPeriod: string
  createdBy: string
  createdAt: string
  requirements: { 
    name: string
    description: string
    required: boolean 
  }[]
  bids: { 
    id: string
    bidAmount: number
    companyName: string
    bidStatus: string 
  }[]
}
```

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects/:id` | GET | Fetch project details |

### Fetch Handler

```typescript
const fetchProject = async () => {
  // GET /api/projects/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Sets project state on success
}
```

## State Management

```typescript
const [project, setProject] = useState<Project | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

## Utility Functions

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return "₱" + (amount || 0).toLocaleString()
}
```

### Date Formatting
```typescript
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- `Separator`

### Icons (Lucide React)
- ArrowLeft, Building2, Calendar, DollarSign, MapPin, FileText
- Users, Edit, Download, Printer

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [← Back to Opportunities]                                  │
│  [Project Title]                              [Print] [Edit]│
│  ITB #{id} • {Agency}                                       │
├─────────────────────────────────────────────────────────────┤
│  STATUS BANNER ({color based on status})                   │
│  [{Status Badge}] Created {date} by {user}    [Publish Now] │
├─────────────────────────────────────────────────────────────┤
│  MAIN CONTENT (2:1 grid)                                    │
│  ┌────────────────────────────────┬──────────────────────┐│
│  │ PROJECT OVERVIEW               │  AGENCY INFORMATION  ││
│  │ ┌────────────────────────────┐ │  ┌──────────────────┐││
│  │ │ ABC: ₱XXX,XXX    Deadline: │ │  │ Procuring: XXX   │││
│  │ │ Location: XXX    Category: │ │  │ Client: XXX      │││
│  │ ├────────────────────────────┤ │  │ Reference: XXX   │││
│  │ │ Description:               │ │  │ Mode: XXX        │││
│  │ │ {description text}         │ │  └──────────────────┘││
│  │ └────────────────────────────┘ │                      ││
│  │                                │  DOCUMENTS           ││
│  │ BID REQUIREMENTS             │  ┌──────────────────┐││
│  │ ┌────────────────────────────┐ │  │ [Download ITB]   │││
│  │ │ ✓ Requirement 1          │ │  │ [View ToR]       │││
│  │ │ ✓ Requirement 2          │ │  └──────────────────┘││
│  │ └────────────────────────────┘ │                      ││
│  │                                │                      ││
│  │ BIDS RECEIVED (X)            │                      ││
│  │ ┌────────────────────────────┐ │                      ││
│  │ │ Bidder | Amount | Status │ │                      ││
│  │ ├────────────────────────────┤ │                      ││
│  │ │ ABC Corp │ ₱500K │ [Won]  │ │                      ││
│  │ │ XYZ Inc  │ ₱550K │ [Lost] │ │                      ││
│  │ └────────────────────────────┘ │                      ││
│  └────────────────────────────────┴──────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Loading State

- Text: "Loading opportunity details..."
- Displayed while fetching project data

## Error State

- Red text: "Error: {error message}"
- Displayed when API call fails

## Not Found State

- Text: "Opportunity not found"
- Displayed when project data is null after loading

## URL Parameters

### Dynamic Route
```
/admin/opportunities/{id}
```

- `id` is extracted from `useParams()`
- Used to fetch specific project data

## Related Pages

- `/admin/opportunities` - List all opportunities
- `/admin/opportunities/new?edit={id}` - Edit this opportunity
- `/admin/bids` - Manage all bids including this project's bids

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer {token}` header
- Redirects to login if token missing

## Status Badge Colors

```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-green-600'
    case 'Draft': return 'bg-orange-500'
    case 'Closed': return 'bg-gray-600'
    case 'Awarded': return 'bg-blue-600'
    default: return 'bg-gray-600'
  }
}
```
