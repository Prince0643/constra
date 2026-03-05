-- Database Migration: MySQL 8.0+ Compatible Version
-- Run this in phpMyAdmin or MySQL client

-- ============================================
-- 1. UPDATE EXISTING PROJECTS TABLE (Add ITB fields)
-- ============================================

ALTER TABLE `projects` 
ADD COLUMN `referenceNumber` VARCHAR(100) DEFAULT NULL AFTER `category`,
ADD COLUMN `solicitationNumber` VARCHAR(100) DEFAULT NULL AFTER `referenceNumber`,
ADD COLUMN `procuringEntity` VARCHAR(255) DEFAULT NULL AFTER `solicitationNumber`,
ADD COLUMN `clientAgency` VARCHAR(255) DEFAULT NULL AFTER `procuringEntity`,
ADD COLUMN `areaOfDelivery` VARCHAR(255) DEFAULT NULL AFTER `clientAgency`,
ADD COLUMN `tradeAgreement` VARCHAR(100) DEFAULT NULL AFTER `areaOfDelivery`,
ADD COLUMN `procurementMode` VARCHAR(100) DEFAULT NULL AFTER `tradeAgreement`,
ADD COLUMN `classification` VARCHAR(100) DEFAULT NULL AFTER `procurementMode`,
ADD COLUMN `deliveryPeriod` VARCHAR(100) DEFAULT NULL AFTER `classification`,
ADD COLUMN `closingTime` TIME DEFAULT NULL AFTER `deadline`,
ADD COLUMN `preBidDate` DATE DEFAULT NULL AFTER `closingTime`,
ADD COLUMN `preBidTime` TIME DEFAULT NULL AFTER `preBidDate`,
ADD COLUMN `siteInspectionDate` DATE DEFAULT NULL AFTER `preBidTime`,
ADD COLUMN `siteInspectionTime` TIME DEFAULT NULL AFTER `siteInspectionDate`,
ADD COLUMN `contactName` VARCHAR(255) DEFAULT NULL AFTER `siteInspectionTime`,
ADD COLUMN `contactPosition` VARCHAR(255) DEFAULT NULL AFTER `contactName`,
ADD COLUMN `contactAddress` TEXT AFTER `contactPosition`,
ADD COLUMN `contactPhone` VARCHAR(50) DEFAULT NULL AFTER `contactAddress`,
ADD COLUMN `contactEmail` VARCHAR(255) DEFAULT NULL AFTER `contactPhone`,
ADD COLUMN `createdBy` VARCHAR(255) DEFAULT NULL AFTER `contactEmail`;

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

-- Insert sector data
INSERT INTO `sectors` (`id`, `name`, `description`, `organizationCount`, `displayOrder`) VALUES
(1, 'Agriculture, Agrarian Reform and Natural Resources', 'Agricultural services and natural resources', 1433, 1),
(2, 'Communications, Roads and Other Transportation', 'Communications and transportation', 243, 2),
(3, 'Defense Security', 'National defense and security', 22, 3),
(4, 'Economic Services', 'Economic development services', 1061, 4),
(5, 'Education, Culture, and Manpower Development', 'Education and cultural services', 22233, 5),
(6, 'General Government', 'Government administrative services', 2189, 6),
(7, 'General Public Services', 'Public services operations', 24232, 7),
(8, 'Health', 'Health and medical services', 203, 8),
(9, 'Housing and Community Development', 'Housing programs', 30, 9),
(10, 'Power and Energy', 'Power and energy distribution', 61, 10),
(11, 'Public Order and Safety', 'Public safety services', 1383, 11),
(12, 'Social Security, Welfare and Employment', 'Social services', 3885, 12),
(13, 'Social Services', 'Community services', 527, 13),
(14, 'Transportation', 'Transportation services', 22, 14),
(15, 'Trade and Industry', 'Trade and industry', 37, 15),
(16, 'Water Resources Development and Flood Control', 'Water management', 327, 16)
ON DUPLICATE KEY UPDATE 
  `description` = VALUES(`description`),
  `organizationCount` = VALUES(`organizationCount`),
  `displayOrder` = VALUES(`displayOrder`);

-- ============================================
-- 4. CREATE ORGANIZATIONS TABLE
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
-- 7. DROP AND RECREATE NOTIFICATIONS TABLE (InnoDB)
-- ============================================

-- First backup existing data if needed
CREATE TABLE IF NOT EXISTS `notifications_backup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT DEFAULT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `link` VARCHAR(500) DEFAULT NULL,
  `isRead` TINYINT(1) DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copy existing data (if any exists and structure matches)
INSERT IGNORE INTO `notifications_backup` 
SELECT * FROM `notifications` WHERE 1=1;

-- Drop old table
DROP TABLE IF EXISTS `notifications`;

-- Recreate with proper structure
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
-- 8. ADD SAMPLE DATA
-- ============================================

-- Sample Award Notices
INSERT INTO `award_notices` (`awardNoticeNumber`, `awardDate`, `referenceNumber`, `classification`, `title`, `procuringEntity`, `contractAmount`, `supplierName`, `status`) VALUES
('0501264', '2026-12-30', '2024-001', 'Goods', 'Various Office Supplies', 'DepEd', 1500000.00, 'MARCUSTREND', 'Published'),
('0501263', '2026-12-28', '2024-002', 'Civil Works', 'School Building Construction', 'DPWH', 25000000.00, 'JAJR CONSTRUCTION', 'Published'),
('0501254', '2026-12-28', '2023-089', 'Services', 'IT Equipment Supply', 'DICT', 3500000.00, 'VSTECH', 'Published')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Sample Organizations
INSERT INTO `organizations` (`name`, `acronym`, `type`, `sectorId`, `address`, `city`, `province`, `region`, `isActive`) VALUES
('Department of Public Works', 'DPWH', 'Government', 14, 'Port Area', 'Manila', 'Metro Manila', 'NCR', 1),
('Department of Education', 'DepEd', 'Government', 5, 'Meralco Ave', 'Pasig', 'Metro Manila', 'NCR', 1),
('Department of Health', 'DOH', 'Government', 8, 'San Lazaro', 'Manila', 'Metro Manila', 'NCR', 1)
ON DUPLICATE KEY UPDATE `sectorId` = VALUES(`sectorId`);

-- Sample Activity Log
INSERT INTO `activity_log` (`userId`, `action`, `description`, `module`, `ipAddress`) VALUES
(2, 'Login', 'User logged in', 'Authentication', '192.168.1.100'),
(2, 'Profile Update', 'Updated profile', 'Profile', '192.168.1.100'),
(1, 'Login', 'Admin login', 'Authentication', '192.168.1.101');
