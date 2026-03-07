# Admin Dashboard Page

## Overview

The Admin Dashboard provides a high-level overview of the Constra platform's key metrics, recent activities, and pending actions requiring administrator attention.

## File Location

`frontend/src/app/admin/dashboard/page.tsx`

## Key Features

### Statistics Cards (4-Column Grid)

| Metric | Icon | Description |
|--------|------|-------------|
| Total Projects | FolderOpen | Count of all projects in the system |
| Active Bidders | Users | Number of registered contractors (role: "User") |
| Pending Verifications | Gavel | Users awaiting document approval |
| Projects Awarded | TrendingUp | Projects with "Closed" status |

### Recent Projects Section

**Location**: Left side of main content grid

**Features**:
- Displays last 4 most recent projects
- Shows project title, budget (ABC), deadline, and bid count
- Status badges: Open (default), Evaluation (secondary), Closed (outline)
- "New Project" button linking to `/admin/projects`

**Project Card Display**:
```
Project Title
Budget: ₱XXX,XXX
Deadline: YYYY-MM-DD • X bids
[Status Badge]
```

### Pending Verifications Section

**Location**: Right side of main content grid

**Features**:
- Shows up to 3 contractors awaiting document approval
- Company name and email display
- "Review" button linking to `/admin/users`
- Link to view all pending verifications

## Data Fetching

### API Endpoints

| Endpoint | Method | Data Retrieved |
|----------|--------|----------------|
| `/api/projects` | GET | All projects for stats and recent list |
| `/api/users` | GET | All users for bidder count and pending verifications |

### Data Transformations

```typescript
// Stats calculation
const totalProjects = projects.length
const projectsAwarded = projects.filter(p => p.status === "Closed").length
const activeBidders = users.filter(u => u.role === "User").length
const pendingVerifications = users.filter(u => u.verificationStatus === "Pending")

// Recent projects (last 4)
const recent = [...projects].reverse().slice(0, 4)
```

## UI Components

### shadcn/ui Components
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`

### Icons (Lucide React)
- FolderOpen, Users, Gavel, TrendingUp, Plus
- Loader2 (loading spinner)

## State Management

```typescript
const [stats, setStats] = useState({
  totalProjects: 0,
  activeBidders: 0,
  pendingBids: 0,
  projectsAwarded: 0
})
const [recentProjects, setRecentProjects] = useState<any[]>([])
const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
```

## Utility Functions

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return "₱" + amount?.toLocaleString()
}
```

### Date Handling
- Deadline dates are formatted by splitting ISO string at 'T'
- Example: `deadline?.split('T')[0]`

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  STATS GRID (4 columns on large screens)                   │
│  [Total Projects] [Active Bidders] [Pending] [Awarded]     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────┐
│  RECENT PROJECTS             │  PENDING VERIFICATIONS        │
│  ┌────────────────────────┐  │  ┌─────────────────────────┐│
│  │ Project 1              │  │  │ Contractor A            ││
│  │ Budget, Deadline, Bids│  │  │ email@example.com       ││
│  │ [Status]               │  │  │ [Pending] [Review]      ││
│  ├────────────────────────┤  │  ├─────────────────────────┤│
│  │ Project 2              │  │  │ Contractor B            ││
│  │ ...                    │  │  │ ...                     ││
│  │ [+ New Project Button] │  │  │ View all →              ││
│  └────────────────────────┘  │  └─────────────────────────┘│
└──────────────────────────────┴─────────────────────────────┘
```

## Loading State

- Displays centered spinner with `Loader2` icon
- Animate spin with `text-blue-600` color
- Shown while fetching dashboard data

## Error Handling

- Console error logging for failed API calls
- Gracefully handles missing data with default empty arrays

## Related Pages

- `/admin/projects` - Full project management
- `/admin/users` - User verification management
- `/admin/bids` - Bid evaluation interface

## Authentication

- Requires valid JWT token from localStorage
- Token sent in Authorization header for all API requests
