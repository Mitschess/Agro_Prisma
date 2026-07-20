'use client';

import { useState } from 'react';
import {
  Settings,
  Scale,
  Bell,
  Cpu,
  RefreshCw,
  Sliders,
  Check,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { thresholds as defaultThresholds } from '../lib/data';

interface SettingsPanelProps {
  onSaveConfig: (cfg: typeof defaultThresholds) => void;
  currentConfig?: typeof defaultThresholds;
}

export default function SettingsPanel({ onSaveConfig, currentConfig }: SettingsPanelProps) {
  const [config, setConfig] = useState(currentConfig || defaultThresholds);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [roles, setRoles] = useState<'operator' | 'manager'>('operator');

  const handleSave = () => {
    onSaveConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setConfig(defaultThresholds);
    onSaveConfig(defaultThresholds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* Threshold Configuration */}
      <div className="silo-card animate-fade-in-up" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Scale size={20} color="var(--silo-green)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Custom Alerts Thresholds</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Temperature */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Temperature Warning Threshold (°C)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--silo-brown)' }}>
                {config.temperature.warning}°C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              step="0.5"
              value={config.temperature.warning}
              onChange={e =>
                setConfig({
                  ...config,
                  temperature: { ...config.temperature, warning: parseFloat(e.target.value) },
                })
              }
              style={{ width: '100%', accentColor: 'var(--silo-green)' }}
            />
          </div>

          {/* Humidity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Humidity Warning Threshold (%RH)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--silo-brown)' }}>
                {config.humidity.warning}%RH
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={config.humidity.warning}
              onChange={e =>
                setConfig({
                  ...config,
                  humidity: { ...config.humidity, warning: parseInt(e.target.value) },
                })
              }
              style={{ width: '100%', accentColor: 'var(--silo-green)' }}
            />
          </div>

          {/* CO2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                CO₂ Alert Level Warning (ppm)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--silo-brown)' }}>
                {config.co2.warning} ppm
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="50"
              value={config.co2.warning}
              onChange={e =>
                setConfig({
                  ...config,
                  co2: { ...config.co2, warning: parseInt(e.target.value) },
                })
              }
              style={{ width: '100%', accentColor: 'var(--silo-green)' }}
            />
          </div>

          {/* Grain Moisture */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Grain Moisture Alert (% H₂O)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--silo-brown)' }}>
                {config.grainMoisture.warning}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="18"
              step="0.1"
              value={config.grainMoisture.warning}
              onChange={e =>
                setConfig({
                  ...config,
                  grainMoisture: { ...config.grainMoisture, warning: parseFloat(e.target.value) },
                })
              }
              style={{ width: '100%', accentColor: 'var(--silo-green)' }}
            />
          </div>

          {/* Mold Risk warning */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Mold Risk Alarm Level (%)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--silo-brown)' }}>
                {config.moldRisk.warning}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={config.moldRisk.warning}
              onChange={e =>
                setConfig({
                  ...config,
                  moldRisk: { ...config.moldRisk, warning: parseInt(e.target.value) },
                })
              }
              style={{ width: '100%', accentColor: 'var(--silo-green)' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSave}
            className="silo-btn silo-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}
          >
            <Save size={16} /> Save Changes
          </button>
          <button onClick={handleReset} className="silo-btn silo-btn-secondary">
            Reset
          </button>
        </div>

        {saveSuccess && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(46, 125, 50, 0.1)',
              border: '1px solid rgba(46, 125, 50, 0.3)',
              color: 'var(--silo-green)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={14} /> Threshold configuration saved successfully!
          </div>
        )}
      </div>

      {/* Simulator and User Access Settings */}
      <div className="silo-card animate-fade-in-up delay-100" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Cpu size={20} color="var(--silo-green)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Device & User Settings</h3>
        </div>

        {/* ESP32 Wifi Config */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.03em' }}>
            ESP32 Node configuration
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Device ID
              </label>
              <input
                type="text"
                readOnly
                value="ESP32-SILO-0982-S3"
                className="silo-input"
                style={{ width: '100%', background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Firmware Version
              </label>
              <input
                type="text"
                readOnly
                value="v1.4.2-stable"
                className="silo-input"
                style={{ width: '100%', background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        {/* Access Role */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.03em' }}>
            Role-Based Access Control
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['operator', 'manager'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoles(r)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${roles === r ? 'var(--silo-green)' : 'var(--border-color)'}`,
                  background: roles === r ? 'var(--bg-surface)' : 'transparent',
                  color: roles === r ? 'var(--silo-green)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {r === 'operator' ? 'Warehouse Operator' : 'Warehouse Manager'}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px', lineHeight: 1.4 }}>
            {roles === 'operator'
              ? 'Operators can monitor raw storage conditions, view system statuses, and switch manual ventilation override.'
              : 'Managers have absolute override access, threshold editing capabilities, custom calibration settings, and full PDF/CSV export features.'}
          </p>
        </div>

        {/* Calibration */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.03em' }}>
            Sensor Calibration Offset
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Temp Offset (°C)
              </label>
              <input type="number" defaultValue="0.0" step="0.1" className="silo-input" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Humidity Offset (%)
              </label>
              <input type="number" defaultValue="0.0" step="0.5" className="silo-input" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
