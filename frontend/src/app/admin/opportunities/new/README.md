# Create/Edit Bid Notice Page

## Overview

The Bid Notice Editor provides a comprehensive form for creating and editing Invitation to Bid (ITB) notices. It features a tabbed interface with 5 sections covering all required project information for procurement postings.

## File Location

`frontend/src/app/admin/opportunities/new/page.tsx`

## Key Features

### Header Section

- **Back Button**: Returns to `/admin/opportunities`
- **Title**: "Create Bid Notice" or "Edit Bid Notice" (based on edit mode)
- **Description**: "Fill in all required details for the bid notice abstract"
- **Action Buttons**:
  - Save Draft (outline)
  - Publish Notice (primary)

### Tabbed Interface (5 Tabs)

| Tab | Icon | Description |
|-----|------|-------------|
| Basic Info | FileText | Project identification and details |
| Agency Details | Building2 | Procuring entity information |
| Procurement | DollarSign | Financial and classification |
| Schedule | Calendar | Important dates and deadlines |
| Contact Person | User | BAC/contact information |

## Form Data Structure

```typescript
interface ProjectFormData {
  // Basic Info
  title: string
  description: string
  referenceNumber: string
  solicitationNumber: string
  
  // Agency Info
  procuringEntity: string
  clientAgency: string
  areaOfDelivery: string
  
  // Procurement Details
  tradeAgreement: string
  procurementMode: string
  classification: string
  category: string
  
  // Financial
  abc: string
  deliveryPeriod: string
  
  // Schedule
  deadline: string
  closingTime: string
  preBidDate: string
  preBidTime: string
  siteInspectionDate: string
  siteInspectionTime: string
  
  // Contact Person
  contactName: string
  contactPosition: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  
  // Location
  location: string
  
  // Status
  status: "Open" | "Closed" | "Draft"
}
```

## Tab Content Details

### 1. Basic Info Tab

**Card Title**: Project Identification

**Fields**:
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Reference Number | No | text | REF-2026-001234 |
| Solicitation Number | No | text | ITB-2026-001 |
| Project Title | Yes | text | Procurement of Supplies for Moving Up... |
| Project Description | No | textarea | Detailed project scope... |
| Project Location | No | text | Quezon City, Metro Manila |

**Notes**:
- Reference Number auto-generates if left blank
- Solicitation Number is for internal agency tracking

### 2. Agency Details Tab

**Card Title**: Procuring Entity Information

**Fields**:
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Procuring Entity | Yes | text | Department of Education - Division of Quezon City |
| Client Agency | No | text | Division Office, Department of Education |
| Area of Delivery | No | text | Quezon City, Caloocan City |

### 3. Procurement Tab

**Card Title**: Procurement Details

**Dropdown Options**:

**Trade Agreements**:
- Implementing Rules and Regulations (default)
- General Procurement
- GPPB Resolution No. 04-2021
- No Trade Agreement

**Procurement Modes**:
- Competitive Bidding - Public (default)
- Competitive Bidding - Limited
- Direct Contracting
- Repeat Order
- Shopping
- Negotiated Procurement
- Emergency Purchase
- Lease
- Framework Agreement

**Classifications**:
- Goods (default)
- Infrastructure
- Consulting Services
- Services

**Categories** (16 total):
- Civil Works, Infrastructure, Construction Materials
- Electrical Works, Mechanical Works
- IT Equipment, IT Services, Consulting Services
- Office Supplies, Office Equipment
- Educational Materials, Educational Supplies
- Medical Supplies, Vehicles, Machinery
- Printing Services, Catering Services

**Financial Fields**:
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Approved Budget (ABC) | Yes | number | 500000.00 |
| Delivery Period | No | text | 45 Days, 3 Months |

### 4. Schedule Tab

**Card Title**: Important Dates

**Date/Time Fields**:
| Field | Type | Format |
|-------|------|--------|
| Bid Closing Date | date | YYYY-MM-DD |
| Closing Time | time | HH:MM |
| Pre-Bid Conference Date | date | YYYY-MM-DD |
| Pre-Bid Conference Time | time | HH:MM |
| Site Inspection Date | date | YYYY-MM-DD |
| Site Inspection Time | time | HH:MM |

**Default Times**:
- Closing Time: 12:00
- Pre-Bid Time: 10:00
- Site Inspection Time: 09:00

### 5. Contact Person Tab

**Card Title**: Contact Person Information

**Fields**:
| Field | Type | Example |
|-------|------|---------|
| Full Name | text | Engr. Maria Santos |
| Position | text | BAC Chairperson / OIC-Engineering |
| Complete Address | textarea | Street, City/Municipality, Province, ZIP |
| Phone Number | tel | +63 (2) 8123-4567 loc. 234 |
| Email Address | email | bac@deped-quezoncity.gov.ph |

