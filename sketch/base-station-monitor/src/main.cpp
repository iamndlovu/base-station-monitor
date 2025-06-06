#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include <NewPing.h>
#include <ArduinoJson.h>
#include <math.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <NewPing.h>
#include <Adafruit_INA219.h>

// Base class for analog constants
class AnalogConstants {
  public:
    int h;
    int hh;
    int l;
    int ll;
    int max;
    int min;
  
    AnalogConstants(int h, int hh, int l, int ll, int max, int min)
      : h(h), hh(hh), l(l), ll(ll), max(max), min(min) {}
  };
  

#define GENERATOR_RUNNING_PIN  15 // Pin to check if the generator is running
#define UPS_RUNNING_PIN  19 // Pin to check if the UPS is running
#define FAN_RUNNING_PIN  2 // Pin to check if the fan is running
#define SIGNAL_STRENGTH_PIN  34 // Pin to read the signal strength

#define fullTankPingVal_cm 3 // Distance in cm when the tank is full
#define emptyTankPingVal_cm 25 // Distance in cm when the tank is empty
#define MAX_BATTERY_MV 3000 // Maximum battery voltage in mV
#define MIN_BATTERY_MV 142 // Minimum battery voltage in mV
#define MAX_SIGNAL_STRENGTH_MV 3100 // Maximum signal strength in mV
#define MIN_SIGNAL_STRENGTH_MV 142 // Minimum signal strength in mV
// Power measurements
float busvoltage = 0;
float current_mA = 0;
float power_mW = 0;
unsigned long lastSampleTime = 0;
const float BATTERY_CAPACITY_MAH = 3000.0;
const float VOLTAGE_FULL_CHARGE = 3.4; // Voltage when battery is considered 100% full
const float VOLTAGE_EMPTY = 1.9; // Voltage when battery is considered empty
const unsigned long SAMPLE_INTERVAL_MS = 1500;
float current_mAh = 0.0;    // Accumulated charge/discharge in mAh (Represents remaining capacity)
float battery_percentage = 0.0;

// Derived objects for specific constants
AnalogConstants temperatureConstants(27, 32, 18, 13, 50, 0);

// WIFI CREDENTIALS
const char* ssid = "iPhone";
const char* password = "jamesjay";

String serverAddress = "172.20.10.6";  // IP address of the server
String port = "5000";
String endpoint = "/data/add";

WiFiMulti wifiMulti;
HTTPClient client;


Adafruit_INA219 ina219;

/*********************************************************************
 *                                                                   *
 *             DS18B20 Temperature Sensor                            *
 *                                                                   *
 *********************************************************************/
// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;     
// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);
// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

/*********************************************************************
 *                                                                   *
 *                    Ultrasonic Sensor                              *
 *                                                                   *
 *********************************************************************/
#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     13  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.


NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.

int sendInfo(int tempVal, bool fan, int batteryLevel, bool ups, int fuelLevel, bool generator, int signalStrength);
void measurePowerValues();

void setup() {
  // Set the GPIO pins to input mode
  pinMode(GENERATOR_RUNNING_PIN, INPUT);
  pinMode(UPS_RUNNING_PIN, INPUT);
  pinMode(FAN_RUNNING_PIN, OUTPUT);
  pinMode(SIGNAL_STRENGTH_PIN, INPUT);
  pinMode(35, INPUT);

  // Fan initially OFF
  digitalWrite(FAN_RUNNING_PIN, HIGH);

  // Start the Serial Monitor
  Serial.begin(9600);
  while (!Serial) { delay(100); }

  Serial.println("Initializing");
  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Connecting to ");
  Serial.println(ssid);
  wifiMulti.addAP(ssid, password);

  while ((wifiMulti.run() != WL_CONNECTED)) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("\n\n******************************************************\n\n");
  // Start the DS18B20 sensor
  sensors.begin();

  // if (!ina219.begin())
  // {
  //   Serial.println("\n\nFailed to find INA219 module");
  //   while (1)
  //   {
  //     delay(10);
  //   }
  // }

  battery_percentage = 100.0;
  current_mAh = BATTERY_CAPACITY_MAH;
  lastSampleTime = millis();
}

