// SGPA System - Node.js Backend Server
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Data directory
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
    await ensureDataDir();

    const files = {
        'users.json': [],
        'subjects.json': {},
        'marks.json': {}
    };

    for (const [filename, defaultData] of Object.entries(files)) {
        const filepath = path.join(DATA_DIR, filename);
        try {
            await fs.access(filepath);
        } catch {
            await fs.writeFile(filepath, JSON.stringify(defaultData, null, 2));
            console.log(`Created ${filename}`);
        }
    }
}

// Read JSON file
async function readJSONFile(filename) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return filename === 'users.json' ? [] : {};
    }
}

// Write JSON file
async function writeJSONFile(filename, data) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
    const users = await readJSONFile('users.json');
    res.json(users);
});

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const users = await readJSONFile('users.json');
        const { usn, password, name, academicYear, semester, role } = req.body;

        // Check if user already exists
        if (users.find(u => u.usn === usn)) {
            return res.status(400).json({ error: 'USN already registered' });
        }

        // Create new user
        const newUser = {
            usn,
            password,
            name,
            academicYear,
            semester,
            role,
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeJSONFile('users.json', users);

        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const users = await readJSONFile('users.json');
        const { usn, password } = req.body;

        const user = users.find(u => u.usn === usn && u.password === password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user subjects
app.get('/api/subjects/:usn', async (req, res) => {
    try {
        const subjects = await readJSONFile('subjects.json');
        const userSubjects = subjects[req.params.usn] || [];
        res.json(userSubjects);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Save user subjects
app.post('/api/subjects/:usn', async (req, res) => {
    try {
        const subjects = await readJSONFile('subjects.json');
        subjects[req.params.usn] = req.body;
        await writeJSONFile('subjects.json', subjects);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user marks
app.get('/api/marks/:usn', async (req, res) => {
    try {
        const marks = await readJSONFile('marks.json');
        const userMarks = marks[req.params.usn] || {};
        res.json(userMarks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Save user marks
app.post('/api/marks/:usn', async (req, res) => {
    try {
        const marks = await readJSONFile('marks.json');
        marks[req.params.usn] = req.body;
        await writeJSONFile('marks.json', marks);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Download all data
app.get('/api/download', async (req, res) => {
    try {
        const users = await readJSONFile('users.json');
        const subjects = await readJSONFile('subjects.json');
        const marks = await readJSONFile('marks.json');

        const data = {
            users,
            subjects,
            marks,
            exportedAt: new Date().toISOString()
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
async function startServer() {
    await initializeDataFiles();
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     SGPA Prediction System - Server Running               ║
║                                                            ║
║     Server URL: http://localhost:${PORT}                      ║
║     Data stored in: ${DATA_DIR}                    ║
║                                                            ║
║     Open your browser and go to:                          ║
║     http://localhost:${PORT}/index.html                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
}

startServer();
