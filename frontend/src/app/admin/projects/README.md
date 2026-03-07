# Projects Management Page

## Overview

The Projects Management page provides a comprehensive interface for creating, editing, importing, and managing all procurement projects in the Constra platform. It supports CSV import/export, document uploads, and detailed project tracking.

## File Location

`frontend/src/app/admin/projects/page.tsx`

## Key Features

### Header Section

- **Title**: "Projects"
- **Description**: "Manage and track all procurement projects"
- **Primary Button**: "Create Project" (opens create dialog)

### Statistics Cards

The page includes dynamic statistics based on project data:

| Metric | Description |
|--------|-------------|
| Total Projects | Count of all projects |
| Active Projects | Projects with "Open" status |
| Projects Closing Soon | Projects with deadlines within 7 days |
| Total Budget | Sum of all ABC values |

### Project Actions Bar

**Buttons**:
- Import CSV (with Import icon)
- Export CSV (with Download icon)

### Search & Filter

- **Search Input**: Filter by title, reference number, procuring entity, or category
- **Status Filter**: All, Open, Closed, Draft
- **Category Filter**: All categories dropdown

### Projects Table

**Columns**:
1. Reference Number
2. Project Title (with agency subtitle)
3. Category
4. ABC (formatted currency)
5. Deadline
6. Status Badge
7. Bids Count
8. Actions

**Status Badges**:
| Status | Style |
|--------|-------|
| Open | bg-green-100 text-green-700 |
| Closed | bg-gray-100 text-gray-700 |
| Draft | bg-orange-100 text-orange-700 |
| Awarded | bg-blue-100 text-blue-700 |

**Action Buttons**:
- View (Eye icon)
- Edit (Edit icon)
- Upload (Upload icon)
- Delete (Trash2 icon)

## Create/Edit Project Dialog

### Tabbed Interface (4 Tabs)

| Tab | Description |
|-----|-------------|
| Identification | Project numbers, title, entity |
| Financial | Budget, mode, classification |
| Timeline | Dates, delivery schedule |
| Personnel | Contact person details |

### Form Fields by Tab

#### Identification Tab
- Reference Number (auto-generates if empty)
- Solicitation Number
- Project Title (required)
- Procuring Entity (required)
- Location

#### Financial Tab
- Approved Budget (ABC) - required
- Trade Agreement (dropdown)
- Procurement Mode - required (dropdown)
- Classification - required (dropdown)
- Category - required (dropdown)
- Business Category (dropdown)

#### Timeline Tab
- Bid Deadline - required
- Closing Time
- Date Published - required
- Pre-Bid Conference Date/Time
- Site Inspection Date/Time
- Area of Delivery - required
- Delivery Period - required

#### Personnel Tab
- Contact Name - required
- Contact Position - required
- Contact Address - required
- Contact Phone - required
- Contact Email - required (validated)
- Description

### Validation Rules

**Required Fields**:
- title, procuringEntity, abc, procurementMode, classification, category
- deadline, datePublished, areaOfDelivery, deliveryPeriod
- contactName, contactPosition, contactAddress, contactPhone, contactEmail

