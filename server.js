const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router Paths
let api_toasts = require('./routes/api-toasts.js');    

// Adding Router Paths
app.use(api_toasts);

// Normal API

app.use('/dist', express.static(path.join(__dirname, 'dist'))); // Generated Content
app.use('/src', express.static(path.join(__dirname, 'src'))); // Pages
app.use(express.static(path.join(__dirname, 'public'))); // Images, Videos, Files, etc...

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

app.listen(PORT, () => {
    console.log(`[SYSTEM] GAC-Server läuft auf http://localhost:${PORT}`);
});