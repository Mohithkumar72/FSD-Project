const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');
const equipmentRoutes = require('./routes/equipmentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const metadataRoutes = require('./routes/metadataRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'College Laboratory Equipment Management System API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', metadataRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`[Server] Laboratory Management API running on http://localhost:${PORT}`);
  });
}

startServer();