## Edit Mode

### URL Parameter
```
/admin/opportunities/new?edit={projectId}
```

### Data Loading
- Fetches existing project data on mount
- Populates all form fields with current values
- Formats dates from ISO string

```typescript
const fetchProject = async (id: string) => {
  // GET /api/projects/:id
  // Formats dates: new Date(data.deadline).toISOString().split('T')[0]
}
```

## Save Handlers

### Save Draft
```typescript
const handleSave = async (publish = false) => {
  // PUT for edit, POST for create
  // Payload: { ...formData, abc: parseFloat(formData.abc) }
  // Status: publish ? "Open" : formData.status
}
```

### Publish Notice
- Same as Save Draft with `publish = true`
- Sets status to "Open"
- Redirects to opportunities list on success

## API Integration

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | PUT | Update existing project |
| `/api/projects/:id` | GET | Fetch project for editing |

## State Management

```typescript
const [isLoading, setIsLoading] = useState(false)
const [isSaving, setIsSaving] = useState(false)
const [activeTab, setActiveTab] = useState("basic")
const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
```

## Predefined Arrays

```typescript
const procurementModes = [
  "Competitive Bidding - Public",
  "Competitive Bidding - Limited",
  "Direct Contracting",
  "Repeat Order",
  "Shopping",
  "Negotiated Procurement",
  "Emergency Purchase",
  "Lease",
  "Framework Agreement"
]

const categories = [
  "Civil Works", "Infrastructure", "Construction Materials",
  "Electrical Works", "Mechanical Works", "IT Equipment",
  "IT Services", "Consulting Services", "Office Supplies",
  "Office Equipment", "Educational Materials", "Medical Supplies",
  "Vehicles", "Machinery", "Printing Services", "Catering Services"
]

const classifications = ["Goods", "Infrastructure", "Consulting Services", "Services"]

const tradeAgreements = [
  "Implementing Rules and Regulations",
  "General Procurement",
  "GPPB Resolution No. 04-2021",
  "No Trade Agreement"
]
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
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`

### Icons (Lucide React)
- ArrowLeft, Building2, DollarSign, Calendar, MapPin, User
- Phone, Mail, Clock, FileText, Save, Send, Plus, Trash2, Loader2

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [← Back]  [Create/Edit Bid Notice]         [Save] [Publish]│
│             Fill in all required details...                │
├─────────────────────────────────────────────────────────────┤
│  TABS: [Basic Info] [Agency] [Procurement] [Schedule] [Contact]│
├─────────────────────────────────────────────────────────────┤
│  TAB CONTENT (example: Basic Info):                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 📄 Project Identification                            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Reference Number        Solicitation Number          │   │
│  │ [REF-2026-...   ]       [ITB-2026-...   ]            │   │
│  │                                                      │   │
│  │ Project Title *                                      │   │
│  │ [Enter project title                          ]      │   │
│  │                                                      │   │
│  │ Project Description / Scope of Work                  │   │
│  │ [                                             ]      │   │
│  │ [                                             ]      │   │
│  │                                                      │   │
│  │ Project Location                                     │   │
│  │ [Quezon City, Metro Manila                    ]      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

OTHER TABS:

Agency Tab:
- Procuring Entity *, Client Agency, Area of Delivery

Procurement Tab:
- Trade Agreement | Procurement Mode *
- Classification * | Category *
- ABC * | Delivery Period

Schedule Tab:
- Bid Closing Date * | Closing Time
- Pre-Bid Conference Date/Time
- Site Inspection Date/Time

Contact Tab:
- Full Name | Position
- Complete Address (textarea)
- Phone Number | Email Address
```

## Loading States

### Initial Load (Edit Mode)
- Centered spinner with `Loader2` icon
- Animate spin with `text-[#002D5D]` color

### Save Operation
- Button shows spinner instead of icon
- Disables button during save

## Validation

### Required Fields
- Project Title
- Procuring Entity
- Approved Budget (ABC)
- Bid Deadline
- Procurement Mode
- Classification
- Category

### Validation Logic
- Numeric validation for ABC field
- Date format validation for deadline fields

## Export Configuration

```typescript
export const dynamic = 'force-dynamic'
```

Prevents static generation issues with `useSearchParams`.

## Related Pages

- `/admin/opportunities` - Opportunities list
- `/admin/opportunities/:id` - View opportunity details
- `/admin/projects` - Alternative project management

## Authentication

- Requires valid JWT token from localStorage
- All API requests include `Authorization: Bearer {token}` header
