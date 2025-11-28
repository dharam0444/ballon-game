const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from current directory

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database Setup
const db = new sqlite3.Database('./game.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        place TEXT,
        age INTEGER,
        gender TEXT,
        high_score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// API Endpoints

// Register or Update User
app.post('/api/user', (req, res) => {
    const { name, place, age, gender } = req.body;
    
    // Check if user exists (simple check by name for this game)
    db.get(`SELECT * FROM players WHERE name = ?`, [name], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            // User exists, return their data
            res.json({ message: 'Welcome back!', player: row });
        } else {
            // Create new user
            const stmt = db.prepare(`INSERT INTO players (name, place, age, gender, high_score) VALUES (?, ?, ?, ?, 0)`);
            stmt.run(name, place, age, gender, function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ 
                    message: 'Player registered!', 
                    player: { id: this.lastID, name, place, age, gender, high_score: 0 } 
                });
            });
            stmt.finalize();
        }
    });
});

// Update Score
app.post('/api/score', (req, res) => {
    const { id, score } = req.body;
    
    db.get(`SELECT high_score FROM players WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row && score > row.high_score) {
            db.run(`UPDATE players SET high_score = ? WHERE id = ?`, [score, id], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'New high score!', newHighScore: score });
            });
        } else {
            res.json({ message: 'Score updated (not a high score)', currentHighScore: row ? row.high_score : 0 });
        }
    });
});

// Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const sql = `SELECT name, place, high_score FROM players ORDER BY high_score DESC LIMIT 10`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
