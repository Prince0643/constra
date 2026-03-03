const mysql = require('mysql2/promise');

async function check() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'constra'
  });
  
  const [rows] = await pool.execute(
    'SELECT id, name, filePath FROM project_documents WHERE projectId = 1'
  );
  
  console.log('Documents for project 1:');
  rows.forEach(doc => {
    console.log(`  ID: ${doc.id}, Name: ${doc.name}`);
    console.log(`  filePath: ${doc.filePath}`);
    console.log('---');
  });
  
  await pool.end();
}

check().catch(console.error);
