const express = require('express');
const path = require('path');
const logger = require('./logger'); // Logger importieren
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Automatisches Logging für JEDEN Request und Status-Code
app.use((req, res, next) => {
    res.on('finish', () => {
        const logEntry = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} (IP: ${req.ip})`;
        if (res.statusCode >= 500) {
            logger.error(logEntry);
        } else if (res.statusCode >= 400) {
            logger.warn(logEntry);
        } else {
            logger.info(logEntry);
        }
    });
    next();
});

// Router Paths
let api_toasts = require('./routes/api-toasts.js');
let api_login = require('./routes/api-login.js');

// Adding Router Paths
app.use(api_toasts);
app.use(api_login);

// Normal API / Static Files
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login-stuff', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login-stuff', 'register.html'));
});

app.get('/_l/load', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login-stuff', 'loading.html'));
});

// 404-Handling (Wenn keine Route oben zutrifft)
app.use((req, res) => {
    logger.warn(`404 NOT FOUND: ${req.method} @ ${req.originalUrl}`);
    res.sendFile(path.join(__dirname, 'src', '404.html'));
});

app.listen(PORT, () => {
    logger.info(`[SYSTEM] GAC-Server läuft auf http://localhost:${PORT}`);
});