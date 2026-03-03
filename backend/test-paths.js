const path = require('path');
const fs = require('fs');

const baseDir = 'C:\\wamp64\\www\\constra\\backend';

// Test cases from database
const testPaths = [
  'uploads\\1772507035268-JAJR Attendance System_ Production Update Manual.pdf',
  'uploads\\1772507448276-EL1.pdf'
];

console.log('Testing file paths...\n');

for (const dbPath of testPaths) {
  // Method 1: Direct join (may have double backslash issue)
  const path1 = path.join(baseDir, dbPath);
  console.log('Method 1 - Direct join:');
  console.log('  Result:', path1);
  console.log('  Exists:', fs.existsSync(path1));
  console.log();
  
  // Method 2: Replace backslashes first
  const normalized = dbPath.replace(/\\/g, '/');
  const path2 = path.join(baseDir, normalized);
  console.log('Method 2 - Normalized:');
  console.log('  Normalized:', normalized);
  console.log('  Result:', path2);
  console.log('  Exists:', fs.existsSync(path2));
  console.log('  ---');
}

// List actual files in uploads folder
console.log('\nActual files in uploads folder:');
const uploadsPath = path.join(baseDir, 'uploads');
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  files.forEach(f => console.log('  ', f));
}
