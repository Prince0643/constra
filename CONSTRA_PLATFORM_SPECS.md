# Constra - Bidding & Sub-contracting Platform

## 1. Database & System Architecture

**Purpose:** Define data structures for the platform.

### Database Schema

```sql
-- Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'User') DEFAULT 'User',
    verification_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    company_name VARCHAR(255),
    documents_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE Projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(15, 2) NOT NULL,
    location VARCHAR(255),
    deadline DATE NOT NULL,
    status ENUM('Open', 'Evaluation', 'Closed') DEFAULT 'Open',
    requirements JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

-- Bids Table
CREATE TABLE Bids (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    bid_amount DECIMAL(15, 2) NOT NULL,
    compliance_status ENUM('Pending', 'Compliant', 'Non-Compliant') DEFAULT 'Pending',
    bid_status ENUM('Submitted', 'Under Evaluation', 'Won', 'Lost') DEFAULT 'Submitted',
    documents_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

### Business Logic

- **Bid Restriction:** Users can only submit bids if `verification_status = 'Verified'`
- **Award Control:** Only Admins can update a Bid's status to 'Won' or 'Lost'
- **Auto-Close:** When a bid is marked 'Won', the project status changes to 'Closed' and all other bids become 'Lost'

---

## 2. Admin: Project & Template Management

**Purpose:** Create projects and define bidding requirements.

### Admin Dashboard - Project Creation Form

**Fields:**
- **Project Title** (text input)
- **Approved Budget for Contract (ABC)** (currency input)
- **Location** (text input / dropdown)
- **Deadline** (date picker)
- **Project Description** (rich text editor)

### Requirements Checklist Builder

**Dynamic Field Builder:**
- Add/remove required document types
- Document type fields:
  - Document Name (e.g., "Financial Proposal")
  - Description (e.g., "Must include cost breakdown")
  - File format restrictions (PDF, DOCX, etc.)
  - Required/Optional toggle
  - File size limit

**Example Requirements:**
1. Financial Proposal (PDF, required, max 10MB)
2. Technical Specifications (PDF, required, max 20MB)
3. Company Profile (PDF, optional, max 5MB)

---

## 3. User: Onboarding & Document Upload

**Purpose:** KYC/Verification process for contractors.

### Contractor Onboarding Page

**Document Upload Requirements:**

| Document | Format | Status |
|----------|--------|--------|
| DTI Registration | PDF/Image | Required |
| Business Permit | PDF/Image | Required |
| Mayor's Permit | PDF/Image | Required |
| BIR Registration | PDF/Image | Optional |

### UI States

**Verification Pending Overlay:**
- Semi-transparent overlay blocking main content
- Message: "Your account is pending verification. Please wait for admin approval."
- Estimated time: "Typically takes 1-2 business days"
- Contact support link

**Bidding Tab:**
- **Disabled State:** When `verification_status != 'Verified'`
- **Tooltip:** "Complete verification to access bidding features"
- **Enabled State:** Full access to project listings

### Upload Progress

- Drag-and-drop file upload
- Progress indicators per document
- File validation (type, size)
- Preview capability for images

---

## 4. Admin: Bidding Analytics Dashboard (Core Feature)

**Purpose:** Bid comparison and award management.

### Bid Comparison Analytics Component

**Data Table Columns:**
- Bidder Name
- Company Name
- Bid Amount
- Compliance Status
- Documents Submitted
- Submission Date
- Actions

### Analytics Logic

**1. Lowest Responsive Bid Highlight:**
- Automatically identify the lowest bid where `compliance_status = 'Compliant'`
- Visual highlight: Green row background or badge
- Show savings vs budget: `ABC - Bid Amount`

**2. Price Variance Calculation:**
```
Variance = Bid Amount - ABC (Admin Budget)
Variance % = ((Bid Amount - ABC) / ABC) * 100
```

**3. Compliance Indicator:**
- Green check: All required documents submitted
- Yellow warning: Some documents missing
- Red X: Critical requirements missing

### Quick Actions

**Per Row Buttons:**
- **Award Project** (Primary button, green)
  - On click: Confirmation modal
  - Action: Update `bid.status = 'Won'`, `project.status = 'Closed'`
  - Auto-update all other bids to 'Lost'
  - Trigger notification to winner
  
- **Reject Bid** (Secondary button, red outline)
  - On click: Reason input modal
  - Action: Update `bid.bid_status = 'Lost'`
  - Optional: Send rejection email

---

## 5. User: Project Discovery & Bid Submission

**Purpose:** Contractor dashboard for finding and bidding on projects.

### Project Feed

**Grid Layout displaying:**
- Project Title
- Budget (ABC)
- Location
- Deadline (countdown)
- Status badge (Open, Closing Soon, Closed)

**Filters:**
- Location
- Budget Range
- Deadline (This Week, This Month, All)
- Category/Industry

### Bid Submission Modal

**Form Fields:**
- Proposed Bid Amount (currency input)
- Estimated Completion Date
- Technical Approach Summary (text area)

**Document Upload Section:**
- Dynamic fields based on Admin requirements
- Each requirement shows:
  - Document name
  - Description
  - Upload button
  - Validation status
- Progress tracker for required uploads

### Status Tracker Timeline

**Visual Timeline:**

```
[Submitted] ---- [Under Evaluation] ---- [Won] ✓
                    |
                    ---- [Not Awarded] ✗
