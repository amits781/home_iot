# dummy_arduino

A dependency-free mock of the real Arduino device that
`spring_boot_service` talks to (`ARDUINO_HOST` in
`MotorConstants.java`), for running/testing the backend locally
without the physical device on the network.

Mirrors the real device's response shape exactly (see
`arduino/ArduinoWithRestCall/ArduinoWithRestCall.ino`):

| Route | Effect     | Response                          |
|-------|------------|------------------------------------|
| `GET /H` | turn on  | `{"status": 1, "strength": 1}` |
| `GET /L` | turn off | `{"status": 0, "strength": 1}` |
| `GET /S` | status   | `{"status": <last H/L state>, "strength": 1}` |

State is in-memory only (resets to `status: 0` on restart).

The three device routes answer after a ~2s delay, since the real
board replies over wifi and an instant localhost reply makes the
UI's in-flight states (disabled buttons, the card's loading
hairline) flash by too fast to see or test. State changes apply
immediately; only the reply is held back. Override or disable it
with `RESPONSE_DELAY_MS`:

```
RESPONSE_DELAY_MS=0 node server.js     # answer immediately
RESPONSE_DELAY_MS=5000 node server.js  # slow device
```

Well inside the Spring Boot service's 10s REST timeout
(`REST_TIMEOUT` in `config/AppConfigurations.java`).

## Run

```
node server.js
```

or

```
npm start
```

Listens on `http://localhost:8081` by default; override with `PORT`:

```
PORT=9000 node server.js
```

## Pointing the Spring Boot service at it

`ARDUINO_HOST` is currently a hardcoded constant, not an env var
(`spring_boot_service/src/main/java/com/aidyn/iot/utils/MotorConstants.java`).
To test against this mock, temporarily change it to
`http://localhost:8081` (or your chosen `PORT`) before running the
service locally, then change it back before committing/deploying.
