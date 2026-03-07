# System Settings Page

## Overview

The System Settings page allows administrators to configure platform settings, manage notification preferences, set security policies, and monitor system health status.

## File Location

`frontend/src/app/admin/settings/page.tsx`

## Key Features

### Page Header

- **Title**: "Settings"
- **Description**: "Manage system settings and preferences"

### Settings Grid (2-Column Layout)

## 1. General Settings Card

**Purpose**: Basic platform configuration

### Fields

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| Platform Name | text | "Constra" | Application name |
| Support Email | email | "support@constra.com" | Contact email address |
| Default Timezone | text | "Asia/Manila (GMT+8)" | System timezone (disabled) |

**Note**: Timezone field is disabled as it's set to Asia/Manila (GMT+8) by default.

## 2. Notifications Card

**Purpose**: Configure email and system notification preferences

### Toggle Options

| Setting | Default | Description |
|---------|---------|-------------|
| New Bid Notifications | ON | Notify admins when new bids are submitted |
| Verification Requests | ON | Notify when users submit documents |
| Project Deadlines | ON | Send reminders before bid deadlines |

**Icons**: Bell icon in card header

## 3. Security Card

**Purpose**: Security and authentication settings

### Toggle Options

| Setting | Default | Description |
|---------|---------|-------------|
| Two-Factor Authentication | OFF | Require 2FA for admin accounts |
| Document Verification | ON | Require verification before bidding |

### Number Input

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Session Timeout | number | 30 | Session timeout in minutes |

**Icons**: Shield icon in card header

## 4. System Status Card

**Purpose**: Current system health and operational status

### Status Indicators

| Component | Status Display |
|-----------|----------------|
| Database | "Connected" (green badge) |
| File Storage | "Operational" (green badge) |
| Email Service | "Active" (green badge) |
| Last Backup | "2 hours ago" (text) |

**Icons**: Database icon in card header

## Action Buttons

Located at bottom of page:

| Button | Style | Action |
|--------|-------|--------|
| Reset Changes | outline | Revert form changes |
| Save Settings | primary | Persist settings |

## UI Components

### shadcn/ui Components

- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Input`
- `Label`
- `Badge`
- `Switch`

### Icons (Lucide React)

- Bell, Mail, Shield, Database

## Form Structure

```typescript
// Current implementation uses static default values
// Fields are ready for form state integration:

const [settings, setSettings] = useState({
  platformName: "Constra",
  supportEmail: "support@constra.com",
  timezone: "Asia/Manila (GMT+8)",
  notifications: {
    newBidNotifications: true,
    verificationRequests: true,
    projectDeadlines: true
  },
  security: {
    twoFactorAuth: false,
    documentVerification: true,
    sessionTimeout: 30
  },
  systemStatus: {
    database: "Connected",
    fileStorage: "Operational",
    emailService: "Active",
    lastBackup: "2 hours ago"
  }
})
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  Settings                                                   │
│  Manage system settings and preferences                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────┐
│  GENERAL SETTINGS        │  NOTIFICATIONS                │
│  ┌────────────────────┐  │  ┌────────────────────────┐  │
│  │ Platform Name      │  │  │  🔔 Notifications      │  │
│  │ [Constra       ]   │  │  │  Configure email and   │  │
│  │                    │  │  │  system notifications  │  │
│  │ Support Email      │  │  ├────────────────────────┤  │
│  │ [support@...   ]   │  │  │ New Bid Notifications  │  │
│  │                    │  │  │ Notify admins...    [✓]│  │
│  │ Default Timezone   │  │  │                        │  │
│  │ [Asia/Manila...] ✓ │  │  │ Verification Requests  │  │
│  │                    │  │  │ Notify when users... [✓]│  │
│  │ Basic platform     │  │  │                        │  │
│  │ configuration      │  │  │ Project Deadlines      │  │
│  └────────────────────┘  │  │ Send reminders...    [✓]│  │
│                          │  └────────────────────────┘  │
├──────────────────────────┼──────────────────────────────┤
│  SECURITY                │  SYSTEM STATUS                │
│  ┌────────────────────┐  │  ┌────────────────────────┐  │
│  │ 🛡️ Security        │  │  │  🗄️ System Status      │  │
│  │ Security and auth  │  │  │  Current system health │  │
│  │ settings           │  │  │  and status            │  │
│  ├────────────────────┤  │  ├────────────────────────┤  │
│  │ Two-Factor Auth    │  │  │ Database        [Connected]│
│  │ Require 2FA...    [ ]│  │  │ File Storage [Operational]│
│  │                    │  │  │  │ Email Service    [Active]│
│  │ Document Verification│  │  │  │                        │  │
│  │ Require verif... [✓]│  │  │  │ Last Backup  2 hours ago │
│  │                    │  │  └────────────────────────┘  │
│  │ Session Timeout    │  │                              │
│  │ [30] minutes       │  │                              │
│  └────────────────────┘  │                              │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ACTION BAR                                                 │
│                                    [Reset Changes] [Save]  │
└─────────────────────────────────────────────────────────────┘
```

## Future Enhancements

### Potential Additions

1. **Email Configuration**
   - SMTP settings
   - Email templates
   - Send test email

2. **File Storage**
   - Storage provider selection
   - Storage limits
   - File retention policies

3. **Platform Branding**
   - Logo upload
   - Primary color selection
   - Custom CSS

4. **User Management**
   - Default user roles
   - Registration settings
   - Password policies

5. **Integration Settings**
   - API keys management
   - Webhook configuration
   - Third-party services

## Security Considerations

### Current Security Features
- Session timeout configuration
- Two-factor authentication toggle
- Document verification requirement

### Recommended Security Additions
- Password complexity requirements
- Login attempt limits
- IP whitelisting
- Audit logging settings

## Related Pages

- `/admin/dashboard` - Main admin overview
- `/admin/users` - User management
- `/admin/verification` - Document verification controls

## Color Scheme

- **Header**: text-gray-900, text-gray-600
- **Card Titles**: text-lg font-medium
- **Labels**: standard Label component styling
- **Badges**: bg-green-100 text-green-700 for positive states
- **Switches**: shadcn/ui Switch component defaults
