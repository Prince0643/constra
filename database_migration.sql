-- Database Migration: Add missing tables and update existing ones for new features
-- Run this in phpMyAdmin or MySQL client

-- ============================================
-- 1. UPDATE EXISTING PROJECTS TABLE (Add ITB fields)
-- ============================================

ALTER TABLE `projects` 
ADD COLUMN IF NOT EXISTS `referenceNumber` VARCHAR(100) DEFAULT NULL AFTER `category`,
ADD COLUMN IF NOT EXISTS `solicitationNumber` VARCHAR(100) DEFAULT NULL AFTER `referenceNumber`,
ADD COLUMN IF NOT EXISTS `procuringEntity` VARCHAR(255) DEFAULT NULL AFTER `solicitationNumber`,
ADD COLUMN IF NOT EXISTS `clientAgency` VARCHAR(255) DEFAULT NULL AFTER `procuringEntity`,
ADD COLUMN IF NOT EXISTS `areaOfDelivery` VARCHAR(255) DEFAULT NULL AFTER `clientAgency`,
ADD COLUMN IF NOT EXISTS `tradeAgreement` VARCHAR(100) DEFAULT NULL AFTER `areaOfDelivery`,
ADD COLUMN IF NOT EXISTS `procurementMode` VARCHAR(100) DEFAULT NULL AFTER `tradeAgreement`,
ADD COLUMN IF NOT EXISTS `classification` VARCHAR(100) DEFAULT NULL AFTER `procurementMode`,
ADD COLUMN IF NOT EXISTS `deliveryPeriod` VARCHAR(100) DEFAULT NULL AFTER `classification`,
ADD COLUMN IF NOT EXISTS `closingTime` TIME DEFAULT NULL AFTER `deadline`,
ADD COLUMN IF NOT EXISTS `preBidDate` DATE DEFAULT NULL AFTER `closingTime`,
ADD COLUMN IF NOT EXISTS `preBidTime` TIME DEFAULT NULL AFTER `preBidDate`,
ADD COLUMN IF NOT EXISTS `siteInspectionDate` DATE DEFAULT NULL AFTER `preBidTime`,
ADD COLUMN IF NOT EXISTS `siteInspectionTime` TIME DEFAULT NULL AFTER `siteInspectionDate`,
ADD COLUMN IF NOT EXISTS `contactName` VARCHAR(255) DEFAULT NULL AFTER `siteInspectionTime`,
ADD COLUMN IF NOT EXISTS `contactPosition` VARCHAR(255) DEFAULT NULL AFTER `contactName`,
ADD COLUMN IF NOT EXISTS `contactAddress` TEXT AFTER `contactPosition`,
ADD COLUMN IF NOT EXISTS `contactPhone` VARCHAR(50) DEFAULT NULL AFTER `contactAddress`,
ADD COLUMN IF NOT EXISTS `contactEmail` VARCHAR(255) DEFAULT NULL AFTER `contactPhone`,
ADD COLUMN IF NOT EXISTS `createdBy` VARCHAR(255) DEFAULT NULL AFTER `contactEmail`;

-- ============================================
-- 2. CREATE AWARD NOTICES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS `award_notices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `awardNoticeNumber` VARCHAR(50) NOT NULL,
  `awardDate` DATE NOT NULL,
  `referenceNumber` VARCHAR(100) DEFAULT NULL,
  `classification` VARCHAR(100) DEFAULT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT,
  `procuringEntity` VARCHAR(255) DEFAULT NULL,
  `contractAmount` DECIMAL(15,2) DEFAULT NULL,
  `supplierName` VARCHAR(255) NOT NULL,
  `supplierId` INT DEFAULT NULL,
  `projectId` INT DEFAULT NULL,
  `bidId` INT DEFAULT NULL,
  `status` ENUM('Published','Draft','Cancelled') DEFAULT 'Published',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_award_notice_number` (`awardNoticeNumber`),
  KEY `idx_award_date` (`awardDate`),
  KEY `idx_supplier` (`supplierId`),
  KEY `idx_project` (`projectId`),
  CONSTRAINT `award_notices_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `award_notices_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. CREATE SECTORS TABLE (for Directory)
-- ============================================

