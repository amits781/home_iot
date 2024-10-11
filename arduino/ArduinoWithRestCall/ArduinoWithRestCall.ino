#include <WiFiClient.h>
#include <ArduinoHttpClient.h>
#include <WiFiS3.h>
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h" 

#include "network.h"  // Include a header file containing Wifi icons
#include "wifi_cred.h" //Include the wifi secrects

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;  // the WiFi radio's status

// Operation display messages
const char powerOnMessage[] = "Power ON";
const char powerOffMessage[] = "Power OFF";

WiFiServer server(80);
int rssiInt;  // declare the rssiInt  variable for wifi strength

ArduinoLEDMatrix matrix;  // Create an instance of the ArduinoLEDMatrix class

// constants won't change. Used here to set a pin number:
const int powerOnPin = LED_BUILTIN;  // the number of the ON pin
const int powerOffPin = 12;          // the number of the OFF pin

// Variables will change:
int onState = LOW;  // denotes power on status
int offState = HIGH;  // denotes power off status

// Generally, you should use "unsigned long" for variables that hold time
// The value will quickly become too large for an int to store
unsigned long previousMillis = 0;  // will store last time Wifi Status was updated

// constants won't change:
const long wifiUpdateInterval = 20000;  // interval at which to update Wifi (milliseconds)

void setup() {
  // set the digital pin as output:
  pinMode(powerOnPin, OUTPUT);
  pinMode(powerOffPin, OUTPUT);

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  matrix.begin();
  matrix.loadFrame(network[4]);
  while (!Serial) {
    ;  // wait for serial port to connect. Needed for native USB port only
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  Serial.print("You're connected to the network");
  server.begin();
  printWifiDetails();
  printWifiStrength();

  // Initialize power pins
  updatePower();
}

void loop() {

  // listen for incoming clients
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New client connected");
    String currentLine = "";
    boolean currentLineIsBlank = true;

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        currentLine += c;

        // if you've gotten to the end of the line (received a newline character) and the line is blank
        if (c == '\n' && currentLineIsBlank) {
          // Handle different endpoints
          if (currentLine.startsWith("GET /H")) {
            // Endpoint to turn on power
            onState = HIGH;
            offState = LOW;
            updatePower();
            displayText(powerOnMessage);
            sendJsonResponse(client, onState, selectNetworkLevel(rssiInt));
          } else if (currentLine.startsWith("GET /L")) {
            // Endpoint to turn off power
            offState = HIGH;
            onState = LOW;
            updatePower();
            displayText(powerOffMessage);
            sendJsonResponse(client, onState, selectNetworkLevel(rssiInt));
          } else if (currentLine.startsWith("GET /S")) {
            // Endpoint to get power status
            sendJsonResponse(client, onState, selectNetworkLevel(rssiInt));
          } else {
            // Default response for unsupported routes
            client.println("HTTP/1.1 404 Not Found");
            client.println("Content-Type: text/html");
            client.println("Connection: close");
            client.println();
            client.println("<html><body><h1>404 Not Found</h1></body></html>");
          }
          break;
        }

        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        } else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      }
    }
    delay(1);
    client.stop();
    Serial.println("Client disconnected");
  }
  // check to see if it's time to update the Wifi; that is, if the difference
  // between the current time and last time you updated the Wifi is bigger than
  // the interval at which you want to update the Wifi.
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= wifiUpdateInterval) {
    Serial.print("\nUpdating Wifi after: ");
    Serial.print(((currentMillis - previousMillis)/1000));
    Serial.print(" seconds\n");
    // save the last time you updated the Wifi
    previousMillis = currentMillis;
    printWifiStrength();
  }
}

//Funtion to update power pins
void updatePower() {
  digitalWrite(powerOnPin, onState);
  digitalWrite(powerOffPin, offState);
}

void sendJsonResponse(WiFiClient& client, int status, int strength) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();
  client.print("{\"status\": ");
  client.print(status);
  client.print(", \"strength\": ");
  client.print(strength);
  client.println("}");
}

void printWifiDetails() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  // Create a char array to store the IP address as a string
  char ipStr[16];  // IP addresses are up to 15 characters long (xxx.xxx.xxx.xxx) + 1 for null terminator
  sprintf(ipStr, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);
  char ipMessage[30];
  snprintf(ipMessage, sizeof(ipMessage), "%s%s", "IP:", ipStr);
  displayText(ipMessage);

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  printMacAddress(mac);
}

void printWifiStrength() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  rssiInt = (int)rssi;
  Serial.print("Signal strength (RSSI): ");
  Serial.println(rssiInt);
  displayWifiStrength(rssiInt);
  

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type: ");
  Serial.println(encryption, HEX);
  Serial.println();
}

// Select level for wich wifi bar displays
int selectNetworkLevel(int signalStrength) {
  if (signalStrength <= -90) {
    return 4;
  } else if (signalStrength <= -80) {
    return 0;
  } else if (signalStrength <= -70) {
    return 1;
  } else if (signalStrength <= -67) {
    return 2;
  } else {
    return 3;
  }
}

void printMacAddress(byte mac[]) {
  for (int i = 0; i < 6; i++) {
    if (i > 0) {
      Serial.print(":");
    }
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
  }
  Serial.println();
}

// Function to display wifi bars on Matrix LED
void displayWifiStrength(int rssiInt){
  int wifiFrame = selectNetworkLevel(rssiInt);
  Serial.print("Wifi Strength: ");
  Serial.println(wifiFrame);
  matrix.loadFrame(network[wifiFrame]);
}

// Function to display scrolling text on Matrix LED
void displayText(const char* textToPrint) {
  matrix.beginDraw();

  matrix.stroke(0xFFFFFFFF);
  matrix.textScrollSpeed(50);
  const char textScr[] = "    ";
  char text[100];
  snprintf(text, sizeof(text), "%s%s%s", textScr, textToPrint, textScr);
  Serial.println("Matrix Text to print:");
  Serial.println(text);
  matrix.textFont(Font_5x7);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(text);
  matrix.endText(SCROLL_LEFT);

  matrix.endDraw();

  // Display Wifi strength 
  displayWifiStrength(rssiInt);
}
