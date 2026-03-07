-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 06, 2026 at 01:25 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `constra`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `module` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `activityDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`userId`),
  KEY `idx_action` (`action`),
  KEY `idx_activity_date` (`activityDate`),
  KEY `idx_module` (`module`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `userId`, `action`, `description`, `module`, `ipAddress`, `userAgent`, `metadata`, `activityDate`) VALUES
(1, 2, 'Login', 'User logged in', 'Authentication', '192.168.1.100', NULL, NULL, '2026-03-05 10:24:49'),
(2, 2, 'Profile Update', 'Updated profile', 'Profile', '192.168.1.100', NULL, NULL, '2026-03-05 10:24:49'),
(3, 1, 'Login', 'Admin login', 'Authentication', '192.168.1.101', NULL, NULL, '2026-03-05 10:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `award_notices`
--

DROP TABLE IF EXISTS `award_notices`;
CREATE TABLE IF NOT EXISTS `award_notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `awardNoticeNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `awardDate` date NOT NULL,
  `referenceNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `procuringEntity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractAmount` decimal(15,2) DEFAULT NULL,
  `supplierName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplierId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `bidId` int DEFAULT NULL,
  `status` enum('Published','Draft','Cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'Published',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_award_notice_number` (`awardNoticeNumber`),
  KEY `idx_award_date` (`awardDate`),
  KEY `idx_supplier` (`supplierId`),
  KEY `idx_project` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `award_notices`
--

INSERT INTO `award_notices` (`id`, `awardNoticeNumber`, `awardDate`, `referenceNumber`, `classification`, `title`, `description`, `procuringEntity`, `contractAmount`, `supplierName`, `supplierId`, `projectId`, `bidId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '0501264', '2026-12-30', '2024-001', 'Goods', 'Various Office Supplies', NULL, 'DepEd', 1500000.00, 'MARCUSTREND', NULL, NULL, NULL, 'Published', '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(2, '0501263', '2026-12-28', '2024-002', 'Civil Works', 'School Building Construction', NULL, 'DPWH', 25000000.00, 'JAJR CONSTRUCTION', NULL, NULL, NULL, 'Published', '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(3, '0501254', '2026-12-28', '2023-089', 'Services', 'IT Equipment Supply', NULL, 'DICT', 3500000.00, 'VSTECH', NULL, NULL, NULL, 'Published', '2026-03-05 10:24:49', '2026-03-05 10:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
CREATE TABLE IF NOT EXISTS `bids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bidAmount` decimal(15,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `complianceStatus` enum('Pending','Compliant','Non-Compliant') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `bidStatus` enum('Submitted','Under Evaluation','Won','Lost') COLLATE utf8mb4_unicode_ci DEFAULT 'Submitted',
  `submittedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `userId` int NOT NULL,
  `projectId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bids_user` (`userId`),
  KEY `idx_bids_project` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bids`
--

INSERT INTO `bids` (`id`, `bidAmount`, `notes`, `complianceStatus`, `bidStatus`, `submittedAt`, `userId`, `projectId`) VALUES
(1, 1234.00, 'afasdf', 'Compliant', 'Won', '2026-02-28 14:13:18', 2, 2),
(2, 4567745.00, 'ftyujfghj', 'Pending', 'Lost', '2026-02-28 14:51:32', 2, 3),
(3, 1234452.00, '', 'Pending', 'Lost', '2026-02-28 16:43:59', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `bid_matching_preferences`
--

DROP TABLE IF EXISTS `bid_matching_preferences`;
CREATE TABLE IF NOT EXISTS `bid_matching_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `procurementMode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicableRules` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fundingInstrument` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `areaOfDelivery` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budgetMin` decimal(15,2) DEFAULT NULL,
  `budgetMax` decimal(15,2) DEFAULT NULL,
  `mustHave` text COLLATE utf8mb4_unicode_ci,
  `mustNotHave` text COLLATE utf8mb4_unicode_ci,
  `deliveryMethod` enum('Online Only','Manual Only','Both') COLLATE utf8mb4_unicode_ci DEFAULT 'Both',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`userId`),
  KEY `idx_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Verified','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `userId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_documents_user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `name`, `description`, `fileName`, `filePath`, `fileSize`, `status`, `userId`, `createdAt`) VALUES
(1, 'DTI Registration', 'Department of Trade and Industry registration certificate', 'Document1.pdf', 'uploads/1772261697453-Document1.pdf', '0.08 MB', 'Verified', 2, '2026-02-28 14:54:57'),
(2, 'Business Permit', 'Valid business permit from local government', 'entrada sto-Model.pdf', 'uploads/1772261700836-entrada sto-Model.pdf', '0.09 MB', 'Verified', 2, '2026-02-28 14:55:00'),
(3, 'Mayor\'s Permit', 'Mayor\'s permit to operate', 'Document1.pdf', 'uploads/1772261704253-Document1.pdf', '0.08 MB', 'Verified', 2, '2026-02-28 14:55:04'),
(4, 'Company Profile', 'Company background and portfolio', 'NOV PIE CHART.pdf', 'uploads/1772268256692-NOV PIE CHART.pdf', '0.77 MB', 'Pending', 2, '2026-02-28 16:44:16');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `idx_is_read` (`isRead`),
  KEY `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications_backup`
