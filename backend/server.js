require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'constra',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber } = req.body;
    
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email.includes('admin') ? 'Admin' : 'User';
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber, role]
    );

    const token = jwt.sign(
      { userId: result.insertId, email, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        companyName,
        role,
        verificationStatus: 'Pending'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User found:', users.length > 0);
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ========== USER ROUTES ==========
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber, verificationStatus, role, createdAt FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [documents] = await pool.execute('SELECT * FROM documents WHERE userId = ?', [req.user.userId]);
    res.json({ ...users[0], documents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, email, companyName, verificationStatus, role, createdAt FROM users');
    
    const usersWithBidCount = await Promise.all(users.map(async (user) => {
      const [bidCount] = await pool.execute('SELECT COUNT(*) as count FROM bids WHERE userId = ?', [user.id]);
      return { ...user, _count: { bids: bidCount[0].count } };
    }));
    
    res.json(usersWithBidCount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Update user verification status
    await pool.execute('UPDATE users SET verificationStatus = ? WHERE id = ?', [status, id]);
    
    // If verifying user, also mark all their documents as verified
    if (status === 'Verified') {
      await pool.execute('UPDATE documents SET status = ? WHERE userId = ?', ['verified', id]);
    }
    
    const [users] = await pool.execute('SELECT id, email, companyName, verificationStatus FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'User verification updated', user: users[0] });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

app.post('/api/users/me/documents', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO documents (name, description, fileName, filePath, fileSize, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, req.file.originalname, req.file.path, `${(req.file.size / 1024 / 1024).toFixed(2)} MB`, req.user.userId]
    );
    
    const [documents] = await pool.execute('SELECT * FROM documents WHERE id = ?', [result.insertId]);
    res.status(201).json(documents[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

app.get('/api/users/:id/documents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.execute(
      'SELECT id, email, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber, verificationStatus, role, createdAt FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [documents] = await pool.execute('SELECT * FROM documents WHERE userId = ?', [id]);
    res.json({ ...users[0], documents });
  } catch (error) {
    console.error('Error fetching user documents:', error);
    res.status(500).json({ error: 'Failed to fetch user documents' });
  }
});
app.put('/api/documents/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute('UPDATE documents SET status = ? WHERE id = ?', [status, id]);
    
    const [documents] = await pool.execute('SELECT * FROM documents WHERE id = ?', [id]);
    res.json({ message: 'Document status updated', document: documents[0] });
  } catch (error) {
    console.error('Document verify error:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const [projects] = await pool.execute('SELECT * FROM projects');
    
    const projectsWithDetails = await Promise.all(projects.map(async (project) => {
      const [requirements] = await pool.execute('SELECT * FROM project_requirements WHERE projectId = ?', [project.id]);
      const [bidCount] = await pool.execute('SELECT COUNT(*) as count FROM bids WHERE projectId = ?', [project.id]);
      return { ...project, requirements, _count: { bids: bidCount[0].count } };
    }));
    
    res.json(projectsWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const [requirements] = await pool.execute('SELECT * FROM project_requirements WHERE projectId = ?', [id]);
    const [bids] = await pool.execute(
      'SELECT b.*, u.companyName FROM bids b JOIN users u ON b.userId = u.id WHERE b.projectId = ?',
      [id]
    );
    
    res.json({ ...projects[0], requirements, bids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, abc, location, deadline, category, requirements } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, abc, location, deadline, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, abc, location, deadline, category]
    );
    
    const projectId = result.insertId;
    
    if (requirements && requirements.length > 0) {
      for (const req of requirements) {
        await pool.execute(
          'INSERT INTO project_requirements (name, description, required, projectId) VALUES (?, ?, ?, ?)',
          [req.name, req.description, req.required !== false ? 1 : 0, projectId]
        );
      }
    }
    
    const [project] = await pool.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    const [projectRequirements] = await pool.execute('SELECT * FROM project_requirements WHERE projectId = ?', [projectId]);
    
    res.status(201).json({ ...project[0], requirements: projectRequirements });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, abc, location, deadline, status, category } = req.body;
    
    await pool.execute(
      'UPDATE projects SET title = ?, description = ?, abc = ?, location = ?, deadline = ?, status = ?, category = ? WHERE id = ?',
      [title, description, abc, location, deadline, status, category, id]
    );
    
    const [project] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(project[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM project_requirements WHERE projectId = ?', [id]);
    await pool.execute('DELETE FROM bids WHERE projectId = ?', [id]);
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ========== BID ROUTES ==========
app.get('/api/bids', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/bids - User:', req.user.email, 'Role:', req.user.role);
    
    // If admin, return all bids with user info
    if (req.user.role === 'Admin') {
      console.log('Admin query - fetching all bids');
      const [bids] = await pool.execute(
        'SELECT b.*, p.title as projectTitle, p.abc as projectAbc, u.companyName, u.email as bidderEmail FROM bids b JOIN projects p ON b.projectId = p.id JOIN users u ON b.userId = u.id'
      );
      console.log('Admin query returned', bids.length, 'bids');
      return res.json(bids);
    }
    
    // If regular user, return only their bids
    console.log('User query - fetching bids for userId:', req.user.userId);
    const [bids] = await pool.execute(
      'SELECT b.*, p.title as projectTitle, p.abc as projectAbc FROM bids b JOIN projects p ON b.projectId = p.id WHERE b.userId = ?',
      [req.user.userId]
    );
    console.log('User query returned', bids.length, 'bids');
    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

app.get('/api/bids/project/:projectId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const [bids] = await pool.execute(
      'SELECT b.*, u.companyName, u.verificationStatus as userVerificationStatus FROM bids b JOIN users u ON b.userId = u.id WHERE b.projectId = ?',
      [projectId]
    );
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

app.post('/api/bids', authenticateToken, async (req, res) => {
  try {
    const { projectId, bidAmount, notes } = req.body;
    
    const [users] = await pool.execute('SELECT verificationStatus FROM users WHERE id = ?', [req.user.userId]);
    if (users[0].verificationStatus !== 'Verified') {
      return res.status(403).json({ error: 'Account must be verified to place bids' });
    }
    
    const [projects] = await pool.execute('SELECT status FROM projects WHERE id = ?', [projectId]);
    if (projects.length === 0 || projects[0].status !== 'Open') {
      return res.status(400).json({ error: 'Project is not open for bidding' });
    }
    
    const [existingBids] = await pool.execute('SELECT * FROM bids WHERE userId = ? AND projectId = ?', [req.user.userId, projectId]);
    if (existingBids.length > 0) {
      return res.status(400).json({ error: 'You have already placed a bid on this project' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO bids (bidAmount, notes, userId, projectId) VALUES (?, ?, ?, ?)',
      [bidAmount, notes, req.user.userId, projectId]
    );
    
    const [bid] = await pool.execute(
      'SELECT b.*, p.title as projectTitle FROM bids b JOIN projects p ON b.projectId = p.id WHERE b.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(bid[0]);
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ error: 'Failed to create bid' });
  }
});

app.put('/api/bids/:id/award', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [bids] = await pool.execute('SELECT * FROM bids WHERE id = ?', [id]);
    if (bids.length === 0) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    
    const bid = bids[0];
    
    await pool.execute('UPDATE bids SET bidStatus = ?, complianceStatus = ? WHERE id = ?', ['Won', 'Compliant', id]);
    await pool.execute('UPDATE projects SET status = ? WHERE id = ?', ['Closed', bid.projectId]);
    await pool.execute('UPDATE bids SET bidStatus = ? WHERE projectId = ? AND id != ?', ['Lost', bid.projectId, id]);
    
    const [updatedBid] = await pool.execute('SELECT * FROM bids WHERE id = ?', [id]);
    res.json({ message: 'Bid awarded successfully', bid: updatedBid[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to award bid' });
  }
});

app.put('/api/bids/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE bids SET bidStatus = ? WHERE id = ?', ['Lost', id]);
    const [bid] = await pool.execute('SELECT * FROM bids WHERE id = ?', [id]);
    res.json({ message: 'Bid rejected', bid: bid[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject bid' });
  }
});

// Seed data endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Insert or update admin
    await pool.execute(
      'INSERT INTO users (id, email, password, companyName, role, verificationStatus) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [1, 'admin@constra.com', adminPassword, 'Constra Admin', 'Admin', 'Verified', adminPassword]
    );

    // Insert or update user
    await pool.execute(
      'INSERT INTO users (id, email, password, companyName, businessType, dtiRegistration, tinNumber, businessAddress, phoneNumber, role, verificationStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [2, 'user@constra.com', userPassword, 'ABC Construction Corp', 'Construction & Engineering', 'DTI-123456-2024', '123-456-789-000', '123 Main Street, Makati City, Metro Manila, Philippines', '+63 912 345 6789', 'User', 'Verified', userPassword]
    );

    await pool.execute(
      'INSERT IGNORE INTO projects (id, title, description, abc, location, deadline, status, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [1, 'Highway Expansion Project', 'Expansion of the North Luzon Expressway to accommodate increased traffic volume.', 50000000, 'Metro Manila', '2024-12-31', 'Open', 'Infrastructure']
    );

    await pool.execute(
      'INSERT IGNORE INTO projects (id, title, description, abc, location, deadline, status, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [2, 'School Building Construction', 'Construction of a 3-story school building with 24 classrooms.', 25000000, 'Cebu City', '2024-11-30', 'Open', 'Education']
    );

    res.json({ 
      message: 'Database seeded successfully', 
      admin: { email: 'admin@constra.com', password: 'admin123' },
      user: { email: 'user@constra.com', password: 'user123' }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Seeding failed' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: 'Database connection failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`MySQL Database: ${process.env.DB_NAME || 'constra'}`);
});
