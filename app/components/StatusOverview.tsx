'use client';

import { type DeviceStatus, type SensorReading, getDeviceStatus, getStatusLevel } from '../lib/data';
import {
  ShieldAlert,
  Fan,
  Power,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react';

interface StatusOverviewProps {
  reading: SensorReading;
  deviceStatus?: DeviceStatus;
}

export default function StatusOverview({ reading, deviceStatus }: StatusOverviewProps) {
  const device = deviceStatus ?? getDeviceStatus(reading);
  const moldStatus = getStatusLevel(reading.moldRisk, 'moldRisk');

  const riskColor =
    moldStatus === 'danger' ? '#F44336' :
    moldStatus === 'warning' ? '#FFC107' : '#4CAF50';

  const riskLabel =
    reading.moldRisk >= 90 ? 'CRITICAL' :
    reading.moldRisk >= 70 ? 'HIGH RISK' :
    reading.moldRisk >= 50 ? 'MODERATE' :
    reading.moldRisk >= 30 ? 'LOW' : 'SAFE';

  const ledColors = {
    green: { bg: '#4CAF50', shadow: 'rgba(76, 175, 80, 0.5)', label: 'Normal' },
    yellow: { bg: '#FFC107', shadow: 'rgba(255, 193, 7, 0.5)', label: 'Warning' },
    red: { bg: '#F44336', shadow: 'rgba(244, 67, 54, 0.5)', label: 'Critical' },
  };

  const ledStyle = ledColors[device.led];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {/* Mold Risk */}
      <div
        className="silo-card animate-fade-in-up"
        style={{
          padding: '24px',
          gridColumn: 'span 1',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${riskColor}, ${riskColor}44)`,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: `${riskColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${riskColor}30`,
            }}
          >
            <ShieldAlert size={22} color={riskColor} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Mold Risk
            </p>
            <p style={{ fontSize: '0.75rem', color: riskColor, fontWeight: 700 }}>
              {riskLabel}
            </p>
          </div>
        </div>

        {/* Circular gauge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={riskColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${reading.moldRisk * 2.64} ${264 - reading.moldRisk * 2.64}`}
                style={{
                  filter: `drop-shadow(0 0 6px ${riskColor}66)`,
                  transition: 'stroke-dasharray 1s ease',
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: riskColor }}>
                {reading.moldRisk}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fan Status */}
      <div
        className="silo-card animate-fade-in-up delay-100"
        style={{
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: device.fan
              ? 'linear-gradient(90deg, #4CAF50, #81C784)'
              : 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: device.fan ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${device.fan ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <Fan
              size={22}
              color={device.fan ? '#4CAF50' : 'var(--text-dim)'}
              className={device.fan ? 'animate-spin-slow' : ''}
            />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Fan Status
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: device.fan ? '#4CAF50' : 'var(--text-dim)',
            }}
          >
            {device.fan ? 'Running' : 'OFF'}
          </span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <Power size={14} color={device.relay ? '#4CAF50' : 'var(--text-dim)'} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Relay: {device.relay ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* LED Indicator */}
      <div
        className="silo-card animate-fade-in-up delay-200"
        style={{
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${ledStyle.bg}, ${ledStyle.bg}44)`,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: `${ledStyle.bg}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${ledStyle.bg}30`,
            }}
          >
            <Activity size={22} color={ledStyle.bg} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              LED Indicator
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div
            className="animate-pulse-glow"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${ledStyle.bg}, ${ledStyle.bg}88)`,
              boxShadow: `0 0 20px ${ledStyle.shadow}, 0 0 40px ${ledStyle.shadow}`,
              margin: '0 auto',
            }}
          />
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: ledStyle.bg }}>
          {ledStyle.label}
        </p>
      </div>

      {/* Last Update */}
      <div
        className="silo-card animate-fade-in-up delay-300"
        style={{
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #29B6F6, rgba(41, 182, 246, 0.2))',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(41, 182, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(41, 182, 246, 0.25)',
            }}
          >
            <Clock size={22} color="#29B6F6" />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Last Update
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }} className="animate-blink" />
            Live
          </span>
          <span>•</span>
          <span>Every 5s</span>
        </div>
      </div>
    </div>
  );
}