--

DROP TABLE IF EXISTS `notifications_backup`;
CREATE TABLE IF NOT EXISTS `notifications_backup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
CREATE TABLE IF NOT EXISTS `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acronym` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('Government','Private','NGO','International') COLLATE utf8mb4_unicode_ci DEFAULT 'Government',
  `sectorId` int DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPerson` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPosition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sector` (`sectorId`),
  KEY `idx_type` (`type`),
  KEY `idx_region` (`region`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `name`, `acronym`, `type`, `sectorId`, `address`, `city`, `province`, `region`, `contactPerson`, `contactPosition`, `contactPhone`, `contactEmail`, `website`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Department of Public Works', 'DPWH', 'Government', 14, 'Port Area', 'Manila', 'Metro Manila', 'NCR', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(2, 'Department of Education', 'DepEd', 'Government', 5, 'Meralco Ave', 'Pasig', 'Metro Manila', 'NCR', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(3, 'Department of Health', 'DOH', 'Government', 8, 'San Lazaro', 'Manila', 'Metro Manila', 'NCR', NULL, NULL, NULL, NULL, NULL, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `abc` decimal(15,2) NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `closingTime` time DEFAULT NULL,
  `preBidDate` date DEFAULT NULL,
  `preBidTime` time DEFAULT NULL,
  `siteInspectionDate` date DEFAULT NULL,
  `siteInspectionTime` time DEFAULT NULL,
  `contactName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPosition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactAddress` text COLLATE utf8mb4_unicode_ci,
  `contactPhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Open','Closed','Draft') COLLATE utf8mb4_unicode_ci DEFAULT 'Open',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `solicitationNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `procuringEntity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientAgency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `areaOfDelivery` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tradeAgreement` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `procurementMode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryPeriod` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `businessCategory` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datePublished` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_projects_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `abc`, `location`, `deadline`, `closingTime`, `preBidDate`, `preBidTime`, `siteInspectionDate`, `siteInspectionTime`, `contactName`, `contactPosition`, `contactAddress`, `contactPhone`, `contactEmail`, `createdBy`, `status`, `category`, `referenceNumber`, `solicitationNumber`, `procuringEntity`, `clientAgency`, `areaOfDelivery`, `tradeAgreement`, `procurementMode`, `classification`, `deliveryPeriod`, `createdAt`, `updatedAt`, `businessCategory`, `datePublished`) VALUES
