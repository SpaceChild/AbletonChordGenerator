const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const winston = require('winston');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
const chordRoutes = require('./routes/chords');
app.use('/api/chords', chordRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    node: process.version,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🎵 Ableton Chord Generator running on http://localhost:${PORT}`);
  logger.info(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
  logger.info(`🐍 Python script location: ${path.join(__dirname, '../python')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
