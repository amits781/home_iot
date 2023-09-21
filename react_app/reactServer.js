const express = require('express');
const serveStatic = require('serve-static');
const winston = require('winston');
const fs = require('fs');


// Delete New Relic agent log files
const newRelicLogPath = './'; // Replace with the actual path
try {
  fs.readdirSync(newRelicLogPath).forEach((file) => {
    console.log('File:',file);
    if (file.startsWith('newrelic_agent.log')) {
      fs.unlinkSync(`${newRelicLogPath}/${file}`);
    }
  });
  console.log('Deleted New Relic agent log files.');
} catch (err) {
  console.error('Error deleting New Relic agent log files:', err);
}

const app = express();
const port = process.env.PORT || 3000;

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set the log level as needed
  format: winston.format.json(), // Log in JSON format
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});

// Middleware to log requests using Winston
app.use((req, res, next) => {
  logger.info(`${req.ip} - [${new Date().toUTCString()}] "${req.method} ${req.url}" ${res.statusCode} - ${res.responseTime} ms`);
  next();
});

// Define a middleware function to set cache control headers to disable caching
function disableCaching(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

// Use the disableCaching middleware for all routes
app.use(disableCaching);

// Serve the static build directory
app.use(serveStatic('build'));

// Health endpoint
app.get('/iot-actuator/health', (req, res) => {
  // You can add more complex health checks here if needed
  const healthStatus = {
    status: 'UP',
    version: '1.0.0',
  };
  res.json(healthStatus);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