(1, 'Highway Expansion Project', 'Expansion of the North Luzon Expressway to accommodate increased traffic volume.', 50000000.00, 'Metro Manila', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Open', 'Infrastructure', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-28 13:15:38', '2026-02-28 13:15:38', NULL, NULL),
(2, 'School Building Construction', 'Construction of a 3-story school building with 24 classrooms.', 25000000.00, 'Cebu City', '2024-11-30 23:59:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Closed', 'Education', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-28 13:15:38', '2026-02-28 14:14:08', NULL, NULL),
(3, 'Road Paving - District 5', 'Asphalt paving of 5km municipal roads including drainage improvements.', 15000000.00, 'Quezon City', '2024-10-31 23:59:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Open', 'Infrastructure', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-28 13:15:38', '2026-02-28 13:15:38', NULL, NULL),
(4, '', '', 0.00, '', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Open', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:34:12', '2026-03-03 10:34:12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_documents`
--

DROP TABLE IF EXISTS `project_documents`;
CREATE TABLE IF NOT EXISTS `project_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mimeType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectId` int NOT NULL,
  `uploadedBy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_documents`
--

INSERT INTO `project_documents` (`id`, `name`, `fileName`, `filePath`, `fileSize`, `mimeType`, `projectId`, `uploadedBy`, `uploadedAt`) VALUES
(1, 'JAJR Attendance System_ Production Update Manual.pdf', 'JAJR Attendance System_ Production Update Manual.pdf', 'uploads/1772507024109-JAJR Attendance System_ Production Update Manual.pdf', '0.08 MB', 'application/pdf', 2, 'admin@constra.com', '2026-03-03 03:03:44'),
(2, 'JAJR Attendance System_ Production Update Manual.pdf', 'JAJR Attendance System_ Production Update Manual.pdf', 'uploads/1772507035268-JAJR Attendance System_ Production Update Manual.pdf', '0.08 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:03:55'),
(3, 'JAJR Attendance System_ Production Update Manual.pdf', 'JAJR Attendance System_ Production Update Manual.pdf', 'uploads/1772507123796-JAJR Attendance System_ Production Update Manual.pdf', '0.08 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:05:23'),
(4, 'Bidding Documents - Construction of Connector Road from C.M. Recto Avenue to Airport Road New Terminal Building in Clark_sgd.pdf', 'Bidding Documents - Construction of Connector Road from C.M. Recto Avenue to Airport Road New Terminal Building in Clark_sgd.pdf', 'uploads/1772507180275-Bidding Documents - Construction of Connector Road from C.M. Recto Avenue to Airport Road New Terminal Building in Clark_sgd.pdf', '1.58 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:06:20'),
(5, 'SFP.pdf', 'SFP.pdf', 'uploads/1772507271116-SFP.pdf', '0.16 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:07:51'),
(6, 'SFP.pdf', 'SFP.pdf', 'uploads/1772507330283-SFP.pdf', '0.16 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:08:50'),
(7, 'EL1.pdf', 'EL1.pdf', 'uploads/1772507448276-EL1.pdf', '0.20 MB', 'application/pdf', 1, 'admin@constra.com', '2026-03-03 03:10:48');

-- --------------------------------------------------------

--
-- Table structure for table `project_requirements`
--

DROP TABLE IF EXISTS `project_requirements`;
CREATE TABLE IF NOT EXISTS `project_requirements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `required` tinyint(1) DEFAULT '1',
  `projectId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_requirements`
--

INSERT INTO `project_requirements` (`id`, `name`, `description`, `required`, `projectId`) VALUES
(1, 'Financial Proposal', 'Complete cost breakdown and financial plan', 1, 1),
(2, 'Technical Specifications', 'Detailed technical approach and methodology', 1, 1),
(3, 'Company Profile', 'Company background and portfolio', 1, 1),
(4, 'Financial Proposal', 'Complete cost breakdown and financial plan', 1, 2),
(5, 'Technical Specifications', 'Detailed technical approach and methodology', 1, 2),
(6, 'Certificate of PhilGEPS Registration', 'Valid PhilGEPS registration certificate', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

DROP TABLE IF EXISTS `sectors`;
CREATE TABLE IF NOT EXISTS `sectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `organizationCount` int DEFAULT '0',
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_display_order` (`displayOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `name`, `description`, `organizationCount`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Agriculture, Agrarian Reform and Natural Resources', 'Agricultural services and natural resources', 1433, 1, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(2, 'Communications, Roads and Other Transportation', 'Communications and transportation', 243, 2, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(3, 'Defense Security', 'National defense and security', 22, 3, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(4, 'Economic Services', 'Economic development services', 1061, 4, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(5, 'Education, Culture, and Manpower Development', 'Education and cultural services', 22233, 5, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(6, 'General Government', 'Government administrative services', 2189, 6, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(7, 'General Public Services', 'Public services operations', 24232, 7, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(8, 'Health', 'Health and medical services', 203, 8, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(9, 'Housing and Community Development', 'Housing programs', 30, 9, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(10, 'Power and Energy', 'Power and energy distribution', 61, 10, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(11, 'Public Order and Safety', 'Public safety services', 1383, 11, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(12, 'Social Security, Welfare and Employment', 'Social services', 3885, 12, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(13, 'Social Services', 'Community services', 527, 13, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(14, 'Transportation', 'Transportation services', 22, 14, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(15, 'Trade and Industry', 'Trade and industry', 37, 15, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49'),
(16, 'Water Resources Development and Flood Control', 'Water management', 327, 16, 1, '2026-03-05 10:24:49', '2026-03-05 10:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `businessType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtiRegistration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tinNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `businessAddress` text COLLATE utf8mb4_unicode_ci,
  `phoneNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verificationStatus` enum('Pending','Verified','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `role` enum('User','Admin') COLLATE utf8mb4_unicode_ci DEFAULT 'User',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_verification` (`verificationStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `companyName`, `businessType`, `dtiRegistration`, `tinNumber`, `businessAddress`, `phoneNumber`, `verificationStatus`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@constra.com', '$2b$10$2BDmeaa3cSMXDwYGzFfibu3qGZ2OlAtAPZkqHrZIK9ONRICSU64r.', 'Constra Admin', NULL, NULL, NULL, NULL, NULL, 'Verified', 'Admin', '2026-02-28 13:15:38', '2026-02-28 14:12:53'),
(2, 'user@constra.com', '$2b$10$h5vNpVMxCMZS6fMy563tvuQwX0geQzuqz.fhi.b.m0OD2A3G7Uz6W', 'ABC Construction Corp', 'Construction & Engineering', 'DTI-123456-2024', '123-456-789-000', '123 Main Street, Makati City, Metro Manila, Philippines', '+63 912 345 6789', 'Verified', 'User', '2026-02-28 13:15:38', '2026-02-28 14:12:53');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `award_notices`
--
ALTER TABLE `award_notices`
  ADD CONSTRAINT `award_notices_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `award_notices_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bid_matching_preferences`
--
ALTER TABLE `bid_matching_preferences`
  ADD CONSTRAINT `bid_matching_preferences_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`sectorId`) REFERENCES `sectors` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `project_requirements`
--
ALTER TABLE `project_requirements`
  ADD CONSTRAINT `project_requirements_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
