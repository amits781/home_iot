const express = require('express');
const winston = require('winston');
const fs = require('fs');
const cors = require('cors');
require('newrelic');

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set the log level as needed
  format: winston.format.json(), // Log in JSON format
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});

// Delete New Relic agent log files
const newRelicLogPath = './'; // Replace with the actual path
try {
  fs.readdirSync(newRelicLogPath).forEach((file) => {
    if (file.startsWith('newrelic_agent.log')) {
      fs.unlinkSync(`${newRelicLogPath}/${file}`);
    }
  });
  logger.info('Deleted New Relic agent log files.');
} catch (err) {
  logger.error('Error deleting New Relic agent log files:', err);
}

const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Create a CORS configuration for the specific endpoint
const corsOptions = {
  origin: '*', // Allow all origins
  // You can also use more specific options if needed
};

// Middleware to log requests using Winston
app.use((req, res, next) => {
  const currentTime = new Date().toUTCString();
  const logData = {
    ip: req.ip,
    timestamp: currentTime,
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${res.responseTime} ms`
  };

  logger.info("Request Log - IP: " + logData.ip + ", URL: " + logData.url + ", Status Code: " + logData.statusCode, logData);
  next();
});

// Define a middleware function to set cache control headers to disable caching
function disableCaching(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

// Use the disableCaching middleware for all routes
app.use(disableCaching);

app.use(express.static(path.join(__dirname, 'build')));



// Health endpoint
app.get('/iot-actuator/health', cors(corsOptions), (req, res) => {
  // You can add more complex health checks here if needed
  const healthStatus = {
    status: 'UP',
    version: '2.0.0',
  };
  res.json(healthStatus);
});

// Handle all other routes and redirect to your React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
