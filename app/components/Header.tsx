'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Wheat,
  Bell,
  Menu,
  X,
  Settings,
  User,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Trash2,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { type Alert } from '../lib/data';

interface HeaderProps {
  alerts: Alert[];
  isConnected: boolean;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onMarkAlertAsRead: (id: string) => void;
  onClearAllAlerts: () => void;
}

const alertIcons = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  normal: CheckCircle,
};

const alertColors = {
  danger: '#F44336',
  warning: '#FFC107',
  info: '#29B6F6',
  normal: '#4CAF50',
};

export default function Header({
  alerts,
  isConnected,
  onToggleSidebar,
  sidebarOpen,
  onOpenSettings,
  onOpenAbout,
  theme,
  onThemeToggle,
  onMarkAlertAsRead,
  onClearAllAlerts,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeAlertsCount = alerts.filter(a => !a.read && a.type !== 'normal').length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          onClick={onOpenAbout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Click to view About SILO"
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--silo-green), var(--silo-green-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(46, 125, 50, 0.25)',
            }}
          >
            <Wheat size={20} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
              className="gradient-text"
            >
              SILO
            </h1>
            <p
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Smart Storage for Safer Harvests
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Connection Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: isConnected
              ? 'rgba(46, 125, 50, 0.12)'
              : 'rgba(211, 47, 47, 0.12)',
            color: isConnected ? 'var(--status-normal)' : 'var(--status-danger)',
            border: `1px solid ${isConnected ? 'rgba(46, 125, 50, 0.25)' : 'rgba(211, 47, 47, 0.25)'}`,
            transition: 'all var(--transition-normal)',
          }}
        >
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span style={{ fontSize: '0.75rem' }}>
            {isConnected ? 'ESP32 Live' : 'Disconnected'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          aria-label="Toggle Theme"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Dropdown Trigger */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Bell size={20} />
            {activeAlertsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--status-danger)',
                  color: '#fff',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="animate-blink"
              >
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              className="silo-card animate-slide-down"
              aria-labelledby="notifications-btn"
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1010,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications ({alerts.length})
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {alerts.length > 0 && (
                    <button
                      onClick={onClearAllAlerts}
                      title="Clear All Notifications"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F44336')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '300px' }}>
                {alerts.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
                    No notifications
                  </p>
                ) : (
                  alerts.map(alert => {
                    const Icon = alertIcons[alert.type] || Info;
                    const iconColor = alertColors[alert.type];

                    return (
                      <div
                        key={alert.id}
                        onClick={() => onMarkAlertAsRead(alert.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '10px',
                          borderRadius: '8px',
                          background: alert.read ? 'transparent' : 'var(--bg-surface)',
                          border: alert.read ? '1px solid transparent' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'var(--bg-primary)';
                          e.currentTarget.style.borderColor = 'var(--border-active)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = alert.read ? 'transparent' : 'var(--bg-surface)';
                          e.currentTarget.style.borderColor = alert.read ? 'transparent' : 'var(--border-color)';
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: `${iconColor}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={14} color={iconColor} />
                        </div>
                        <div style={{ flex: 1, paddingRight: '12px' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: alert.read ? 600 : 700, color: 'var(--text-primary)' }}>
                            {alert.title}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                            {alert.message}
                          </p>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!alert.read && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '8px',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'var(--status-info)',
                            }}
                            title="Unread"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          id="settings-btn"
          onClick={onOpenSettings}
          aria-label="Settings"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          title="Open Settings"
        >
          <Settings size={20} />
        </button>

        {/* About App / Profile Trigger */}
        <div
          onClick={onOpenAbout}
          title="About SILO Application"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--silo-brown), var(--silo-brown-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(109, 76, 65, 0.15)',
            transition: 'transform var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <User size={16} color="#F8F5E9" />
        </div>
      </div>
    </header>
  );
}
