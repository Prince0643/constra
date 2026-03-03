const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream('test-output.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('Archive created successfully!');
  console.log('Total bytes:', archive.pointer());
  console.log('Files in archive: 2');
});

archive.on('error', (err) => {
  console.error('Archiver error:', err);
});

archive.on('warning', (err) => {
  console.warn('Archiver warning:', err);
});

archive.pipe(output);

// Add test files
const testFiles = [
  'uploads/1772507448276-EL1.pdf',
  'uploads/1772507035268-JAJR Attendance System_ Production Update Manual.pdf'
];

for (const file of testFiles) {
  const fullPath = path.join(__dirname, file);
  console.log('Adding:', fullPath, 'Exists:', fs.existsSync(fullPath));
  if (fs.existsSync(fullPath)) {
    archive.file(fullPath, { name: path.basename(file) });
    console.log('  -> Added');
  }
}

archive.finalize();
