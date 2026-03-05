-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 05, 2026 at 02:17 AM
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
  KEY `userId` (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `status` enum('Open','Closed','Draft') COLLATE utf8mb4_unicode_ci DEFAULT 'Open',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `abc`, `location`, `deadline`, `status`, `category`, `createdAt`, `updatedAt`) VALUES
(1, 'Highway Expansion Project', 'Expansion of the North Luzon Expressway to accommodate increased traffic volume.', 50000000.00, 'Metro Manila', '2024-12-31 23:59:59', 'Open', 'Infrastructure', '2026-02-28 13:15:38', '2026-02-28 13:15:38'),
(2, 'School Building Construction', 'Construction of a 3-story school building with 24 classrooms.', 25000000.00, 'Cebu City', '2024-11-30 23:59:59', 'Closed', 'Education', '2026-02-28 13:15:38', '2026-02-28 14:14:08'),
(3, 'Road Paving - District 5', 'Asphalt paving of 5km municipal roads including drainage improvements.', 15000000.00, 'Quezon City', '2024-10-31 23:59:59', 'Open', 'Infrastructure', '2026-02-28 13:15:38', '2026-02-28 13:15:38'),
(4, '', '', 0.00, '', '0000-00-00 00:00:00', 'Open', '', '2026-03-03 10:34:12', '2026-03-03 10:34:12');

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
-- Constraints for table `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_requirements`
--
ALTER TABLE `project_requirements`
  ADD CONSTRAINT `project_requirements_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