**Email Validation**:
```typescript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

### Requirement Templates

Pre-defined requirements that can be included:
- Financial Proposal
- Technical Specifications
- Company Profile
- Certificate of PhilGEPS Registration

## Data Interface

```typescript
interface ProjectFormData {
  referenceNumber: string
  solicitationNumber: string
  title: string
  procuringEntity: string
  abc: string
  procurementMode: string
  classification: string
  category: string
  businessCategory: string
  tradeAgreement: string
  areaOfDelivery: string
  deliveryPeriod: string
  deadline: string
  closingTime: string
  datePublished: string
  preBidDate: string
  preBidTime: string
  siteInspectionDate: string
  siteInspectionTime: string
  contactName: string
  contactPosition: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  description: string
  location: string
  status: "Open" | "Closed" | "Draft"
  requirements: string[]
}
```

## Predefined Options

### Procurement Modes
- Competitive Bidding - Public (default)
- Competitive Bidding - Limited
- Direct Contracting, Repeat Order, Shopping
- Negotiated Procurement, Emergency Purchase
- Lease, Framework Agreement

### Classifications
- Goods (default), Infrastructure, Consulting Services, Services

### Categories (17 total)
Includes: Civil Works, Infrastructure, Construction Materials, Electrical Works, Mechanical Works, IT Equipment/Services, Consulting Services, Office Supplies/Equipment, Educational Materials/Supplies, Medical Supplies, Vehicles, Machinery, Printing Services, Catering Services

### Business Categories
- Construction Materials, Educational Supplies, Catering Services
- Office Supplies, Medical Equipment, IT Services
- Consulting Services, Transportation Services
- Maintenance Services, Printing Services, Others

### Trade Agreements
- Implementing Rules and Regulations (default)
- General Procurement, GPPB Resolution No. 04-2021
- No Trade Agreement

## CSV Import/Export

### Export Format
CSV with headers:
```
Reference Number, Solicitation Number, Project Title, Procuring Entity, ABC,
Procurement Mode, Classification, Category, Business Category, Area of Delivery,
Delivery Period, Closing Date, Closing Time, Date Published, Contact Name,
Contact Position, Contact Phone, Contact Email, Status
```

### Import Handler
- Parses CSV line by line
- Auto-generates reference numbers if missing
- Sets default values for optional fields
- Shows success/error count on completion

## Document Management

### Upload Dialog
- Multi-file selection
- Uploads to `/api/projects/:id/documents`
- Shows upload progress

### View Documents Dialog
- Lists all project documents
- Shows document names and status badges

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | Fetch all projects |
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | PUT | Update project |
| `/api/projects/:id` | DELETE | Delete project |
| `/api/projects/:id/documents` | POST | Upload documents |
| `/api/projects/:id/documents` | GET | Fetch documents |

## State Management

```typescript
const [projects, setProjects] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
const [isViewDocsDialogOpen, setIsViewDocsDialogOpen] = useState(false)
const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
const [selectedProject, setSelectedProject] = useState<any>(null)
const [searchQuery, setSearchQuery] = useState("")
const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
const [formErrors, setFormErrors] = useState<Record<string, string>>({})
const [activeTab, setActiveTab] = useState("identification")
```

## Utility Functions

### Reference Number Generator
```typescript
const generateReferenceNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `REF-${year}-${random}`
}
```

### Form Validation
```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  // Validates all required fields
  // Sets appropriate error messages
  setFormErrors(errors)
  return Object.keys(errors).length === 0
}
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Title & Description]                        [+ Create Proj]│
├─────────────────────────────────────────────────────────────┤
│  STATS CARDS (4 cards)                                     │
│  [Total] [Active] [Closing Soon] [Total Budget]            │
├─────────────────────────────────────────────────────────────┤
│  ACTIONS BAR                                               │
│  [Import CSV] [Export CSV]                                  │
├─────────────────────────────────────────────────────────────┤
│  SEARCH & FILTERS                                          │
│  [Search...] [Status ▼] [Category ▼]                       │
├─────────────────────────────────────────────────────────────┤
│  PROJECTS TABLE                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Ref | Title | Category | ABC | Deadline | Status | Bids│  │
│  ├──────────────────────────────────────────────────────┤   │
│  │ REF-2026-1234 | School Supplies... | Office | ₱1M | ...│   │
│  │                                       [View][Edit][Up][Del]│
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

DIALOGS:

CREATE/EDIT PROJECT:
┌─────────────────────────────────────────────────────────────┐
│  Create Project / Edit Project                                │
├─────────────────────────────────────────────────────────────┤
│  [Identification] [Financial] [Timeline] [Personnel]        │
├─────────────────────────────────────────────────────────────┤
│  TAB CONTENT (fields based on selected tab)                │
├─────────────────────────────────────────────────────────────┤
│  [Cancel]                                    [Create/Save] │
└─────────────────────────────────────────────────────────────┘

VIEW PROJECT:
- Displays all project details in read-only format
- Sections: Identification, Financial, Timeline, Personnel

DELETE CONFIRMATION:
- "Are you sure you want to delete {project.title}?"
- [Cancel] [Delete]

UPLOAD DOCUMENTS:
- File input (multiple)
- Shows selected files
- [Upload] button with progress

IMPORT CSV:
- File picker for CSV
- Shows import progress
- Results: "X projects imported, Y errors"
```

## UI Components

### shadcn/ui
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Input`, `Textarea`
- `Label`
- `Badge`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`

### Icons (Lucide React)
- Plus, Search, FileText, Eye, Edit, Trash2, Loader2, XCircle
- Upload, FolderOpen, Download, Import, FileSpreadsheet

## Related Pages

- `/admin/opportunities` - Alternative project listing
- `/admin/opportunities/new` - Full bid notice editor
- `/admin/bids` - View bids for projects
- `/admin/dashboard` - Overview with project counts

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer {token}` header
