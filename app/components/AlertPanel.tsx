'use client';

import { type Alert } from '../lib/data';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Bell,
} from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  danger: {
    icon: AlertCircle,
    color: '#F44336',
    bg: 'rgba(244, 67, 54, 0.08)',
    border: 'rgba(244, 67, 54, 0.2)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#FFC107',
    bg: 'rgba(255, 193, 7, 0.08)',
    border: 'rgba(255, 193, 7, 0.2)',
  },
  info: {
    icon: Info,
    color: '#29B6F6',
    bg: 'rgba(41, 182, 246, 0.08)',
    border: 'rgba(41, 182, 246, 0.2)',
  },
  normal: {
    icon: CheckCircle,
    color: '#4CAF50',
    bg: 'rgba(76, 175, 80, 0.08)',
    border: 'rgba(76, 175, 80, 0.2)',
  },
};

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const activeAlerts = alerts.filter(a => a.type !== 'normal');

  return (
    <div
      className="silo-card animate-fade-in-up"
      style={{ padding: '20px', marginBottom: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Active Alerts
          </h3>
          {activeAlerts.length > 0 && (
            <span
              style={{
                background: 'rgba(244, 67, 54, 0.15)',
                color: '#F44336',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {activeAlerts.length}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: config.bg,
                border: `1px solid ${config.border}`,
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `${config.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={config.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: config.color }}>
                    {alert.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {alert.message}
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical notification banner */}
      {alerts.some(a => a.type === 'danger') && (
        <div
          style={{
            marginTop: '16px',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(255, 152, 0, 0.1))',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          className="animate-pulse-glow"
        >
          <AlertTriangle size={20} color="#F44336" />
          <p style={{ fontSize: '0.8rem', color: '#FFCDD2', fontWeight: 600, lineHeight: 1.4 }}>
            ⚠️ High mold growth risk detected. Turn on ventilation immediately.
          </p>
        </div>
      )}
    </div>
  );
}
