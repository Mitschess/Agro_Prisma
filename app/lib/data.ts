// Dummy sensor data generator for SILO dashboard

export interface SensorReading {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  voc: number;
  co2: number;
  grainMoisture: number;
  moldRisk: number;
}

export interface DeviceStatus {
  relay: boolean;
  fan: boolean;
  led: 'green' | 'yellow' | 'red';
  lastUpdate: string;
}

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'normal';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// SRS dummy dataset
export const dummyReadings: SensorReading[] = [
  {
    id: '1',
    timestamp: '2026-07-20T08:00:00',
    temperature: 28.4,
    humidity: 68,
    voc: 120,
    co2: 620,
    grainMoisture: 12.8,
    moldRisk: 22,
  },
  {
    id: '2',
    timestamp: '2026-07-20T10:00:00',
    temperature: 29.8,
    humidity: 73,
    voc: 138,
    co2: 650,
    grainMoisture: 13.2,
    moldRisk: 36,
  },
  {
    id: '3',
    timestamp: '2026-07-20T12:00:00',
    temperature: 30.6,
    humidity: 82,
    voc: 182,
    co2: 780,
    grainMoisture: 15.4,
    moldRisk: 74,
  },
  {
    id: '4',
    timestamp: '2026-07-20T14:00:00',
    temperature: 31.0,
    humidity: 85,
    voc: 195,
    co2: 820,
    grainMoisture: 15.8,
    moldRisk: 82,
  },
];

// Generate 24-hour trend data
export function generate24HourData(): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();

    // Simulate natural patterns
    const tempBase = 27 + Math.sin((hour - 6) * Math.PI / 12) * 3;
    const humBase = 65 + Math.sin((hour - 2) * Math.PI / 12) * 15;
    const vocBase = 100 + Math.sin((hour - 4) * Math.PI / 12) * 60;
    const co2Base = 580 + Math.sin((hour - 3) * Math.PI / 12) * 150;
    const moistBase = 12 + Math.sin((hour - 8) * Math.PI / 12) * 2.5;

    const temp = +(tempBase + (Math.random() - 0.5) * 1.5).toFixed(1);
    const hum = +(humBase + (Math.random() - 0.5) * 5).toFixed(0);
    const voc = +(vocBase + (Math.random() - 0.5) * 20).toFixed(0);
    const co2 = +(co2Base + (Math.random() - 0.5) * 40).toFixed(0);
    const moist = +(moistBase + (Math.random() - 0.5) * 1).toFixed(1);

    // Mold risk formula (simplified)
    const moldRisk = Math.min(100, Math.max(0,
      +(((hum - 60) * 1.2 + (temp - 25) * 2 + (moist - 12) * 5) * 0.8 + (Math.random() - 0.5) * 5).toFixed(0)
    ));

    data.push({
      id: `reading-${i}`,
      timestamp: time.toISOString(),
      temperature: temp,
      humidity: Math.max(40, Math.min(95, hum)),
      voc: Math.max(50, Math.min(300, voc)),
      co2: Math.max(400, Math.min(1200, co2)),
      grainMoisture: Math.max(10, Math.min(18, moist)),
      moldRisk: moldRisk,
    });
  }

  return data;
}

// Generate 7-day data
export function generate7DayData(): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();

  for (let d = 6; d >= 0; d--) {
    for (let h = 0; h < 24; h += 4) {
      const time = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      time.setHours(h, 0, 0, 0);

      const dayOffset = (6 - d) * 0.3;
      const temp = +(27.5 + Math.sin(h * Math.PI / 12) * 2.5 + dayOffset + (Math.random() - 0.5) * 1).toFixed(1);
      const hum = +(70 + Math.sin(h * Math.PI / 12) * 10 + dayOffset * 2 + (Math.random() - 0.5) * 4).toFixed(0);
      const moist = +(12.5 + dayOffset * 0.5 + (Math.random() - 0.5) * 0.8).toFixed(1);
      const voc = +(130 + dayOffset * 10 + (Math.random() - 0.5) * 20).toFixed(0);
      const co2 = +(620 + dayOffset * 20 + (Math.random() - 0.5) * 30).toFixed(0);
      const moldRisk = Math.min(100, Math.max(0,
        +(((hum - 60) * 1.2 + (temp - 25) * 2 + (moist - 12) * 5) * 0.8).toFixed(0)
      ));

      data.push({
        id: `7d-${d}-${h}`,
        timestamp: time.toISOString(),
        temperature: temp,
        humidity: Math.max(40, Math.min(95, +hum)),
        voc: Math.max(50, Math.min(300, +voc)),
        co2: Math.max(400, Math.min(1200, +co2)),
        grainMoisture: Math.max(10, Math.min(18, moist)),
        moldRisk: moldRisk,
      });
    }
  }

  return data;
}

// Get current sensor reading (latest)
export function getCurrentReading(): SensorReading {
  const data = generate24HourData();
  return data[data.length - 1];
}

