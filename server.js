require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, script.js, styles.css, images)
app.use(express.static(path.join(__dirname)));

// Suppress favicon 404 error in console
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Define Rate Limiters (Resilience Layer)
const statusLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 200, // 200 requests per minute for high-frequency status checks
    message: {
        status: 'failed',
        reason: 'system_overload',
        message: 'Security protocol: Too many requests detected from this uplink.',
        re_auth_required: true
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware for request logging (observability)
app.use((req, res, next) => {
    console.log(`[STARK_GATEWAY] ${new Date().toISOString()} | ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Server initialized with Firebase-first architecture
const PORT = process.env.PORT || 3000;

// Firebase Migration: Static File Hosting & Status
app.get('/api/nexus/status', statusLimiter, (req, res) => {
    res.json({ 
        status: 'online', 
        core: 'FIREBASE_NEXUS_v1', 
        timestamp: new Date().toISOString(),
        load_balancing: 'active',
        security_level: 'BLUE'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[SERVER] Unhandled Exception:', err);
    res.status(500).json({ 
        status: 'failed', 
        reason: 'internal_server_error', 
        message: err.message 
    });
});

app.listen(PORT, () => {
    console.log(`[STARK_MAINFRAME] Resilient Backend active on http://localhost:${PORT}`);
});
