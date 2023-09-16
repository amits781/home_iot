const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Define a custom format for logging
morgan.token('request-ip', (req) => req.ip);

// Use morgan middleware to log requests
app.use(
  morgan(
    ':request-ip - [:date[clf]] ":method :url" :status - :response-time ms'
  )
);

// Define a middleware function to set cache control headers to disable caching
function disableCaching(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

// Use the disableCaching middleware for all routes
app.use(disableCaching);

// Serve the static build directory
app.use(serveStatic('build'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