// Get device status based on current reading
export function getDeviceStatus(reading: SensorReading): DeviceStatus {
  let fan = false;
  let relay = false;
  let led: 'green' | 'yellow' | 'red' = 'green';

  if (reading.moldRisk >= 90) {
    fan = true;
    relay = true;
    led = 'red';
  } else if (reading.moldRisk >= 70) {
    fan = true;
    relay = true;
    led = 'yellow';
  } else if (reading.moldRisk < 50) {
    fan = false;
    relay = false;
    led = 'green';
  }

  return {
    relay,
    fan,
    led,
    lastUpdate: new Date().toISOString(),
  };
}

// Generate alerts based on sensor reading
export function generateAlerts(reading: SensorReading): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date().toISOString();

  if (reading.humidity > 75) {
    alerts.push({
      id: 'alert-hum',
      type: 'warning',
      title: 'High Humidity',
      message: `Humidity is at ${reading.humidity}%RH. Exceeds safe threshold of 75%RH.`,
      timestamp: now,
      read: false,
    });
  }

  if (reading.temperature > 30) {
    alerts.push({
      id: 'alert-temp',
      type: 'warning',
      title: 'High Temperature',
      message: `Temperature is at ${reading.temperature}°C. Exceeds safe threshold of 30°C.`,
      timestamp: now,
      read: false,
    });
  }

  if (reading.grainMoisture > 14) {
    alerts.push({
      id: 'alert-moist',
      type: 'warning',
      title: 'Drying Recommended',
      message: `Grain moisture is at ${reading.grainMoisture}%. Drying is recommended (>14%).`,
      timestamp: now,
      read: false,
    });
  }

  if (reading.moldRisk > 90) {
    alerts.push({
      id: 'alert-mold-crit',
      type: 'danger',
      title: 'Critical Mold Risk',
      message: `Mold risk is at ${reading.moldRisk}%! Critical condition. Immediate action required.`,
      timestamp: now,
      read: false,
    });
  } else if (reading.moldRisk > 70) {
    alerts.push({
      id: 'alert-mold',
      type: 'danger',
      title: 'High Mold Risk',
      message: `High mold growth risk detected (${reading.moldRisk}%). Turn on ventilation immediately.`,
      timestamp: now,
      read: false,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'alert-ok',
      type: 'normal',
      title: 'All Systems Normal',
      message: 'All sensor readings are within safe parameters.',
      timestamp: now,
      read: true,
    });
  }

  return alerts;
}

// Threshold values
export const thresholds = {
  temperature: { warning: 30, critical: 35, unit: '°C' },
  humidity: { warning: 75, critical: 85, unit: '%RH' },
  voc: { warning: 150, critical: 250, unit: 'IAQ' },
  co2: { warning: 800, critical: 1000, unit: 'ppm' },
  grainMoisture: { warning: 14, critical: 16, unit: '%' },
  moldRisk: { warning: 50, critical: 70, unit: '%' },
};

// Get status level for a sensor value
export function getStatusLevel(
  value: number,
  sensor: keyof typeof thresholds
): 'normal' | 'warning' | 'danger' {
  const { warning, critical } = thresholds[sensor];
  if (value >= critical) return 'danger';
  if (value >= warning) return 'warning';
  return 'normal';
}

// Format timestamp to readable
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate 30-day data
export function generate30DayData(): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();

  for (let d = 29; d >= 0; d--) {
    const time = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    time.setHours(12, 0, 0, 0);

    const trend = (29 - d) * 0.1;
    const temp = +(28 + Math.sin(d * 0.3) * 2 + trend + (Math.random() - 0.5) * 1).toFixed(1);
    const hum = +(70 + Math.sin(d * 0.4) * 8 + trend * 1.5 + (Math.random() - 0.5) * 3).toFixed(0);
    const moist = +(12.5 + trend * 0.4 + Math.sin(d * 0.2) * 1 + (Math.random() - 0.5) * 0.5).toFixed(1);
    const voc = +(130 + trend * 5 + Math.sin(d * 0.3) * 15 + (Math.random() - 0.5) * 10).toFixed(0);
    const co2 = +(630 + trend * 10 + Math.sin(d * 0.25) * 40 + (Math.random() - 0.5) * 20).toFixed(0);
    const moldRisk = Math.min(100, Math.max(0,
      +(((+hum - 60) * 1.2 + (temp - 25) * 2 + (moist - 12) * 5) * 0.8).toFixed(0)
    ));

    data.push({
      id: `30d-${d}`,
      timestamp: time.toISOString(),
      temperature: temp,
      humidity: Math.max(40, Math.min(95, +hum)),
      voc: Math.max(50, Math.min(300, +voc)),
      co2: Math.max(400, Math.min(1200, +co2)),
      grainMoisture: Math.max(10, Math.min(18, moist)),
      moldRisk: moldRisk,
    });
  }

  return data;
}
