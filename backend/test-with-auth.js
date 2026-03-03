const http = require('http');
const fs = require('fs');

// First, login to get a valid token
const loginOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const loginData = JSON.stringify({
  email: 'user@constra.com',
  password: 'user123'
});

console.log('Logging in...');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Login response:', response);
      
      if (response.token) {
        console.log('Got token, testing ZIP download...');
        testZipDownload(response.token);
      } else {
        console.log('No token received');
      }
    } catch (e) {
      console.error('Login failed:', data);
    }
  });
});

loginReq.on('error', (e) => console.error('Login error:', e.message));
loginReq.write(loginData);
loginReq.end();

function testZipDownload(token) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/projects/1/documents/download',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log('\nStatus Code:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = [];
    res.on('data', (chunk) => data.push(chunk));
    
    res.on('end', () => {
      const buffer = Buffer.concat(data);
      console.log('Response size:', buffer.length, 'bytes');
      
      // Check if it's JSON error or ZIP
      const isJson = buffer[0] === 0x7B; // {
      const isZip = buffer[0] === 0x50 && buffer[1] === 0x4B; // PK
      
      if (isJson) {
        console.log('Response is JSON:', buffer.toString());
      } else if (isZip) {
        fs.writeFileSync('test-download.zip', buffer);
        console.log('Valid ZIP saved to test-download.zip');
      } else {
        console.log('Unknown response:', buffer.toString().substring(0, 100));
      }
    });
  });

  req.on('error', (e) => console.error('Request error:', e.message));
  req.end();
}
