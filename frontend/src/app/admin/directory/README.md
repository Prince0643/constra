# Global Directory Page

## Overview

The Global Directory page provides an overview of all registered business sectors and organizations in the Constra platform. Administrators can view sector statistics, search/filter organizations, and view detailed company profiles.

## File Location

`frontend/src/app/admin/directory/page.tsx`

## Key Features

### Header Section

- **Title**: "Global Directory"
- **Description**: "Overview of all registered sectors and organizations"
- **Total Badge**: Displays total organization count across all sectors

### Summary Statistics Cards (4 Cards)

| Card | Background | Icon | Description |
|------|------------|------|-------------|
| Active Organizations | green-50 | CheckCircle | Sum of all active orgs |
| Blacklisted | red-50 | XCircle | Sum of blacklisted orgs |
| Pending Approval | orange-50 | Users | Sum of pending orgs |
| Total Sectors | blue-50 | BarChart3 | Count of sector categories |

### Sector Summary Table

**Columns**:
1. Sector Name
2. Total Organizations (badge)
3. Active (green badge)
4. Blacklisted (red badge)
5. Pending (orange badge)

**Hardcoded Sectors** (8 total):
- Construction
- Infrastructure
- Consulting Services
- IT & Technology
- Health & Medical
- Education
- Agriculture
- Transportation

### Organizations List

#### Filter Bar
- **Search Input**: Filter by name or TIN
- **Sector Dropdown**: Filter by business sector
- **Status Dropdown**: Filter by (Active, Blacklisted, Pending)

#### Organizations Table

**Columns**:
1. Organization (name + registration date)
2. Sector
3. TIN (monospace font)
4. Location (with MapPin icon)
5. Status Badge
6. Projects Won (blue badge)
7. Actions

**Status Badges**:
| Status | Style |
|--------|-------|
| Active | bg-green-100 text-green-700 |
| Blacklisted | bg-red-100 text-red-700 |
| Pending | bg-orange-100 text-orange-700 |

**Actions**:
- **View Profile** button - Opens organization detail modal

#### Pagination

- Shows range: "Showing X to Y of Z organizations"
- Previous/Next buttons with chevron icons
- Page number buttons with active state highlighting

## Data Interfaces

```typescript
interface Sector {
  id: string
  name: string
  organizations: number
  active: number
  blacklisted: number
  pending: number
}

interface Organization {
  id: string
  name: string
  sector: string
  tin: string
  location: string
  status: "Active" | "Blacklisted" | "Pending"
  registrationDate: string
  projectsWon: number
}
```

## Organization Profile Dialog

### Header
- Organization name with Building2 icon
- Status badge
- "Organization Profile" subtitle

### Quick Stats (3 Cards)

| Card | Color | Value | Label |
|------|-------|-------|-------|
| Projects Won | blue-50 | {projectsWon} | Projects Won |
| Sector | purple-50 | {sector} | Sector |
| Member Since | green-50 | {year} | Member Since |

### Organization Information
- Company Name
- Tax Identification Number (TIN)
- Business Sector
- Registration Date

### Location Section
- Address display with MapPin icon

### Contact Information (Mock Data)
- Phone: +63 (2) 8123-4567
- Email: contact@{companyName}.com

### Documents & Certifications

| Document | Status |
|----------|--------|
| DTI Business Registration | Verified |
| BIR Certificate of Registration | Verified |
| Mayor's Business Permit | Verified |
| PCAB License | Verified/Pending based on status |

### Dialog Actions
- Close (outline button)
- View Full Details (primary button with ExternalLink icon)

## State Management

```typescript
const [searchQuery, setSearchQuery] = useState("")
const [sectorFilter, setSectorFilter] = useState("all")
const [statusFilter, setStatusFilter] = useState("all")
const [currentPage, setCurrentPage] = useState(1)
const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
const [isProfileOpen, setIsProfileOpen] = useState(false)
const itemsPerPage = 10
```

## Filtering Logic

```typescript
const filteredOrgs = organizations.filter((org) => {
  const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       org.tin.includes(searchQuery)
  const matchesSector = sectorFilter === "all" || org.sector === sectorFilter
  const matchesStatus = statusFilter === "all" || org.status.toLowerCase() === statusFilter
  return matchesSearch && matchesSector && matchesStatus
})
```

## Pagination Logic

```typescript
const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage)
const paginatedOrgs = filteredOrgs.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
)
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- `Input`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Separator`

### Icons (Lucide React)
- Search, Filter, Building2, Users, MapPin, CheckCircle, XCircle
- BarChart3, Download, ChevronRight, ChevronLeft, Phone, Mail
- FileText, Award, Calendar, Briefcase, ExternalLink, Shield

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Title & Description]                  [X,XXX Total Badge]│
├─────────────────────────────────────────────────────────────┤
│  SUMMARY CARDS (4 cards)                                   │
│  [Active] [Blacklisted] [Pending] [Sectors]                │
├─────────────────────────────────────────────────────────────┤
│  SECTOR SUMMARY TABLE                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Sector | Total | Active | Blacklisted | Pending     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Construction | [567] | [523] | [12] | [32]          │   │
│  │ Infrastructure | [234] | ...                        │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ORGANIZATIONS LIST                                        │
│  Header: [Registered Organizations] [Export List]          │
│  Filters: [Search...] [Sector ▼] [Status ▼]               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Org | Sector | TIN | Location | Status | Won | Actions│   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ JAJR CONSTRUCTION | Const | 123... | QC | [Pending]  │   │
│  │ Since 2026-03-01                          [0] [View]│   │
│  └──────────────────────────────────────────────────────┘   │
│  Pagination: Showing 1-10 of 50 | [<] [1] [2] [3] [>]       │
└─────────────────────────────────────────────────────────────┘

ORGANIZATION PROFILE MODAL:
┌─────────────────────────────────────────────────────────────┐
│  [🏢 Organization Name]                        [Status]     │
│  Organization Profile                                        │
├─────────────────────────────────────────────────────────────┤
│  QUICK STATS:                                              │
│  [🏆 Projects Won] [💼 Sector] [📅 Member Since]            │
├─────────────────────────────────────────────────────────────┤
│  ORGANIZATION INFORMATION (2 columns)                      │
│  Company: XXX | TIN: XXX | Sector: XXX | Date: XXX         │
├─────────────────────────────────────────────────────────────┤
│  LOCATION                                                  │
│  📍 {Location}                                             │
├─────────────────────────────────────────────────────────────┤
│  CONTACT INFORMATION (2 columns)                           │
│  📞 Phone | ✉️ Email                                       │
├─────────────────────────────────────────────────────────────┤
│  DOCUMENTS & CERTIFICATIONS                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ DTI Business Registration                    [Verified] │
│  │ BIR Certificate                                [Verified] │
│  │ Mayor's Permit                                 [Verified] │
│  │ PCAB License                                   [Status]   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  [Close] [View Full Details ↗]                              │
└─────────────────────────────────────────────────────────────┘
```

## Mock Data

The page includes mock data for demonstration:
- 8 predefined sectors with realistic counts
- 5 sample organizations (JAJR CONSTRUCTION, ABC Builders, etc.)
- Mock contact information and documents

## Related Pages

- `/admin/merchants` - New merchant application approvals
- `/admin/users` - Individual user verification
- `/admin/verification` - Document verification process
