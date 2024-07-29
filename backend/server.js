const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
};

let pool;

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024 // 3 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

async function initializeDatabase() {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log('Connected to MySQL database');

    // Create jobs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        sector VARCHAR(255),
        date DATE,
        description TEXT,
        experience TEXT,
        details TEXT
      )
    `);
    console.log('Jobs table created or already exists');

    // Create candidates table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        resume VARCHAR(255),
        application_count INT DEFAULT 0
      )
    `);
    console.log('Candidates table created or already exists');

    // Create job_applications table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT,
        candidate_id INT,
        application_date DATE,
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(id)
      )
    `);
    console.log('Job applications table created or already exists');

  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all jobs
app.get('/jobs', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const queryParams = [];

    if (req.query.location) {
      query += ' AND location = ?';
      queryParams.push(req.query.location);
    }

    if (req.query.sector) {
      query += ' AND sector = ?';
      queryParams.push(req.query.sector);
    }

    query += ' ORDER BY date DESC';

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Add a new job
app.post('/jobs', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const { title, location, sector, date, description, experience, details } = req.body;
    const [result] = await pool.query(
      'INSERT INTO jobs (title, location, sector, date, description, experience, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, location, sector, date, description, experience, details]
    );
    res.status(201).json({ id: result.insertId, message: 'Job added successfully' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Error adding job' });
  }
});

// Get all candidates
app.get('/candidates', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, CASE WHEN resume IS NOT NULL THEN true ELSE false END AS has_resume, application_count FROM candidates');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Error fetching candidates' });
  }
});


app.post('/candidates', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    let resume = null;

    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Only Gmail addresses are allowed' });
    }
    
    if (req.file) {
      resume = req.file.buffer;
      console.log('File received:', req.file.originalname, 'Size:', req.file.size, 'bytes');
    } else {
      console.log('No file uploaded');
    }

    // Check if candidate with this email already exists
    let [existingCandidate] = await pool.query(
      'SELECT * FROM candidates WHERE email = ?',
      [email]
    );

    if (existingCandidate.length > 0) {
      // Candidate already exists, update their information
      const candidateId = existingCandidate[0].id;
      await pool.query(
        'UPDATE candidates SET name = ?, phone = ?, resume = ? WHERE id = ?',
        [name, phone, resume, candidateId]
      );
      res.status(200).json({ id: candidateId, message: 'Candidate updated successfully' });
    } else {
      // Candidate doesn't exist, create a new one
      const [result] = await pool.query(
        'INSERT INTO candidates (name, email, phone, resume) VALUES (?, ?, ?, ?)',
        [name, email, phone, resume]
      );
      res.status(201).json({ id: result.insertId, message: 'Candidate created successfully' });
    }
  } catch (error) {
    console.error('Error processing candidate:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Resume file size should not exceed 3MB' });
    } else {
      res.status(500).json({ error: 'Error processing candidate', details: error.message });
    }
  }
});



// View a candidate's resume
app.get('/view-resume/:id', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query('SELECT resume FROM candidates WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].resume) {
      const resume = rows[0].resume;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
      res.send(resume);
    } else {
      res.status(404).json({ error: 'Resume not found in database' });
    }
  } catch (error) {
    console.error('Error viewing resume:', error);
    res.status(500).json({ error: 'Error viewing resume', details: error.message });
  }
});

// Apply for a job
app.post('/apply', async (req, res) => {
  try {
    const { job_id, email } = req.body;
    const application_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Start a transaction
    await pool.query('START TRANSACTION');

    // Check if candidate exists
    let [existingCandidate] = await pool.query(
      'SELECT id FROM candidates WHERE email = ?',
      [email]
    );

    let candidate_id;

    if (existingCandidate.length > 0) {
      candidate_id = existingCandidate[0].id;
      
      // Increment the application count for the existing candidate
      await pool.query(
        'UPDATE candidates SET application_count = application_count + 1 WHERE id = ?',
        [candidate_id]
      );
    } else {
      // If candidate doesn't exist, return an error
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Candidate does not exist. Please create a candidate profile first.' });
    }

    // Insert the job application
    const [result] = await pool.query(
      'INSERT INTO job_applications (job_id, candidate_id, application_date) VALUES (?, ?, ?)',
      [job_id, candidate_id, application_date]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json({ id: result.insertId, message: 'Application submitted successfully' });
  } catch (error) {
    // If there's an error, rollback the transaction
    await pool.query('ROLLBACK');
    console.error('Error submitting application:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'You have already applied for this job.' });
    } else {
      res.status(500).json({ error: 'Error submitting application', details: error.message });
    }
  }
});

// Get applications for a specific job
app.get('/jobs/:id/applications', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query(`
      SELECT ja.id, ja.application_date, ja.status, c.name, c.email, c.phone
      FROM job_applications ja
      JOIN candidates c ON ja.candidate_id = c.id
      WHERE ja.job_id = ?
      ORDER BY ja.application_date DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Error fetching job applications' });
  }
});

