# Manage Opportunities Page

## Overview

The Manage Opportunities page is the central hub for creating, publishing, and managing Invitation to Bid (ITB) postings. Administrators can view existing opportunities, create new ITBs, and publish them for contractor bidding.

## File Location

`frontend/src/app/admin/opportunities/page.tsx`

## Key Features

### Header Section

- **Title**: "Manage Opportunities"
- **Description**: "Create and manage Invitation to Bid postings"
- **Post New ITB Button**: Links to `/admin/opportunities/new`

### Statistics Overview (4 Cards)

| Metric | Color | Description |
|--------|-------|-------------|
| Active ITBs | #002D5D | Projects with "Open" status |
| Drafts | orange-600 | Unpublished projects |
| Total Bids Received | blue-600 | Sum of all bids across projects |
| Total Value | green-600 | Sum of all ABC values |

### Search & Filter

- **Search Field**: Filter by ITB number or project title
- **Status Dropdown**: Filter by (All, Published, Draft, Closed)

### Opportunities Table

**Columns**:
1. ITB Number (monospace, #002D5D color)
2. Project Title (with agency subtitle)
3. ABC (formatted currency)
4. Deadline (with Calendar icon)
5. Bids (badge showing count)
6. Status Badge
7. Actions

**Status Badge Logic**:
```typescript
opp.status === "Open" ? "bg-green-100 text-green-700" :     // Published
opp.status === "Draft" ? "bg-orange-100 text-orange-700" : // Draft
opp.status === "Awarded" ? "bg-blue-100 text-blue-700" :   // Awarded
"bg-gray-100 text-gray-700"                                 // Closed/Other
```

**Status Label**:
- Open → "Published"
- Draft → "Draft"
- Others → Original status

**Action Buttons**:
- **View** - Links to `/admin/opportunities/{id}`
- **Edit** - Links to `/admin/opportunities/new?edit={id}`
- **Publish** (Draft only) - Publishes the ITB

### Create ITB Modal (Simplified)

**Note**: Full ITB creation is in `/admin/opportunities/new`

This modal provides a quick 3-step wizard:

#### Step 1: Project Info
- Project Title
- Project Description
- Procuring Agency (dropdown)
- Project Location

#### Step 2: Budget & Category
- Approved Budget (ABC)
- Bid Deadline
- Sector/Category (dropdown)
- ABC Guidelines information box

#### Step 3: Eligibility
- Eligibility Requirements (textarea)
- Required Documents Checklist
- Review Before Publishing notice

**Step Navigation**:
- Step indicators (1, 2, 3 circles)
- Back/Next buttons
- Save Draft button
- Publish ITB button (final step)

## Data Interface

```typescript
interface Opportunity {
  id: string
  title: string
  abc: number
  category: string
  deadline: string
  status: "Draft" | "Open" | "Closed" | "Awarded"
  bids: number
  agency: string
}

const formData = {
  title: "",
  description: "",
  abc: "",
  category: "",
  deadline: "",
  agency: "",
  location: "",
  eligibility: ""
}
```

## Predefined Options

### Categories
- Civil Works
- Infrastructure
- Construction Materials
- Electrical Works
- Mechanical Works
- IT Equipment
- Consulting Services
- Office Supplies

### Agencies
- DPWH - Department of Public Works
- DOH - Department of Health
- DepEd - Department of Education
- DPWH Region IV
- City of Quezon
- City of Manila

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | Fetch all projects/opportunities |
| `/api/projects/:id/status` | PATCH | Update project status |

### Publish Handler

```typescript
const handlePublish = async (oppId: string) => {
  // PATCH /api/projects/:id/status
  // Body: { status: 'Open' }
  // Updates local state on success
}
```

## Data Transformations

```typescript
// Transform API data to interface
const transformed: Opportunity[] = data.map((p: any) => ({
  id: p.id.toString(),
  title: p.title,
  abc: parseFloat(p.abc) || 0,
  category: p.category || 'Uncategorized',
  deadline: p.deadline ? p.deadline.split('T')[0] : '',
  status: p.status === 'Open' ? 'Open' : 
          p.status === 'Draft' ? 'Draft' : 
          p.status === 'Closed' ? 'Closed' : 'Awarded',
  bids: p._count?.bids || 0,
  agency: p.procuringEntity || 'Unknown Agency'
}))
```

## State Management

```typescript
const [searchQuery, setSearchQuery] = useState("")
const [isCreateOpen, setIsCreateOpen] = useState(false)
const [step, setStep] = useState(1)
const [opportunities, setOpportunities] = useState<Opportunity[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [publishingId, setPublishingId] = useState<string | null>(null)
const [formData, setFormData] = useState({
  title: "",
  description: "",
  abc: "",
  category: "",
  deadline: "",
  agency: "",
  location: "",
  eligibility: ""
})
```

## Utility Functions

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return "₱" + amount.toLocaleString()
}
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- `Input`
- `Textarea`
- `Label`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Separator`

### Icons (Lucide React)
- Plus, Search, Calendar, DollarSign, FolderPlus, Building2
- CheckCircle, Clock, AlertCircle, FileText, ChevronRight, ChevronLeft
- Save, Send, Edit, Eye, ExternalLink

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Title & Description]                    [+ Post New ITB]│
├─────────────────────────────────────────────────────────────┤
│  STATS GRID (4 cards)                                      │
│  [Active ITBs] [Drafts] [Total Bids] [Total Value]        │
├─────────────────────────────────────────────────────────────┤
│  SEARCH & FILTER                                           │
│  [Search ITB number or title...] [All Status ▼]           │
├─────────────────────────────────────────────────────────────┤
│  OPPORTUNITIES TABLE                                       │
│  Posted Opportunities                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ITB # | Project Title | ABC | Deadline | Bids | Status│   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1234 | School Building  | ₱1M | 2026-03-15 | [2] [Pub]│   │
│  │      | Dept of Education│     │           │    [View]│   │
│  │                                             [Edit]   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1235 | Road Construction| ₱5M | 2026-04-01 | [0] [Dft]│   │
│  │                                             [Publish]│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

CREATE MODAL (when open):
┌─────────────────────────────────────────────────────────────┐
│  [📁] Create New ITB Posting                               │
├─────────────────────────────────────────────────────────────┤
│  [ 1 ] → [ 2 ] → [ 3 ]                                       │
│  Project Info    Budget      Eligibility                    │
├─────────────────────────────────────────────────────────────┤
│  STEP CONTENT (varies by step):                             │
│  Step 1: Title, Description, Agency, Location             │
│  Step 2: ABC, Deadline, Category + Guidelines             │
│  Step 3: Eligibility textarea, Documents checklist, Notice  │
├─────────────────────────────────────────────────────────────┤
│  [Back]                    [Save Draft] [Next/Publish]    │
└─────────────────────────────────────────────────────────────┘
```

## Loading & Error States

### Loading State
- Text: "Loading opportunities..."
- Full page loading indicator

### Error State
- Red text: "Error: {error message}"
- Displayed when API fetch fails

## Related Pages

- `/admin/opportunities/new` - Full ITB creation/editor
- `/admin/opportunities/:id` - Opportunity detail view
- `/admin/projects` - Alternative project management interface

## URL Parameters

### Edit Mode
- `/admin/opportunities/new?edit={id}` - Opens editor with existing data
- Passes opportunity ID for editing

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer {token}` header
