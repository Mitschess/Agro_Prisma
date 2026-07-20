'use client';

import { type SensorReading, getStatusLevel, thresholds } from '../lib/data';
import {
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Wheat,
} from 'lucide-react';

interface SensorCardProps {
  reading: SensorReading;
}

const sensorConfig = [
  {
    key: 'temperature' as const,
    label: 'Temperature',
    icon: Thermometer,
    format: (v: number) => `${v}°C`,
    color: '#FF7043',
    gradient: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12), rgba(255, 167, 38, 0.06))',
    borderColor: 'rgba(255, 112, 67, 0.25)',
  },
  {
    key: 'humidity' as const,
    label: 'Humidity',
    icon: Droplets,
    format: (v: number) => `${v}%RH`,
    color: '#42A5F5',
    gradient: 'linear-gradient(135deg, rgba(66, 165, 245, 0.12), rgba(41, 182, 246, 0.06))',
    borderColor: 'rgba(66, 165, 245, 0.25)',
  },
  {
    key: 'voc' as const,
    label: 'VOC / Air Quality',
    icon: Wind,
    format: (v: number) => `${v} IAQ`,
    color: '#AB47BC',
    gradient: 'linear-gradient(135deg, rgba(171, 71, 188, 0.12), rgba(206, 147, 216, 0.06))',
    borderColor: 'rgba(171, 71, 188, 0.25)',
  },
  {
    key: 'co2' as const,
    label: 'CO₂',
    icon: Cloud,
    format: (v: number) => `${v} ppm`,
    color: '#26A69A',
    gradient: 'linear-gradient(135deg, rgba(38, 166, 154, 0.12), rgba(128, 203, 196, 0.06))',
    borderColor: 'rgba(38, 166, 154, 0.25)',
  },
  {
    key: 'grainMoisture' as const,
    label: 'Grain Moisture',
    icon: Wheat,
    format: (v: number) => `${v}%`,
    color: '#FFA726',
    gradient: 'linear-gradient(135deg, rgba(255, 167, 38, 0.12), rgba(255, 213, 79, 0.06))',
    borderColor: 'rgba(255, 167, 38, 0.25)',
  },
];

const statusColors = {
  normal: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.3)' },
  warning: { bg: 'rgba(255, 193, 7, 0.15)', text: '#FFC107', border: 'rgba(255, 193, 7, 0.3)' },
  danger: { bg: 'rgba(244, 67, 54, 0.15)', text: '#F44336', border: 'rgba(244, 67, 54, 0.3)' },
};

export default function SensorCards({ reading }: SensorCardProps) {
  return (
    <div className="sensor-grid">
      {sensorConfig.map((sensor, index) => {
        const value = reading[sensor.key];
        const status = getStatusLevel(value, sensor.key);
        const statusStyle = statusColors[status];
        const threshold = thresholds[sensor.key];
        const Icon = sensor.icon;

        // Calculate percentage for progress bar
        const maxVal = threshold.critical * 1.3;
        const percentage = Math.min(100, (value / maxVal) * 100);

        return (
          <div
            key={sensor.key}
            className="animate-fade-in-up"
            style={{
              background: sensor.gradient,
              border: `1px solid ${sensor.borderColor}`,
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              transition: 'all var(--transition-normal)',
              cursor: 'default',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${sensor.color}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${sensor.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${sensor.color}30`,
                  }}
                >
                  <Icon size={20} color={sensor.color} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {sensor.label}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: statusStyle.bg,
                  color: statusStyle.text,
                  border: `1px solid ${statusStyle.border}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'High'}
              </span>
            </div>

            {/* Value */}
            <div style={{ marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: sensor.color,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {sensor.format(value)}
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '8px' }}>
              <div
                style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${sensor.color}, ${sensor.color}88)`,
                    borderRadius: '2px',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>

            {/* Threshold info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              <span>Warning: {threshold.warning}{threshold.unit}</span>
              <span>Critical: {threshold.critical}{threshold.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