// Get jobs a candidate has applied to
app.get('/candidates/:email/applications', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query(`
      SELECT j.id, j.title, j.location, j.sector, ja.application_date, ja.status
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN candidates c ON ja.candidate_id = c.id
      WHERE c.email = ?
      ORDER BY ja.application_date DESC
    `, [req.params.email]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching candidate applications:', error);
    res.status(500).json({ error: 'Error fetching candidate applications' });
  }
});

// Get a candidate's resume
app.get('/candidates/:id/resume', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT resume FROM candidates WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].resume) {
      const resumePath = path.join(__dirname, rows[0].resume);
      if (fs.existsSync(resumePath)) {
        res.sendFile(resumePath);
      } else {
        console.error('Resume file not found:', resumePath);
        res.status(404).json({ error: 'Resume file not found' });
      }
    } else {
      res.status(404).json({ error: 'Resume not found in database' });
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Error fetching resume' });
  }
});
// Get unique locations
// Get unique locations
app.get('/locations', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query('SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL AND location != "" ORDER BY location');
    const locations = rows.map(row => row.location);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});

// Get unique sectors
app.get('/sectors', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [rows] = await pool.query('SELECT DISTINCT sector FROM jobs WHERE sector IS NOT NULL AND sector != "" ORDER BY sector');
    const sectors = rows.map(row => row.sector);
    res.json(sectors);
  } catch (error) {
    console.error('Error fetching sectors:', error);
    res.status(500).json({ error: 'Error fetching sectors' });
  }
});
// Add a new job
app.post('/jobs', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const { title, location, sector, date, description, experience, details } = req.body;
    const [result] = await pool.query(
      'INSERT INTO jobs (title, location, sector, date, description, experience, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, location, sector, date, description, experience, details]
    );
    res.status(201).json({ id: result.insertId, message: 'Job added successfully' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Error adding job', details: error.message });
  }
});

const fetchFilters = async () => {
  try {
    const locationsResponse = await fetch(`${API_BASE_URL}/locations`);
    const sectorsResponse = await fetch(`${API_BASE_URL}/sectors`);
    
    if (!locationsResponse.ok) {
      throw new Error(`Failed to fetch locations: ${locationsResponse.status} ${locationsResponse.statusText}`);
    }
    if (!sectorsResponse.ok) {
      throw new Error(`Failed to fetch sectors: ${sectorsResponse.status} ${sectorsResponse.statusText}`);
    }
    
    const locationsData = await locationsResponse.json();
    const sectorsData = await sectorsResponse.json();
    
    setLocations(locationsData);
    setSectors(sectorsData);
  } catch (error) {
    console.error('Error fetching filters:', error);
    setError(`Failed to fetch filters: ${error.message}`);
  }
};
// Get unique cities and sectors
app.get('/filters', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const [cities] = await pool.query('SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL AND location != ""');
    const [sectors] = await pool.query('SELECT DISTINCT sector FROM jobs WHERE sector IS NOT NULL AND sector != ""');
    
    res.json({
      cities: cities.map(row => row.location),
      sectors: sectors.map(row => row.sector)
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Error fetching filters' });
  }
});

// Route to get table names
app.get('/tables', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    // Only return the specific tables we know exist
    res.json(['jobs', 'candidates', 'job_applications']);
  } catch (error) {
    console.error('Error fetching table names:', error);
    res.status(500).json({ error: 'Error fetching table names' });
  }
});

app.get('/tables/:tableName', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const tableName = req.params.tableName;
    
    console.log(`Fetching data for table: ${tableName}`);

    // Fetch all data
    const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
    
    console.log(`Fetched ${rows.length} rows from ${tableName}`);
    console.log('Sample data:', rows.slice(0, 2)); // Log first two rows

    res.json({ allData: rows });
  } catch (error) {
    console.error(`Error fetching details for table ${req.params.tableName}:`, error);
    res.status(500).json({ error: 'Error fetching table details', details: error.message });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});