CREATE TABLE IF NOT EXISTS `sectors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `organizationCount` INT DEFAULT 0,
  `displayOrder` INT DEFAULT 0,
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_display_order` (`displayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sector data matching the Buyer Directory
INSERT INTO `sectors` (`id`, `name`, `description`, `organizationCount`, `displayOrder`) VALUES
(1, 'Agriculture, Agrarian Reform and Natural Resources', 'Agricultural services, agrarian reform, and natural resource management', 1433, 1),
(2, 'Communications, Roads and Other Transportation', 'Communications infrastructure and transportation services', 243, 2),
(3, 'Defense Security', 'National defense and security agencies', 22, 3),
(4, 'Economic Services', 'Economic development and financial services', 1061, 4),
(5, 'Education, Culture, and Manpower Development', 'Educational institutions and cultural services', 22233, 5),
(6, 'General Government', 'General government administrative services', 2189, 6),
(7, 'General Public Services', 'Public services and government operations', 24232, 7),
(8, 'Health', 'Health services and medical facilities', 203, 8),
(9, 'Housing and Community Development', 'Housing programs and community development', 30, 9),
(10, 'Power and Energy', 'Power generation and energy distribution', 61, 10),
(11, 'Public Order and Safety', 'Public safety and law enforcement', 1383, 11),
(12, 'Social Security, Welfare and Employment', 'Social services, welfare programs, and employment', 3885, 12),
(13, 'Social Services', 'Social welfare and community services', 527, 13),
(14, 'Transportation', 'Transportation infrastructure and services', 22, 14),
(15, 'Trade and Industry', 'Trade promotion and industrial development', 37, 15),
(16, 'Water Resources Development and Flood Control', 'Water management and flood control systems', 327, 16)
ON DUPLICATE KEY UPDATE 
  `description` = VALUES(`description`),
  `organizationCount` = VALUES(`organizationCount`),
  `displayOrder` = VALUES(`displayOrder`);

-- ============================================
-- 4. CREATE ORGANIZATIONS TABLE (for Directory)
-- ============================================

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `acronym` VARCHAR(50) DEFAULT NULL,
  `type` ENUM('Government','Private','NGO','International') DEFAULT 'Government',
  `sectorId` INT DEFAULT NULL,
  `address` TEXT,
  `city` VARCHAR(100) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `contactPerson` VARCHAR(255) DEFAULT NULL,
  `contactPosition` VARCHAR(255) DEFAULT NULL,
  `contactPhone` VARCHAR(50) DEFAULT NULL,
  `contactEmail` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sector` (`sectorId`),
  KEY `idx_type` (`type`),
  KEY `idx_region` (`region`),
  CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`sectorId`) REFERENCES `sectors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. CREATE ACTIVITY LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `module` VARCHAR(100) DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` VARCHAR(500) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `activityDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`userId`),
  KEY `idx_action` (`action`),
  KEY `idx_activity_date` (`activityDate`),
  KEY `idx_module` (`module`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. CREATE BID MATCHING PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS `bid_matching_preferences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `keywords` VARCHAR(500) DEFAULT NULL,
  `classification` VARCHAR(255) DEFAULT NULL,
  `procurementMode` VARCHAR(255) DEFAULT NULL,
  `applicableRules` VARCHAR(255) DEFAULT NULL,
  `fundingInstrument` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT NULL,
  `areaOfDelivery` VARCHAR(255) DEFAULT NULL,
  `budgetMin` DECIMAL(15,2) DEFAULT NULL,
  `budgetMax` DECIMAL(15,2) DEFAULT NULL,
  `mustHave` TEXT,
  `mustNotHave` TEXT,
  `deliveryMethod` ENUM('Online Only','Manual Only','Both') DEFAULT 'Both',
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`userId`),
  KEY `idx_active` (`isActive`),
  CONSTRAINT `bid_matching_preferences_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. UPDATE NOTIFICATIONS TABLE (Convert to InnoDB if MyISAM)
-- ============================================

-- Check if notifications is MyISAM and convert to InnoDB for foreign key support
-- Note: This requires dropping and recreating the table

-- First, backup existing notifications if any
CREATE TABLE IF NOT EXISTS `notifications_backup` LIKE `notifications`;
INSERT INTO `notifications_backup` SELECT * FROM `notifications` WHERE 1=0;

-- Drop and recreate notifications with proper structure
DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT DEFAULT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `link` VARCHAR(500) DEFAULT NULL,
  `isRead` TINYINT(1) DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `idx_is_read` (`isRead`),
  KEY `idx_created_at` (`createdAt`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. ADD SAMPLE DATA FOR TESTING
-- ============================================

-- Sample Award Notices
INSERT INTO `award_notices` (`awardNoticeNumber`, `awardDate`, `referenceNumber`, `classification`, `title`, `procuringEntity`, `contractAmount`, `supplierName`, `status`) VALUES
('0501264', '2026-12-30', '2024-001', 'Goods', 'Various Office Supplies for Regional Office', 'DepEd Region I', 1500000.00, 'MARCUSTREND TRADING', 'Published'),
('0501263', '2026-12-28', '2024-002', 'Civil Works', 'Construction of School Building Phase 1', 'DPWH Region I', 25000000.00, 'JAJR CONSTRUCTION', 'Published'),
('0501254', '2026-12-28', '2023-089', 'Services', 'IT Equipment Supply and Installation', 'DICT', 3500000.00, 'VSTECH ENTERPRISES', 'Published'),
('0501218', '2026-12-26', '2024-015', 'Civil Works', 'Road Rehabilitation and Improvement', 'DPWH Region I', 18000000.00, 'GATEWAY 25-25 CONSTRUCTION', 'Published'),
('0501213', '2026-12-22', '2023-112', 'Goods', 'Procurement of IT Equipment 2024', 'DepEd', 2800000.00, 'PAULS OFFICE SUPPLIES', 'Published')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Sample Organizations
INSERT INTO `organizations` (`name`, `acronym`, `type`, `sectorId`, `address`, `city`, `province`, `region`, `contactPerson`, `contactPosition`, `contactPhone`, `contactEmail`, `isActive`) VALUES
('Department of Public Works and Highways', 'DPWH', 'Government', 14, 'Bonifacio Drive, Port Area', 'Manila', 'Metro Manila', 'NCR', 'Engr. Maria Santos', 'Regional Director', '+63 (2) 8924-0000', 'dpwh@example.com', 1),
('Department of Education', 'DepEd', 'Government', 5, 'DepEd Complex, Meralco Avenue', 'Pasig City', 'Metro Manila', 'NCR', 'Dr. Ana Reyes', 'Secretary', '+63 (2) 8633-0000', 'deped@example.com', 1),
('Department of Health', 'DOH', 'Government', 8, 'San Lazaro Compound', 'Manila', 'Metro Manila', 'NCR', 'Dr. Pedro Lim', 'Secretary', '+63 (2) 8651-0000', 'doh@example.com', 1),
('Department of Agriculture', 'DA', 'Government', 1, 'Elliptical Road', 'Diliman', 'Quezon City', 'NCR', 'Dr. Juan Cruz', 'Secretary', '+63 (2) 8927-0000', 'da@example.com', 1)
ON DUPLICATE KEY UPDATE `sectorId` = VALUES(`sectorId`);

-- Sample Activity Log entries
INSERT INTO `activity_log` (`userId`, `action`, `description`, `module`, `ipAddress`) VALUES
(2, 'Login', 'User logged in successfully', 'Authentication', '192.168.1.100'),
(2, 'Profile Update', 'Updated contact information', 'Profile Management', '192.168.1.100'),
(2, 'Password Change', 'Password was changed successfully', 'Security', '192.168.1.100'),
(2, 'Document Upload', 'Uploaded PCAB certificate', 'Document Management', '192.168.1.100'),
(1, 'Login', 'Admin logged in successfully', 'Authentication', '192.168.1.101');

COMMIT;

-- ============================================
-- VERIFICATION QUERIES (Run these to verify)
-- ============================================

-- Check all tables exist
-- SHOW TABLES;

-- Check projects table structure
-- DESCRIBE projects;

-- Check sectors data
-- SELECT * FROM sectors ORDER BY displayOrder;

-- Check award notices
-- SELECT * FROM award_notices LIMIT 5;

-- Check activity log
-- SELECT * FROM activity_log ORDER BY activityDate DESC LIMIT 5;