```

**States:**
- **Submitted** - Blue, active
- **Under Evaluation** - Yellow, pending
- **Won** - Green, success
- **Not Awarded** - Gray, closed
- **Cancelled** - Red, stopped

---

## 6. System Status Messaging

**Purpose:** Notification and state update system.

### User Verification Flow

**Admin Action: Approve**
```
Trigger: Admin clicks "Approve" on User documents
Database: UPDATE Users SET verification_status = 'Verified'
UI Effect: 
  - Remove "Pending" overlay
  - Enable Bidding tab
  - Show success toast: "Your account is now verified!"
Notification: Email to User - "Account Verified"
```

**Admin Action: Reject**
```
Trigger: Admin clicks "Reject" on User documents
Database: UPDATE Users SET verification_status = 'Rejected'
UI Effect:
  - Show rejection banner with reason
  - Allow re-upload of documents
Notification: Email to User with rejection reason
```

### Bid Award Flow

**Admin Action: Award Project**
```
Trigger: Admin clicks "Award" on a Bid
Database Operations:
  1. UPDATE Bids SET bid_status = 'Won' WHERE id = [bid_id]
  2. UPDATE Bids SET bid_status = 'Lost' WHERE project_id = [project_id] AND id != [bid_id]
  3. UPDATE Projects SET status = 'Closed' WHERE id = [project_id]

Notifications:
  - Winner: "Congratulations! You have been awarded [Project Name]"
  - Others: "[Project Name] has been awarded to another bidder"
  
UI Updates:
  - Winner Dashboard: Success banner + project details
  - Admin Dashboard: "Project Closed" status
```

### Notification Templates

**Success States:**
- Account Verified
- Bid Submitted Successfully
- Project Awarded (Winner)
- Document Upload Complete

**Pending States:**
- Verification Pending
- Bid Under Evaluation
- Awaiting Document Review

**Action Required:**
- Documents Rejected (with reason)
- Bid Rejected
- Project Deadline Approaching

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Users
- `GET /api/users/me`
- `PUT /api/users/me/documents`
- `GET /api/users` (Admin only)
- `PUT /api/users/:id/verify` (Admin only)

### Projects
- `GET /api/projects`
- `POST /api/projects` (Admin only)
- `GET /api/projects/:id`
- `PUT /api/projects/:id` (Admin only)
- `DELETE /api/projects/:id` (Admin only)

### Bids
- `GET /api/bids`
- `POST /api/bids`
- `GET /api/bids/project/:projectId` (Admin only)
- `PUT /api/bids/:id/award` (Admin only)
- `PUT /api/bids/:id/reject` (Admin only)

---

## Tech Stack Recommendation

**Frontend:**
- React 18+
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- shadcn/ui components

**Backend:**
- Node.js + Express or Laravel
- MySQL/PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Socket.io (real-time notifications)

**File Storage:**
- AWS S3 or local storage
- CloudFront CDN for document delivery

**Optional Enhancements:**
- Redis for caching
- Elasticsearch for project search
- SendGrid/SES for email notifications