void loop() {
  // Check if the WiFi is connected
  if ((wifiMulti.run() != WL_CONNECTED)) {
    Serial.println();
    Serial.println("WiFi disconnected, trying to reconnect.");
    wifiMulti.addAP(ssid, password);

    while ((wifiMulti.run() != WL_CONNECTED)) {
      delay(100);
      Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("******************************************************\n\n");
  }
  // Read the battery level
  // measurePowerValues();

  // Request temperature from the DS18B20 sensor
  sensors.requestTemperatures(); 
  float temperatureC = sensors.getTempCByIndex(0);
  Serial.print("\n\n\n\nTemperature: ");
  Serial.print(temperatureC);
  Serial.println("ºC");

  if (temperatureC < temperatureConstants.h) {
    digitalWrite(FAN_RUNNING_PIN, LOW); // Turn OFF the fan
  } else {
    digitalWrite(FAN_RUNNING_PIN, HIGH); // Turn ON the fan
  }

  // Request distance from the ultrasonic sensor
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  if (level > 110) {
    level = 0;
  }
  // Print the level
  Serial.print("Level: ");
  Serial.print(level);
  Serial.println(" %");
  
// Read the battery voltage
  battery_percentage = map(analogReadMilliVolts(35), MIN_BATTERY_MV, MAX_BATTERY_MV, 0, 100);
  if (battery_percentage > 100) {
    battery_percentage = 100;
  }
  Serial.print("battery: ");
  Serial.print(battery_percentage);
  Serial.println(" %");

  // Read the signal strength
  int signalMV = analogReadMilliVolts(SIGNAL_STRENGTH_PIN);
  int signalStrength = map(signalMV, MIN_SIGNAL_STRENGTH_MV, MAX_SIGNAL_STRENGTH_MV, 0, 100);
  if (signalStrength > 100) {
    signalStrength = 100;
  }
  Serial.print("Signal Strength: ");
  Serial.print(signalMV);
  Serial.print(" mV, ");
  Serial.print(signalStrength);
  Serial.println(" %");

  // Read the generator status
  bool generatorRunning = digitalRead(GENERATOR_RUNNING_PIN);
  Serial.print("Generator Running: ");
  Serial.println(generatorRunning ? "Yes" : "No");
  // Read the UPS status
  bool upsRunning = digitalRead(UPS_RUNNING_PIN);
  Serial.print("UPS Running: ");
  Serial.println(upsRunning ? "Yes" : "No");
  // Read the fan status
  bool fanRunning = digitalRead(FAN_RUNNING_PIN);
  Serial.print("Fan Running: ");
  Serial.println(fanRunning ? "Yes" : "No");

  // send data to the server
  int httpCode = sendInfo(temperatureC, fanRunning, battery_percentage, upsRunning, level, generatorRunning, signalStrength);
  // Wait before the next loop
  Serial.println("Waiting for 2 seconds...");
  delay(2000);
}

void measurePowerValues()
{
  unsigned long currentTime = millis();
  busvoltage = ina219.getBusVoltage_V();
  current_mA = ina219.getCurrent_mA();
  power_mW = ina219.getPower_mW();

  float charge_delta_mAh = (current_mA * (currentTime - lastSampleTime)) / 3600000.0;
  
  // Update the remaining capacity (current_mAh)
  current_mAh += charge_delta_mAh;

  // Ensure current_mAh stays within the valid range (0 to BATTERY_CAPACITY_MAH)
  current_mAh = constrain(current_mAh, 0.0, BATTERY_CAPACITY_MAH);

  battery_percentage = (current_mAh / BATTERY_CAPACITY_MAH) * 100.0;

  // --- 4. Simple Voltage-based Correction ---
    // This helps correct for accumulated drift in coulomb counting, especially at known states.
    // Only apply correction if the battery voltage is very close to the full or empty threshold.
    // Add a small buffer (e.g., 0.05V) to prevent constant toggling near the threshold.
    if (busvoltage >= (VOLTAGE_FULL_CHARGE - 0.05)) { // If voltage is near full charge
      // Assume it's 100% and reset coulomb counter
      battery_percentage = 100.0;
      current_mAh = BATTERY_CAPACITY_MAH;
    } else if (busvoltage <= (VOLTAGE_EMPTY + 0.05)) { // If voltage is near empty
      // Assume it's 0% and reset coulomb counter
      battery_percentage = 0.0;
      current_mAh = 0.0;
    }


  lastSampleTime = currentTime;
}

int sendInfo(int tempVal, bool fan, int batteryLevel, bool ups, int fuelLevel, bool generator, int signalStrength){
  Serial.println("Sending data...");
  // Serial.println("\nWait 10 seconds\n\n");
  // delay(5000);
  JsonDocument sensorDataObject;
  JsonDocument temperatureObject;
  JsonDocument batteryObject;
  JsonDocument fuelObject;
  JsonDocument signalObject;
  
  // TEMPERATURE
  temperatureObject["tempVal"] = tempVal;
  temperatureObject["fan"] = fan;

  //BATTERY
  batteryObject["level"] = batteryLevel;
  batteryObject["ups"] = ups;

  //FUEL
  fuelObject["level"] = fuelLevel;
  fuelObject["generator"] = generator;

  //TRANSMITTED SIGNAL
  signalObject["strength"] = signalStrength;

  // ALL DATA
  sensorDataObject["temperature"] = temperatureObject;
  sensorDataObject["battery"] = batteryObject;
  sensorDataObject["fuel"] = fuelObject;
  sensorDataObject["signal"] = signalObject;

  
  
  // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  // String endpoint = "/data/add";
  client.begin("http://" + serverAddress + ":" + port + endpoint);
  client.addHeader("Content-Type", "application/json");
  client.addHeader("Connection", "close");
  int httpCode = client.POST(sensorDataObjectString);

  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);

    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      String payload = client.getString();
      Serial.println(payload);
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", client.errorToString(httpCode).c_str());
  }

  client.end();

  return httpCode;
}