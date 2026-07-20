'use client';

import { useState } from 'react';
import { type SensorReading, getDeviceStatus, getStatusLevel } from '../lib/data';
import {
  Fan,
  Power,
  Zap,
  Gauge,
  Settings,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from 'lucide-react';

interface ControlPanelProps {
  reading: SensorReading;
}

export default function ControlPanel({ reading }: ControlPanelProps) {
  const device = getDeviceStatus(reading);
  const [manualMode, setManualMode] = useState(false);
  const [fanOverride, setFanOverride] = useState(device.fan);
  const [relayOverride, setRelayOverride] = useState(device.relay);

  const moldStatus = getStatusLevel(reading.moldRisk, 'moldRisk');

  const rules = [
    {
      condition: 'Mold Risk ≥ 90%',
      actions: ['Relay ON', 'Fan ON', 'Red LED', 'Critical Notification'],
      active: reading.moldRisk >= 90,
      color: '#F44336',
    },
    {
      condition: 'Mold Risk ≥ 70%',
      actions: ['Relay ON', 'Fan ON', 'Yellow LED'],
      active: reading.moldRisk >= 70 && reading.moldRisk < 90,
      color: '#FFC107',
    },
    {
      condition: 'Mold Risk < 50%',
      actions: ['Fan OFF', 'Green LED'],
      active: reading.moldRisk < 50,
      color: '#4CAF50',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* Auto Control Rules */}
      <div
        className="silo-card animate-fade-in-up"
        style={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Zap size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Automatic Control Rules</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rules.map((rule, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: rule.active ? `${rule.color}10` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${rule.active ? `${rule.color}30` : 'var(--border-color)'}`,
                transition: 'all var(--transition-normal)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: rule.active ? rule.color : 'var(--text-dim)',
                }}>
                  {rule.condition}
                </span>
                {rule.active && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: `${rule.color}20`,
                      color: rule.color,
                      textTransform: 'uppercase',
                    }}
                    className="animate-blink"
                  >
                    Active
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {rule.actions.map((action, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.04)',
                      color: rule.active ? 'var(--text-secondary)' : 'var(--text-dim)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div
        className="silo-card animate-fade-in-up delay-100"
        style={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={18} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Manual Override</h3>
          </div>

          <button
            onClick={() => setManualMode(!manualMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: `1px solid ${manualMode ? 'rgba(255,193,7,0.4)' : 'var(--border-color)'}`,
              background: manualMode ? 'rgba(255,193,7,0.1)' : 'transparent',
              color: manualMode ? '#FFC107' : 'var(--text-dim)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {manualMode ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {manualMode ? 'Manual' : 'Auto'}
          </button>
        </div>

        {!manualMode && (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(41,182,246,0.08)',
              border: '1px solid rgba(41,182,246,0.2)',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: '#29B6F6', lineHeight: 1.5 }}>
              System is in <strong>automatic mode</strong>. Controls are managed based on sensor readings and predefined rules.
            </p>
          </div>
        )}

        {/* Fan Control */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            marginBottom: '12px',
            opacity: manualMode ? 1 : 0.5,
            pointerEvents: manualMode ? 'auto' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: fanOverride ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${fanOverride ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <Fan
                  size={24}
                  color={fanOverride ? '#4CAF50' : 'var(--text-dim)'}
                  className={fanOverride ? 'animate-spin-slow' : ''}
                />
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Ventilation Fan
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {fanOverride ? 'Currently running' : 'Currently off'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setFanOverride(!fanOverride)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: fanOverride
                  ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                  : 'rgba(255,255,255,0.08)',
                color: fanOverride ? '#fff' : 'var(--text-dim)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: fanOverride ? '0 4px 12px rgba(76,175,80,0.3)' : 'none',
              }}
            >
              {fanOverride ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Relay Control */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            opacity: manualMode ? 1 : 0.5,
            pointerEvents: manualMode ? 'auto' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: relayOverride ? 'rgba(41,182,246,0.12)' : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${relayOverride ? 'rgba(41,182,246,0.25)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <Power size={24} color={relayOverride ? '#29B6F6' : 'var(--text-dim)'} />
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Relay Switch
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Control dehumidifier relay
                </p>
              </div>
            </div>

            <button
              onClick={() => setRelayOverride(!relayOverride)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: relayOverride
                  ? 'linear-gradient(135deg, #29B6F6, #4FC3F7)'
                  : 'rgba(255,255,255,0.08)',
                color: relayOverride ? '#fff' : 'var(--text-dim)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: relayOverride ? '0 4px 12px rgba(41,182,246,0.3)' : 'none',
              }}
            >
              {relayOverride ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {manualMode && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,193,7,0.08)',
              border: '1px solid rgba(255,193,7,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertTriangle size={16} color="#FFC107" />
            <p style={{ fontSize: '0.7rem', color: '#FFC107', lineHeight: 1.4 }}>
              Manual mode active. Automatic protection rules are <strong>disabled</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
