# Software Requirements Specification (SRS)
# SILO – Smart Storage for Safer Harvests.

**Version:** 1.0  
**Platform:** Web Dashboard  
**Theme:** Smart Agriculture / Postharvest Storage

---

# 1. Introduction

## 1.1 Purpose
**SILO (Smart Storage for Safer Harvests)** is a web-based monitoring system for postharvest grain storage. The system receives sensor data from an ESP32 installed inside a storage bin and visualizes environmental conditions that influence mold growth and grain quality.

The dashboard helps warehouse operators monitor storage conditions in real time, receive alerts, and remotely control ventilation equipment.

## 1.2 Scope

The system monitors:

- Temperature (SHT31)
- Relative Humidity (SHT31)
- VOC / Air Quality (BME688)
- CO₂ Concentration (MH-Z19B)
- Grain Moisture Content
- Fan/Dehumidifier Status (Relay)
- Warning Indicator (LED Green, Yellow, Red)

The system does **not** directly detect mold or aflatoxin. It predicts storage risk based on sensor readings.

---

# 2. Users

| Role | Description |
|------|-------------|
| Warehouse Operator | Monitors storage condition and receives alerts. |
| Warehouse Manager | Views historical data, exports reports, and manages thresholds. |

---

# 3. System Architecture

```text
Sensors
│
├── SHT31
├── BME688
├── MH-Z19B
├── Grain Moisture Sensor
│
▼
ESP32
│
WiFi
│
Backend API
│
Database
│
Web Dashboard
```

---

# 4. Functional Requirements

## Dashboard

Display:

- Current Storage Status
- Mold Risk
- Fan Status
- Last Update

### Dummy Example

| Parameter | Value | Status |
|-----------|------:|--------|
| Temperature | 30.6 °C | High |
| Humidity | 82 %RH | High |
| VOC Index | 182 IAQ | Moderate |
| CO₂ | 780 ppm | Normal |
| Grain Moisture | 15.4 % | Warning |
| Mold Risk | 74 % | High |
| Fan | ON | Running |
| LED | Yellow | Warning |

---

## Sensor Monitoring

Live cards:

- Temperature
- Humidity
- VOC
- CO₂
- Grain Moisture

Refresh every 5 seconds.

---

## Trend Charts

Show:

- Temperature (24 hours)
- Humidity (24 hours)
- Grain Moisture (7 days)
- CO₂ Trend
- Mold Risk Trend

---

## Alert System

Conditions:

| Condition | Alert |
|-----------|-------|
| RH > 75% | High Humidity |
| Temperature > 30°C | High Temperature |
| Grain Moisture > 14% | Drying Recommended |
| Mold Risk > 70% | High Risk |

Notification:

> High mold growth risk detected. Turn on ventilation immediately.

---

## Automatic Control

If Mold Risk ≥ 70%

- Relay ON
- Fan ON
- Yellow LED

If Mold Risk ≥ 90%

- Relay ON
- Fan ON
- Red LED
- Critical notification

If Mold Risk < 50%

- Fan OFF
- Green LED

---

## Historical Data

Filter:

- Today
- 7 Days
- 30 Days
- Custom Date

Export:

- CSV
- PDF

---

# 5. Non-Functional Requirements

## Performance

- Dashboard response < 2 seconds
- Sensor update every 5 seconds
- Support minimum 10 simultaneous users

## Security

- Login authentication
- HTTPS
- Role-based access

## Availability

- 24/7 monitoring
- Automatic reconnection if ESP32 disconnects

---

# 6. User Interface

## Home Dashboard

```
+------------------------------------------------+
| SILO – Smart Storage for Safer Harvests 🌾                           |
+------------------------------------------------+
| Storage Status : HIGH RISK                     |
| Mold Risk      : 74%                           |
| Fan            : ON                            |
+------------------------------------------------+

Temperature      30.6°C

Humidity         82%

VOC              182 IAQ

CO₂              780 ppm

Grain Moisture   15.4%

LED Indicator    🟡

+------------------------------------------------+

Temperature Chart

Humidity Chart

Moisture Chart

Mold Risk Chart

+------------------------------------------------+
```

Primary colors:

- Leaf Green (#2E7D32)
- Light Green (#81C784)
- Earth Brown (#6D4C41)
- Cream Background (#F8F5E9)

Icons:

- 🌾 Grain
- 🌡 Temperature
- 💧 Humidity
- 🌬 Air
- 🍃 Air Quality

---

# 7. Database (Example)

## storage_readings

| Field | Type |
|------|------|
| id | UUID |
| timestamp | DATETIME |
| temperature | FLOAT |
| humidity | FLOAT |
| voc | FLOAT |
| co2 | INT |
| grain_moisture | FLOAT |
| mold_risk | FLOAT |

## device_status

| Field | Type |
|------|------|
| relay | BOOLEAN |
| fan | BOOLEAN |
| led | VARCHAR |
| last_update | DATETIME |

---

# 8. Dummy Dataset

| Time | Temp | RH | VOC | CO₂ | Moisture | Mold Risk |
|------|-----:|---:|----:|----:|---------:|----------:|
| 08:00 | 28.4 | 68 | 120 | 620 | 12.8 | 22 |
| 10:00 | 29.8 | 73 | 138 | 650 | 13.2 | 36 |
| 12:00 | 30.6 | 82 | 182 | 780 | 15.4 | 74 |
| 14:00 | 31.0 | 85 | 195 | 820 | 15.8 | 82 |

---

# 9. Future Enhancements

- AI-based Mold Risk Prediction
- Mobile Application
- SMS / WhatsApp Alerts
- Multi-Warehouse Monitoring
- Weather API Integration
- Grain-specific Threshold Profiles (Corn, Rice, Coffee)

---

# 10. Success Criteria

- Sensor data displayed correctly.
- Alerts generated when thresholds are exceeded.
- Relay activates automatically during high-risk conditions.
- Historical data can be viewed and exported.
- Dashboard provides intuitive monitoring for warehouse operators.
