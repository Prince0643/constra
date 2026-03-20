# Admin Settings Page

## Overview

The Admin Settings page provides a centralized interface for administrators to configure platform settings, manage notification preferences, configure security policies, and monitor system health status.

**URL**: `http://localhost:3000/admin/settings`

**File Location**: `frontend/src/app/admin/settings/page.tsx`

---

## Page Structure

### Header Section
- **Title**: "Settings"
- **Description**: "Manage system settings and preferences"

### Layout
Two-column responsive grid layout (`grid-cols-1 md:grid-cols-2`) containing four setting cards.

---

## Settings Cards

### 1. General Settings

**Purpose**: Basic platform configuration

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| Platform Name | text | "Constra" | Application name displayed across the platform |
| Support Email | email | "support@constra.com" | Contact email for user support requests |
| Default Timezone | text | "Asia/Manila (GMT+8)" | System timezone (disabled - fixed to Philippines timezone) |

**Note**: Timezone is hardcoded to Asia/Manila (GMT+8) and cannot be changed.

---

### 2. Notifications

**Purpose**: Configure email and system notification preferences for administrators

**Header Icon**: Bell (Lucide React)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| New Bid Notifications | Toggle (Switch) | ON | Notify admins when contractors submit new bids |
| Verification Requests | Toggle (Switch) | ON | Notify when users submit documents for verification |
| Project Deadlines | Toggle (Switch) | ON | Send reminders before bid deadlines approach |

---

### 3. Security

**Purpose**: Security and authentication settings

**Header Icon**: Shield (Lucide React)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Two-Factor Authentication | Toggle (Switch) | OFF | Require 2FA for all admin account access |
| Document Verification | Toggle (Switch) | ON | Require user document verification before allowing bidding |
| Session Timeout | Number Input | 30 | Session timeout duration in minutes |

---

### 4. System Status

**Purpose**: Current system health and operational status monitoring

**Header Icon**: Database (Lucide React)

| Component | Status | Display |
|-----------|--------|---------|
| Database | Connected | Green badge |
| File Storage | Operational | Green badge |
| Email Service | Active | Green badge |
| Last Backup | 2 hours ago | Gray text |

**Note**: Status indicators are currently static/hardcoded. All services show healthy status.

---

## Action Buttons

Located at the bottom of the page, right-aligned:

| Button | Variant | Action |
|--------|---------|--------|
| Reset Changes | outline | Revert form changes to saved values |
| Save Settings | default (primary) | Persist settings to backend API |

**States**:
- Buttons are disabled when no changes have been made
- Save button shows loading spinner during save operation

---

## Technical Details

### Component Type
"use client" - Client-side React component with full interactivity

### State Management
- `settings`: Current settings state
- `isLoading`: Loading state during initial fetch
- `isSaving`: Saving state during API call
- `hasChanges`: Tracks if any changes have been made

### API Integration

**Endpoints**:
- `GET /api/settings` - Fetch all system settings (admin only)
- `PUT /api/settings` - Update settings (admin only)

**Data Flow**:
1. On mount: Fetches settings from backend API
2. User makes changes: Updates local state via `handleChange`
3. Save clicked: Sends PUT request with all settings
4. Reset clicked: Re-fetches settings from API

### Database Schema

**Table**: `system_settings`

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| settingKey | VARCHAR(100) | Unique setting identifier |
| settingValue | TEXT | Setting value (stored as string) |
| settingType | ENUM | 'boolean', 'string', 'number', 'json' |
| description | TEXT | Human-readable description |
| updatedAt | DATETIME | Last modification timestamp |
| updatedBy | INT | Foreign key to users table |

**Default Settings**:
- `require2FA` - Require 2FA for admin accounts
- `sessionTimeout` - Session timeout in minutes
- `platformName` - Platform name
- `supportEmail` - Support email address
- `newBidNotifications` - New bid notifications
- `verificationRequestNotifications` - Verification request notifications
- `projectDeadlineNotifications` - Project deadline notifications
- `documentVerification` - Require document verification

### Responsive Design
- Mobile: Single column layout
- Tablet/Desktop: Two-column grid

---

## UI Components Used

### shadcn/ui Components
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Input`
- `Label`
- `Badge`
- `Switch`

### Icons (Lucide React)
- `Bell` - Notifications card header
- `Shield` - Security card header  
- `Database` - System Status card header
- `Loader2` - Loading spinner

---

## Related Files

- `frontend/src/app/admin/layout.tsx` - Admin layout with sidebar navigation
- `frontend/src/components/ui/card.tsx` - Card component
- `frontend/src/components/ui/switch.tsx` - Toggle switch component
- `frontend/src/components/ui/button.tsx` - Button component
- `frontend/src/components/ui/input.tsx` - Input component
- `frontend/src/components/ui/label.tsx` - Label component
- `frontend/src/components/ui/badge.tsx` - Badge component
- `backend/database/schema.sql` - Database schema with system_settings table
- `backend/server.js` - Backend API endpoints for settings

---

## Future Enhancements Needed

1. **Toast Notifications**: Show success/error messages after actions
2. **Dynamic System Status**: Fetch real-time status from backend health checks
3. **Settings Persistence**: Store settings in database with key-value structure
4. **Form Validation**: Add input validation for email, timeout values
5. **Loading States**: Add loading indicators during save operations
