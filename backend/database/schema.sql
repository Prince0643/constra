-- Constra Database Schema for MySQL/MariaDB
-- Compatible with phpMyAdmin

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255),
  `businessType` VARCHAR(255),
  `dtiRegistration` VARCHAR(255),
  `tinNumber` VARCHAR(255),
  `businessAddress` TEXT,
  `phoneNumber` VARCHAR(50),
  `verificationStatus` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
  `role` ENUM('User', 'Admin') DEFAULT 'User',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents Table
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `fileName` VARCHAR(255) NOT NULL,
  `filePath` VARCHAR(500) NOT NULL,
  `fileSize` VARCHAR(50),
  `status` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
  `userId` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `referenceNumber` VARCHAR(100),
  `solicitationNumber` VARCHAR(100),
  `procuringEntity` VARCHAR(255),
  `clientAgency` VARCHAR(255),
  `areaOfDelivery` VARCHAR(255),
  `tradeAgreement` VARCHAR(255),
  `procurementMode` VARCHAR(100),
  `classification` VARCHAR(100),
  `abc` DECIMAL(15, 2) NOT NULL,
  `location` VARCHAR(255),
  `deliveryPeriod` VARCHAR(100),
  `deadline` DATETIME,
  `closingTime` VARCHAR(20),
  `preBidDate` DATE,
  `preBidTime` VARCHAR(20),
  `siteInspectionDate` DATE,
  `siteInspectionTime` VARCHAR(20),
  `status` ENUM('Open', 'Closed', 'Draft') DEFAULT 'Open',
  `category` VARCHAR(100),
  `businessCategory` VARCHAR(100),
  `createdBy` VARCHAR(255),
  `contactName` VARCHAR(255),
  `contactPosition` VARCHAR(255),
  `contactAddress` TEXT,
  `contactPhone` VARCHAR(50),
  `contactEmail` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `datePublished` DATE,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Requirements Table
CREATE TABLE IF NOT EXISTS `project_requirements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `required` BOOLEAN DEFAULT TRUE,
  `projectId` INT NOT NULL,
  FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bids Table
CREATE TABLE IF NOT EXISTS `bids` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bidAmount` DECIMAL(15, 2) NOT NULL,
  `notes` TEXT,
  `complianceStatus` ENUM('Pending', 'Compliant', 'Non-Compliant') DEFAULT 'Pending',
  `bidStatus` ENUM('Submitted', 'Under Evaluation', 'Won', 'Lost') DEFAULT 'Submitted',
  `submittedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `userId` INT NOT NULL,
  `projectId` INT NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(500),
  `isRead` BOOLEAN DEFAULT FALSE,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_users_email ON `users`(`email`);
CREATE INDEX idx_users_verification ON `users`(`verificationStatus`);
CREATE INDEX idx_projects_status ON `projects`(`status`);
CREATE INDEX idx_bids_user ON `bids`(`userId`);
CREATE INDEX idx_bids_project ON `bids`(`projectId`);
CREATE INDEX idx_documents_user ON `documents`(`userId`);

-- Sample Data (Optional - remove if not needed)
-- Admin User (password: admin123 - hashed with bcrypt)
INSERT INTO `users` (`id`, `email`, `password`, `companyName`, `role`, `verificationStatus`) VALUES
(1, 'admin@constra.com', '$2a$10$YourHashedPasswordHere', 'Constra Admin', 'Admin', 'Verified');

-- Test User (password: user123 - hashed with bcrypt)
INSERT INTO `users` (`id`, `email`, `password`, `companyName`, `businessType`, `dtiRegistration`, `tinNumber`, `businessAddress`, `phoneNumber`, `role`, `verificationStatus`) VALUES
(2, 'user@constra.com', '$2a$10$YourHashedPasswordHere', 'ABC Construction Corp', 'Construction & Engineering', 'DTI-123456-2024', '123-456-789-000', '123 Main Street, Makati City, Metro Manila, Philippines', '+63 912 345 6789', 'User', 'Verified');

-- Sample Projects
INSERT INTO `projects` (`id`, `title`, `description`, `abc`, `location`, `deadline`, `status`, `category`) VALUES
(1, 'Highway Expansion Project', 'Expansion of the North Luzon Expressway to accommodate increased traffic volume.', 50000000.00, 'Metro Manila', '2024-12-31 23:59:59', 'Open', 'Infrastructure'),
(2, 'School Building Construction', 'Construction of a 3-story school building with 24 classrooms.', 25000000.00, 'Cebu City', '2024-11-30 23:59:59', 'Open', 'Education'),
(3, 'Road Paving - District 5', 'Asphalt paving of 5km municipal roads including drainage improvements.', 15000000.00, 'Quezon City', '2024-10-31 23:59:59', 'Open', 'Infrastructure');

-- Sample Project Requirements
INSERT INTO `project_requirements` (`name`, `description`, `required`, `projectId`) VALUES
('Financial Proposal', 'Complete cost breakdown and financial plan', TRUE, 1),
('Technical Specifications', 'Detailed technical approach and methodology', TRUE, 1),
('Company Profile', 'Company background and portfolio', TRUE, 1),
('Financial Proposal', 'Complete cost breakdown and financial plan', TRUE, 2),
('Technical Specifications', 'Detailed technical approach and methodology', TRUE, 2),
('Certificate of PhilGEPS Registration', 'Valid PhilGEPS registration certificate', TRUE, 2);
