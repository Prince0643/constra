# Admin Panel Documentation

## Table of Contents

1. [Admin Layout](#admin-layout)
2. [Dashboard](#dashboard)
3. [Merchant Approvals](#merchant-approvals)
4. [Bid Evaluations](#bid-evaluations)
5. [Global Directory](#global-directory)
6. [System Settings](#system-settings)
7. [Manage Opportunities](#manage-opportunities)
8. [Bid Notice Editor](#bid-notice-editor)
9. [Opportunity Detail](#opportunity-detail)
10. [Projects Management](#projects-management)
11. [User Management](#user-management)
12. [Document Verification](#document-verification)
13. [Common Components](#common-ui-components)
14. [Authentication](#authentication)

---

## Admin Layout

**File**: `frontend/src/app/admin/layout.tsx`

### Overview

The Admin Layout serves as the main navigation wrapper for all admin pages. It provides a consistent sidebar navigation, header, and authentication context for the entire admin dashboard.

### Navigation Sidebar

- **Fixed Position**: Navy blue sidebar fixed to the left side of the screen (w-64)
- **Color Theme**: Navy blue background (#002D5D) with white text

### Navigation Items

| Route | Label | Icon | Description |
|-------|-------|------|-------------|
| `/admin/dashboard` | Dashboard | LayoutDashboard | Main admin overview page |
| `/admin/merchants` | Merchant Approvals | Users | Contractor registration approvals |
| `/admin/opportunities` | Manage Opportunities | FolderPlus | ITB posting management |
| `/admin/bids` | Bid Evaluations | Gavel | Bid review and awarding |
| `/admin/directory` | Global Directory | BarChart3 | Registered organizations listing |
| `/admin/settings` | System Settings | Settings | Platform configuration |

### Status Badges

- **Pending Merchants**: Red badge showing count of pending merchant verifications
- **Pending Bids**: Blue badge showing count of bids under evaluation

### Header Section

- **Sticky Position**: Fixed at the top of the main content area
- **Components**:
  - Page title: "Admin Control Panel"
  - Search input: Reference ID search functionality
  - Notification bell component
  - Admin profile display (avatar with Shield icon)

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/merchants` | GET | Fetch pending merchant count |
| `/api/bids` | GET | Fetch pending bid count |

---

## Dashboard

**File**: `frontend/src/app/admin/dashboard/page.tsx`

### Overview

The Admin Dashboard provides a high-level overview of the Constra platform's key metrics, recent activities, and pending actions.

### Statistics Cards

| Metric | Icon | Description |
|--------|------|-------------|
| Total Projects | FolderOpen | Count of all projects in the system |
| Active Bidders | Users | Number of registered contractors (role: "User") |
| Pending Verifications | Gavel | Users awaiting document approval |
| Projects Awarded | TrendingUp | Projects with "Closed" status |

### Recent Projects Section

- Displays last 4 most recent projects
- Shows project title, budget (ABC), deadline, and bid count
- Status badges: Open (default), Evaluation (secondary), Closed (outline)
- "New Project" button linking to `/admin/projects`

### Pending Verifications Section

- Shows up to 3 contractors awaiting document approval
- Company name and email display
- "Review" button linking to `/admin/users`

### API Endpoints

| Endpoint | Method | Data Retrieved |
|----------|--------|----------------|
| `/api/projects` | GET | All projects for stats and recent list |
| `/api/users` | GET | All users for bidder count and pending verifications |

---

## Merchant Approvals

**File**: `frontend/src/app/admin/merchants/page.tsx`

### Overview

Review, audit, and approve or reject contractor (merchant) registration applications with document verification.

### Statistics Overview

| Stat | Color | Description |
|------|-------|-------------|
| Total Applications | #002D5D | All merchant registrations |
| Pending Review | orange-600 | Awaiting admin action |
| Approved | green-600 | Successfully verified merchants |
| Rejected | red-600 | Denied applications |

### Merchant Applications Table

**Columns**: Company Name, TIN, Registration Date, Status Badge, Actions

**Status Badges**:
- `Approved` - bg-green-100 text-green-700
- `Rejected` - bg-red-100 text-red-700
- `Pending` - bg-orange-100 text-orange-700

**Action Buttons**:
- **Audit** - Opens document review modal
- **Approve** (Pending only)
- **Reject** (Pending only)

### Document Audit Modal

**Company Information**:
- DTI Registration Number
- TIN Number
- Business Address
- Registration Date
- Contact Person
- Phone Number

**Submitted Documents**:
- DTI Certificate (blue icon)
- Mayor's Permit (green icon)
- BIR Registration (orange icon)

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/merchants` | GET | Fetch all merchant applications |
| `/api/merchants/:id/verify` | PUT | Approve or reject merchant |

---

## Bid Evaluations

**File**: `frontend/src/app/admin/bids/page.tsx`

### Overview

View, manage, and evaluate all submitted bids across projects. Admins can award bids to winning contractors or reject bids.

### Features

- **Project Filter**: Dropdown to filter bids by specific project
- **Refresh Button**: Updates bid data with loading animation

### Bids Table

**Columns**: Project, Bidder, Bid Amount, Submitted, Status, Actions

**Status Badges**:
| Status | Badge Style |
|--------|-------------|
| Won | bg-green-100 text-green-700 (Awarded) |
| Lost | outline, text-gray-500 (Not Awarded) |
| Submitted | bg-blue-100 text-blue-700 |
| Under Evaluation | bg-yellow-100 text-yellow-700 |

**Statistics Summary**:
- Total Bids
- Pending (Submitted + Under Evaluation)
- Awarded (Won status)
- Lowest Bid

### Dialogs

**Award Dialog**:
- Confirmation with company name, project details, bid amount
- Warning: "This action cannot be undone"

**Reject Dialog**:
- Confirmation with company name
- Notification: "The bidder will be notified"

**View Bid Dialog**:
- Project, Bidder, Amount, Submitted date, Status, Compliance
- Optional Bidder Notes section

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bids` | GET | Fetch all bids |
| `/api/projects` | GET | Fetch projects for filter dropdown |
| `/api/bids/:id/award` | PUT | Award bid to contractor |
| `/api/bids/:id/reject` | PUT | Reject bid |

---

## Global Directory

**File**: `frontend/src/app/admin/directory/page.tsx`

### Overview

Overview of all registered business sectors and organizations with filtering and profile viewing.

### Summary Statistics Cards

| Card | Background | Icon | Description |
|------|------------|------|-------------|
| Active Organizations | green-50 | CheckCircle | Sum of all active orgs |
| Blacklisted | red-50 | XCircle | Sum of blacklisted orgs |
| Pending Approval | orange-50 | Users | Sum of pending orgs |
| Total Sectors | blue-50 | BarChart3 | Count of sector categories |

### Sector Summary Table

**Sectors** (8 total):
- Construction, Infrastructure, Consulting Services, IT & Technology
- Health & Medical, Education, Agriculture, Transportation

### Organizations List

**Filters**:
- Search by name or TIN
- Filter by sector
- Filter by status (Active, Blacklisted, Pending)

**Pagination**: Shows range with Previous/Next buttons and page numbers

### Organization Profile Dialog

**Quick Stats**: Projects Won, Sector, Member Since

**Sections**:
- Organization Information (Company Name, TIN, Sector, Registration Date)
- Location
- Contact Information (Phone, Email)
- Documents & Certifications (DTI, BIR, Mayor's Permit, PCAB License)

---

## System Settings

**File**: `frontend/src/app/admin/settings/page.tsx`

### Overview

Configure platform settings, manage notification preferences, set security policies, and monitor system health.

### Settings Categories

**1. General Settings**:
- Platform Name (default: "Constra")
- Support Email (default: "support@constra.com")
- Default Timezone (Asia/Manila GMT+8, disabled)

**2. Notifications**:
- New Bid Notifications (default: ON)
- Verification Requests (default: ON)
- Project Deadlines (default: ON)

**3. Security**:
- Two-Factor Authentication (default: OFF)
- Document Verification (default: ON)
- Session Timeout in minutes (default: 30)

**4. System Status**:
- Database (Connected)
- File Storage (Operational)
- Email Service (Active)
- Last Backup (2 hours ago)

---

## Manage Opportunities

**File**: `frontend/src/app/admin/opportunities/page.tsx`

### Overview

Central hub for creating, publishing, and managing Invitation to Bid (ITB) postings.

### Statistics Overview

| Metric | Color | Description |
|--------|-------|-------------|
| Active ITBs | #002D5D | Projects with "Open" status |
| Drafts | orange-600 | Unpublished projects |
| Total Bids Received | blue-600 | Sum of all bids across projects |
| Total Value | green-600 | Sum of all ABC values |

### Opportunities Table

**Columns**: ITB Number, Project Title, ABC, Deadline, Bids, Status, Actions

**Status Badge Logic**:
- Open → "Published" (green)
- Draft → "Draft" (orange)
- Awarded → "Awarded" (blue)
- Other → Original status (gray)

**Actions**:
- View → `/admin/opportunities/{id}`
- Edit → `/admin/opportunities/new?edit={id}`
- Publish (Draft only)

### Create ITB Modal (3-Step Wizard)

**Step 1: Project Info**
- Project Title, Description, Procuring Agency, Location

**Step 2: Budget & Category**
- ABC, Bid Deadline, Sector/Category
- ABC Guidelines information box

**Step 3: Eligibility**
- Eligibility Requirements, Required Documents Checklist

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | Fetch all projects/opportunities |
| `/api/projects/:id/status` | PATCH | Update project status |

---

## Bid Notice Editor

**File**: `frontend/src/app/admin/opportunities/new/page.tsx`

### Overview

Comprehensive form for creating and editing Invitation to Bid (ITB) notices with 5-tab interface.

### Tabbed Interface

| Tab | Icon | Description |
|-----|------|-------------|
| Basic Info | FileText | Project identification and details |
| Agency Details | Building2 | Procuring entity information |
| Procurement | DollarSign | Financial and classification |
| Schedule | Calendar | Important dates and deadlines |
| Contact Person | User | BAC/contact information |

### Form Data Structure

**Basic Info**:
- title, description, referenceNumber, solicitationNumber

**Agency Info**:
- procuringEntity, clientAgency, areaOfDelivery

**Procurement Details**:
- tradeAgreement, procurementMode, classification, category

**Financial**:
- abc, deliveryPeriod

**Schedule**:
- deadline, closingTime, preBidDate, preBidTime, siteInspectionDate, siteInspectionTime

**Contact Person**:
- contactName, contactPosition, contactAddress, contactPhone, contactEmail

### Predefined Options

**Procurement Modes** (9 total):
- Competitive Bidding - Public/Limited
- Direct Contracting, Repeat Order, Shopping
- Negotiated Procurement, Emergency Purchase, Lease, Framework Agreement

**Categories** (16 total):
- Civil Works, Infrastructure, Construction Materials
- Electrical Works, Mechanical Works
- IT Equipment, IT Services, Consulting Services
- Office Supplies, Office Equipment
- Educational Materials, Medical Supplies
- Vehicles, Machinery, Printing Services, Catering Services

**Classifications**: Goods, Infrastructure, Consulting Services, Services

### Edit Mode

- URL: `/admin/opportunities/new?edit={projectId}`
- Fetches existing project data on mount
- Populates all form fields with current values

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | PUT | Update existing project |
| `/api/projects/:id` | GET | Fetch project for editing |

---

## Opportunity Detail

**File**: `frontend/src/app/admin/opportunities/[id]/page.tsx`

### Overview

Comprehensive information about a specific Invitation to Bid (ITB) posting including project overview, requirements, bids received, and agency information.

### Header Section

- Back Button → `/admin/opportunities`
- Title: Project title (#002D5D color)
- Subtitle: ITB #{id} • {procuringEntity}
- Actions: Print, Edit

### Status Banner

**Conditional Styling**:
| Status | Background | Border |
|--------|------------|--------|
| Open | green-50 | green-200 |
| Draft | orange-50 | orange-200 |
| Closed/Awarded | gray-50 | gray-200 |

### Main Content Grid

**Left Column (2/3)**:
1. Project Overview Card (ABC, Deadline, Location, Category, Description)
2. Bid Requirements Card (list with checkmarks)
3. Bids Received Card (table with Bidder, Amount, Status)

**Right Column (1/3)**:
1. Agency Information Card (Procuring Entity, Client Agency, Reference Number, Procurement Mode)
2. Documents Card (Download ITB, View Terms of Reference)

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects/:id` | GET | Fetch project details |

---

## Projects Management

**File**: `frontend/src/app/admin/projects/page.tsx`

### Overview

Comprehensive interface for creating, editing, importing, and managing all procurement projects with CSV import/export and document uploads.

### Statistics Cards

- Total Projects
- Active Projects ("Open" status)
- Projects Closing Soon (deadlines within 7 days)
- Total Budget (sum of all ABC values)

### Project Actions

- Import CSV
- Export CSV

### Search & Filter

- Search by title, reference number, procuring entity, category
- Filter by status (All, Open, Closed, Draft)
- Filter by category

### Projects Table

**Columns**: Reference Number, Project Title, Category, ABC, Deadline, Status, Bids, Actions

**Status Badges**:
| Status | Style |
|--------|-------|
| Open | bg-green-100 text-green-700 |
| Closed | bg-gray-100 text-gray-700 |
| Draft | bg-orange-100 text-orange-700 |
| Awarded | bg-blue-100 text-blue-700 |

### Create/Edit Project Dialog (4 Tabs)

**Identification Tab**:
- Reference Number (auto-generates), Solicitation Number
- Project Title (required), Procuring Entity (required), Location

**Financial Tab**:
- ABC (required), Trade Agreement
- Procurement Mode (required), Classification (required)
- Category (required), Business Category

**Timeline Tab**:
- Bid Deadline (required), Closing Time
- Date Published (required), Pre-Bid Date/Time
- Site Inspection Date/Time
- Area of Delivery (required), Delivery Period (required)

**Personnel Tab**:
- Contact Name (required), Contact Position (required)
- Contact Address (required), Contact Phone (required)
- Contact Email (required), Description

### Requirement Templates

Pre-defined requirements:
- Financial Proposal
- Technical Specifications
- Company Profile
- Certificate of PhilGEPS Registration

### CSV Import/Export

**Export**: CSV with all project fields
**Import**: Parses line by line, auto-generates reference numbers if missing, shows success/error count

### Document Management

- Upload Dialog: Multi-file selection to `/api/projects/:id/documents`
- View Documents Dialog: Lists all project documents with status badges

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET, POST | List/Create projects |
| `/api/projects/:id` | PUT, DELETE | Update/Delete project |
| `/api/projects/:id/documents` | GET, POST | Manage documents |

---

## User Management

**File**: `frontend/src/app/admin/users/page.tsx`

### Overview

View all contractor accounts, manage verification statuses, approve or reject pending verifications, and preview user details including uploaded documents.

### Users Table

**Columns**: Company, Email, Status, Joined, Bids, Actions

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
- Approve (Pending only) - Green CheckCircle
- Reject (Pending only) - Red XCircle
- Preview (all users) - Eye icon

### User Preview Dialog

**User Information Grid** (2 columns):
- Email, Status, Company, Role, Joined, Total Bids

**Uploaded Documents Section**:
- Document name, filename, file size
- Status badge (verified/pending)

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Fetch all users |
| `/api/users/:id/verify` | PUT | Update verification status |
| `/api/users/:id/documents` | GET | Fetch user documents |

---

## Document Verification

**File**: `frontend/src/app/admin/verification/page.tsx`

### Overview

Dedicated interface for reviewing and verifying user-submitted documents with filtering, statistics, and individual document approval/rejection.

### Pending Alert Banner

- AlertTriangle icon (yellow)
- Shows when `pendingCount > 0`
- Message: "{X} user(s) are waiting for document verification."

### Statistics Cards

| Card | Value | Color |
|------|-------|-------|
| Total Users | users.length | default |
| Pending | pending count | yellow-600 |
| Verified | verified count | green-600 |
| Rejected | rejected count | red-600 |

### Filter Section

Filter by verification status: All Users, Pending, Verified, Rejected

### Users Table

**Columns**: Company, Email, Documents (file icon + bid count), Status, Actions

**Actions**:
- Verify (Pending only) - Green button with Check icon
- Reject (Pending only) - Red outline with XCircle
- Preview - Ghost button with Eye icon

### User Preview Dialog

**User Information**:
- Email, Status, Company, Business Type, DTI Registration, TIN Number

**Uploaded Documents**:
- Individual document cards with Approve/Reject buttons
- Document verification: `PUT /api/documents/:id/verify`

### Dialogs

**Verify User Dialog**:
- Confirmation with company name and email
- Impact note: "This will allow the user to bid on projects."

**Reject User Dialog**:
- Confirmation with company name and email
- Impact note: "User will not be able to bid until resubmitting valid documents."

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Fetch all users (role: "User" only) |
| `/api/users/:id/verify` | PUT | Verify/reject user |
| `/api/users/:id/documents` | GET | Fetch user documents |
| `/api/documents/:id/verify` | PUT | Verify individual document |

---

## Common UI Components

### shadcn/ui Components Used Across Admin

- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button` (variants: default, outline, ghost, destructive)
- `Input`, `Textarea`, `Label`
- `Badge`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Alert`, `AlertDescription`, `AlertTitle`
- `Separator`, `Switch`

### Icons (Lucide React)

Common icons used:
- Building2, LayoutDashboard, Users, FolderPlus, Gavel, BarChart3, Settings
- Search, Bell, Shield, LogOut, CheckCircle, XCircle, Eye
- Plus, Edit, Trash2, Download, Upload, FileText
- Calendar, DollarSign, MapPin, Clock, AlertTriangle

---

## Authentication

All admin pages require authentication:

```typescript
const token = localStorage.getItem("token")
// All API requests include:
headers: { Authorization: `Bearer ${token}` }
```

On sign out (from layout):
```typescript
localStorage.removeItem("token")
localStorage.removeItem("user")
router.push("/login")
```

---

## Color Scheme

**Primary Colors**:
- Navy Blue: #002D5D (sidebar, primary buttons)
- White: #FFFFFF (text on navy, card backgrounds)

**Status Colors**:
- Green: bg-green-100, text-green-700 (success, approved, active)
- Red: bg-red-100, text-red-700 (rejected, errors)
- Orange/Yellow: bg-orange-100, text-orange-700 (pending, warnings)
- Blue: bg-blue-100, text-blue-700 (submitted, info)
- Gray: bg-gray-100, text-gray-700 (closed, neutral)

**UI Colors**:
- Gray-50: Card headers, alternating table rows
- Gray-200: Borders, separators
- Gray-400: Secondary text, icons
- Gray-600: Descriptions, labels
- Gray-900: Primary text, headings
