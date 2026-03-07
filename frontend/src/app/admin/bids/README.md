# Bid Evaluations Page

## Overview

The Bid Evaluations page provides administrators with a comprehensive interface to view, manage, and evaluate all submitted bids across projects. Admins can award bids to winning contractors or reject bids that don't meet requirements.

## File Location

`frontend/src/app/admin/bids/page.tsx`

## Key Features

### Header with Refresh

- **Title**: "All Bids"
- **Description**: "View and manage all bids submitted by contractors"
- **Refresh Button**: Updates bid data with loading animation

### Project Filter

- **Dropdown Select**: Filter bids by specific project
- **Options**: 
  - All Projects
  - Individual projects with bid count
  - Format: "{Project Title} ({X} bids)"

### Bids Table

**Table Columns**:
1. **Project** - Project title with ABC subtitle
2. **Bidder** - Company name with email subtitle
3. **Bid Amount** - Formatted currency, highlights lowest bid
4. **Submitted** - Submission date
5. **Status** - Bid status badge
6. **Actions** - Award, Reject, View buttons

**Status Badges**:
| Status | Badge Style |
|--------|-------------|
| Won | bg-green-100 text-green-700 (Awarded) |
| Lost | outline, text-gray-500 (Not Awarded) |
| Submitted | bg-blue-100 text-blue-700 |
| Under Evaluation | bg-yellow-100 text-yellow-700 |

**Action Buttons** (for pending bids):
- **Award** - Green button with Trophy icon
- **Reject** - Outline button with XCircle icon (red text)
- **View** - Ghost button with Eye icon

**Lowest Bid Indicator**:
- First row in sorted table shows "Lowest" badge (yellow) if not yet awarded/lost

### Statistics Summary (4 Cards)

| Stat | Description |
|------|-------------|
| Total Bids | Count of filtered bids |
| Pending | Submitted + Under Evaluation status |
| Awarded | Won status bids |
| Lowest Bid | Minimum bid amount in filtered list |

## Data Management

### State Variables

```typescript
const [bids, setBids] = useState<any[]>([])
const [projects, setProjects] = useState<any[]>([])
const [selectedProject, setSelectedProject] = useState<string>("all")
const [selectedBid, setSelectedBid] = useState<any>(null)
const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false)
const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
const [isLoading, setIsLoading] = useState(true)
```

### Bid Sorting

Bids are sorted by amount (lowest first) for evaluation:
```typescript
[...filteredBids].sort((a, b) => a.bidAmount - b.bidAmount)
```

### Filtering Logic

```typescript
const filteredBids = selectedProject === "all" 
  ? bids 
  : bids.filter(b => b.projectId.toString() === selectedProject)
```

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bids` | GET | Fetch all bids |
| `/api/projects` | GET | Fetch projects for filter dropdown |
| `/api/bids/:id/award` | PUT | Award bid to contractor |
| `/api/bids/:id/reject` | PUT | Reject bid |

### Award Bid Handler

```typescript
const handleAward = async (bidId: number) => {
  // PUT /api/bids/:id/award
  // Refreshes data on success
  // Closes award dialog
}
```

### Reject Bid Handler

```typescript
const handleReject = async (bidId: number) => {
  // PUT /api/bids/:id/reject
  // Refreshes data on success
  // Closes reject dialog
}
```

## Dialog Components

### Award Dialog

**Content**:
- Confirmation message with company name
- Project details
- Bid amount
- Warning: "This action cannot be undone"

**Actions**:
- Cancel (outline button)
- Confirm Award (green button with Trophy icon)

### Reject Dialog

**Content**:
- Confirmation message with company name
- Notification notice: "The bidder will be notified"

**Actions**:
- Cancel (outline button)
- Confirm Rejection (destructive button with XCircle icon)

### View Bid Dialog

**Content Grid** (2 columns):
| Field | Value |
|-------|-------|
| Project | {projectTitle} |
| Bidder | {companyName} |
| Bid Amount | ₱XXX,XXX (highlighted) |
| Submitted | YYYY-MM-DD |
| Status | {statusBadge} |
| Compliance | {complianceStatus || 'N/A'} |

**Optional Section**:
- Bidder Notes (if available)

**Actions**:
- Close button

## Utility Functions

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return "₱" + amount?.toLocaleString()
}
```

### Status Badge Component
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Won": return <Badge className="bg-green-100 text-green-700">Awarded</Badge>
    case "Lost": return <Badge variant="outline" className="text-gray-500">Not Awarded</Badge>
    case "Submitted": return <Badge className="bg-blue-100 text-blue-700">Submitted</Badge>
    case "Under Evaluation": return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Badge`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`

### Icons (Lucide React)
- Trophy, XCircle, Eye, Loader2, Gavel, RefreshCw

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Title & Description]                    [Refresh Button]  │
├─────────────────────────────────────────────────────────────┤
│  FILTER CARD                                                │
│  Filter Bids                                                │
│  [All Projects ▼]                                          │
├─────────────────────────────────────────────────────────────┤
│  BIDS TABLE                                                 │
│  Bid Submissions ({X} total)                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Project | Bidder | Amount | Submitted | Status | Actions│
│  ├──────────────────────────────────────────────────────┤   │
│  │ ITB Title          │ ABC Corp │ ₱500,000 │ 2026-03-01 │ [Lowest] │
│  │ ABC: ₱1,000,000   │ email... │          │            │ [Submitted]│
│  │                    │          │          │            │ [Award] [Reject] [View]│
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  STATS SUMMARY (4 cards)                                   │
│  [Total Bids: X] [Pending: X] [Awarded: X] [Lowest: ₱XXX]   │
└─────────────────────────────────────────────────────────────┘

DIALOGS:
┌─────────────────────────────────────────────────────────────┐
│  AWARD BID                                                  │
│  Confirm award to [Company]?                                  │
│  Project: [Title] | Amount: [₱XXX]                          │
│  ⚠️ Cannot be undone, other bids rejected                     │
│  [Cancel] [Confirm Award 🏆]                                │
├─────────────────────────────────────────────────────────────┤
│  REJECT BID                                                 │
│  Reject bid from [Company]?                                 │
│  Bidder will be notified.                                   │
│  [Cancel] [Confirm Rejection ✗]                             │
├─────────────────────────────────────────────────────────────┤
│  BID DETAILS                                                │
│  Grid: Project, Bidder, Amount, Submitted, Status           │
│  [Notes section if available]                               │
│  [Close]                                                    │
└─────────────────────────────────────────────────────────────┘
```

## Loading & Empty States

### Loading State
- Centered spinner with `Loader2` icon
- Animate spin with `text-blue-600`

### Empty State
- Large Gavel icon (gray-300)
- "No bids found for this project" message

## Error Handling

- Console logging for API errors
- Alert notifications for failed award/reject actions
- Graceful handling of missing bid data

## Related Pages

- `/admin/opportunities` - Manage project opportunities
- `/admin/projects` - Project management with bid viewing
- `/admin/dashboard` - Overview with pending bids count
