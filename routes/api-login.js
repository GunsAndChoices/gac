const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const db = new Database('gac_users.db');

router.use(session({
    secret: 'gac-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        maxAge: 3600000
    }
}));

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
};


router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username);

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'ZUGRIFF VERWEIGERT: Daten ungültig' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'SYSTEMFEHLER' });
    }
});

router.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'FEHLER: Felder leer' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = stmt.run(username, hashedPassword);
        
        // AUTO-LOGIN nach Erfolg
        req.session.userId = result.lastInsertRowid;
        req.session.username = username;

        return res.json({ success: true });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ success: false, message: 'FEHLER: Identität existiert bereits' });
        }
        return res.status(500).json({ success: false, message: 'SYSTEMFEHLER' });
    }
});

router.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/api/me', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Nicht eingeloggt' });
    res.json({ username: req.session.username });
});

module.exports = router;