'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SensorCards from './components/SensorCards';
import StatusOverview from './components/StatusOverview';
import TrendCharts from './components/TrendCharts';
import AlertPanel from './components/AlertPanel';
import ControlPanel from './components/ControlPanel';
import HistoryTable from './components/HistoryTable';
import SettingsPanel from './components/SettingsPanel';
import AboutPanel from './components/AboutPanel';
import {
  type SensorReading,
  type Alert,
  generate24HourData,
  generate7DayData,
  getCurrentReading,
  generateAlerts,
  thresholds as defaultThresholds,
} from './lib/data';
import {
  Wheat,
  Activity,
  BarChart3,
  AlertTriangle,
  Zap,
  History,
  ShieldCheck,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [data24h, setData24h] = useState<SensorReading[]>([]);
  const [data7d, setData7d] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [customThresholds, setCustomThresholds] = useState(defaultThresholds);

  // Sync theme to DOM html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const refreshData = useCallback(() => {
    const reading = getCurrentReading();
    setCurrentReading(reading);
    setData24h(generate24HourData());
    setData7d(generate7DayData());

    // Generate alerts based on current reading and custom thresholds
    const newAlerts = generateAlerts(reading);
    
    // Preserve read status of existing alerts if they match by id
    setAlerts(prevAlerts => {
      return newAlerts.map(newA => {
        const existing = prevAlerts.find(p => p.id === newA.id);
        if (existing) {
          return { ...newA, read: existing.read };
        }
        return newA;
      });
    });
    
    setLastRefresh(Date.now());
  }, []);

  useEffect(() => {
    refreshData();
    // Simulate 5-second refresh
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Simulate connection drops
  useEffect(() => {
    const connInterval = setInterval(() => {
      setIsConnected(prev => {
        if (!prev) return true;
        return Math.random() > 0.05;
      });
    }, 10000);
    return () => clearInterval(connInterval);
  }, []);

  const markAlertAsRead = (id: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const handleSaveConfig = (newThresholds: typeof defaultThresholds) => {
    setCustomThresholds(newThresholds);
    // Force regeneration of alerts with new config
    if (currentReading) {
      setAlerts(generateAlerts(currentReading));
    }
  };

  if (!currentReading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--silo-green), var(--silo-green-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px rgba(46, 125, 50, 0.3)',
            }}
            className="animate-float"
          >
            <Wheat size={30} color="#fff" />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            SILO
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Initializing sensors...
          </p>
          <div style={{
            width: '120px',
            height: '3px',
            background: 'rgba(46, 125, 50, 0.15)',
            borderRadius: '2px',
            margin: '16px auto 0',
            overflow: 'hidden',
          }}>
            <div
              className="animate-shimmer"
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, var(--silo-green-light), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Status Banner */}
            <StatusOverview reading={currentReading} />

            {/* Sensor Cards */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Activity size={18} color="var(--text-secondary)" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  Live Sensor Readings
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--silo-green)',
                    }}
                    className="animate-blink"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Refreshing every 5s
                  </span>
                </div>
              </div>
              <SensorCards reading={currentReading} />
            </div>

            {/* Alert Panel */}
            <AlertPanel alerts={alerts} />

            {/* Trend Charts */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <BarChart3 size={18} color="var(--text-secondary)" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Trend Charts</h2>
              </div>
              <TrendCharts data24h={data24h} data7d={data7d} />
            </div>
          </>
        );

      case 'monitoring':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Sensor Monitoring
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Real-time sensor data from ESP32 device
              </p>
            </div>
            <SensorCards reading={currentReading} />
            <div style={{ marginTop: '24px' }}>
              <StatusOverview reading={currentReading} />
            </div>
          </>
        );

      case 'trends':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Trend Analysis
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Temperature, Humidity, CO₂, Mold Risk & Grain Moisture trends
              </p>
            </div>
            <TrendCharts data24h={data24h} data7d={data7d} />
          </>
        );

      case 'alerts':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Alert Center
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Monitor storage conditions and threshold alerts
              </p>
            </div>
            <AlertPanel alerts={alerts} />

            {/* Threshold Configuration */}
            <div
              className="silo-card animate-fade-in-up"
              style={{ padding: '24px', marginTop: '20px' }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--text-secondary)" />
                Defined Safety Reference
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Humidity', condition: `RH > ${customThresholds.humidity.warning}%RH`, alert: 'High Humidity', icon: '💧' },
                  { label: 'Temperature', condition: `Temp > ${customThresholds.temperature.warning}°C`, alert: 'High Temperature', icon: '🌡️' },
                  { label: 'Grain Moisture', condition: `Moisture > ${customThresholds.grainMoisture.warning}%`, alert: 'Drying Recommended', icon: '🌾' },
                  { label: 'Mold Risk', condition: `Risk > ${customThresholds.moldRisk.warning}%`, alert: 'High Risk', icon: '⚠️' },
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t.icon}</div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {t.label}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                      Condition: {t.condition}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--status-warning)' }}>
                      Alert: {t.alert}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'controls':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Device Controls
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Automatic control and manual override for ventilation equipment
              </p>
            </div>
            <ControlPanel reading={currentReading} />
          </>
        );

      case 'history':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                Historical Data
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                View and export storage data records
              </p>
            </div>
            <HistoryTable data24h={data24h} />
          </>
        );

      case 'settings':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                System Settings
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Configure parameters and thresholds for SILO devices
              </p>
            </div>
            <SettingsPanel currentConfig={customThresholds} onSaveConfig={handleSaveConfig} />
          </>
        );

      case 'help':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                About & Help Center
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Learn about SILO specifications, modules, and troubleshooting
              </p>
            </div>
            <AboutPanel />
          </>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(46,125,50,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '1px solid rgba(46,125,50,0.2)',
              }}
            >
              <Wheat size={28} color="#81C784" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              This section is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background-color var(--transition-normal)' }}>
      <Header
        alerts={alerts}
        isConnected={isConnected}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenAbout={() => setActiveTab('help')}
        theme={theme}
        onThemeToggle={toggleTheme}
        onMarkAlertAsRead={markAlertAsRead}
        onClearAllAlerts={clearAllAlerts}
      />

      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main
        style={{
          marginLeft: sidebarOpen ? '240px' : '72px',
          marginTop: '64px',
          padding: '28px',
          transition: 'margin-left var(--transition-normal)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {renderContent()}

        {/* Footer */}
        <footer
          style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>© 2026 SILO – Smart Storage for Safer Harvests</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isConnected ? 'var(--status-normal)' : 'var(--status-danger)' }} />
            ESP32 Node {isConnected ? 'Online' : 'Offline'}
            {' • '}
            v1.0.0
          </span>
        </footer>
      </main>
    </div>
  );
}
