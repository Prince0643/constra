const http = require('http');
const fs = require('fs');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/projects/1/documents/download',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'
  }
};

console.log('Testing ZIP download endpoint...');

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = [];
  res.on('data', (chunk) => {
    data.push(chunk);
  });
  
  res.on('end', () => {
    const buffer = Buffer.concat(data);
    console.log('Response size:', buffer.length, 'bytes');
    
    if (buffer.length > 0) {
      fs.writeFileSync('test-download.zip', buffer);
      console.log('Saved to test-download.zip');
      
      // Check if it's a valid ZIP
      const isZip = buffer[0] === 0x50 && buffer[1] === 0x4B;
      console.log('Is valid ZIP:', isZip);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
