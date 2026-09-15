// Dummy stand-in for the real Arduino device (ARDUINO_HOST in
// spring_boot_service's MotorConstants.java) so the Spring Boot service can
// be run and exercised locally without physical hardware on the network.
//
// Mirrors the real device's three routes and JSON response shape exactly
// (see arduino/ArduinoWithRestCall/ArduinoWithRestCall.ino -> sendJsonResponse):
//   GET /H -> turn on,  responds { "status": 1, "strength": 1 }
//   GET /L -> turn off, responds { "status": 0, "strength": 1 }
//   GET /S -> status,   responds { "status": <last H/L state>, "strength": 1 }
//
// No dependencies (plain Node http) so it runs with just `node server.js`.

const http = require('http');

const PORT = process.env.PORT || 8081;
const STRENGTH = 1; // fixed dummy wifi strength, matches all three real responses

// In-memory device state, defaults to "off" like the real board does on boot
// (onState = LOW in the .ino until an /H call).
let lastStatus = 0;

function sendJson(res, body) {
  const json = JSON.stringify(body);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(json);
  return json;
}

const server = http.createServer((req, res) => {
  const path = (req.url || '').split('?')[0];
  let responseBody;

  switch (path) {
    case '/H':
      lastStatus = 1;
      responseBody = sendJson(res, { status: lastStatus, strength: STRENGTH });
      break;
    case '/L':
      lastStatus = 0;
      responseBody = sendJson(res, { status: lastStatus, strength: STRENGTH });
      break;
    case '/S':
      responseBody = sendJson(res, { status: lastStatus, strength: STRENGTH });
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<html><body><h1>404 Not Found</h1></body></html>');
      responseBody = '404';
  }

  console.log(`${new Date().toISOString()} ${req.method} ${req.url} -> ${responseBody}`);
});

server.listen(PORT, () => {
  console.log(`Dummy Arduino device listening on http://localhost:${PORT}`);
  console.log('Routes: GET /H (on), GET /L (off), GET /S (status)');
});
