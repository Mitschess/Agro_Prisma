'use client';

import { useState } from 'react';
import { type SensorReading, generate7DayData, generate30DayData, formatDateTime } from '../lib/data';
import {
  Calendar,
  Download,
  FileText,
  Filter,
  ChevronDown,
} from 'lucide-react';

interface HistoryTableProps {
  data24h: SensorReading[];
}

type FilterRange = 'today' | '7days' | '30days';

export default function HistoryTable({ data24h }: HistoryTableProps) {
  const [filter, setFilter] = useState<FilterRange>('today');

  const getData = () => {
    switch (filter) {
      case '7days':
        return generate7DayData();
      case '30days':
        return generate30DayData();
      default:
        return data24h;
    }
  };

  const data = getData();

  const exportCSV = () => {
    const headers = 'Timestamp,Temperature (°C),Humidity (%RH),VOC (IAQ),CO₂ (ppm),Grain Moisture (%),Mold Risk (%)\n';
    const rows = data.map(d =>
      `${d.timestamp},${d.temperature},${d.humidity},${d.voc},${d.co2},${d.grainMoisture},${d.moldRisk}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silo-data-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (value: number, warning: number, critical: number) => {
    if (value >= critical) return { label: 'High', color: '#F44336', bg: 'rgba(244,67,54,0.12)' };
    if (value >= warning) return { label: 'Warning', color: '#FFC107', bg: 'rgba(255,193,7,0.12)' };
    return { label: 'Normal', color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' };
  };

  return (
    <div
      className="silo-card animate-fade-in-up"
      style={{ padding: '24px', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Historical Data</h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Filter buttons */}
          {(['today', '7days', '30days'] as FilterRange[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: `1px solid ${filter === f ? 'rgba(76,175,80,0.4)' : 'var(--border-color)'}`,
                background: filter === f ? 'rgba(76,175,80,0.15)' : 'transparent',
                color: filter === f ? '#81C784' : 'var(--text-dim)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {f === 'today' ? 'Today' : f === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}

          {/* Export buttons */}
          <button
            onClick={exportCSV}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(41,182,246,0.3)',
              background: 'rgba(41,182,246,0.1)',
              color: '#29B6F6',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Download size={14} /> CSV
          </button>
          <button
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(171,71,188,0.3)',
              background: 'rgba(171,71,188,0.1)',
              color: '#AB47BC',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 2px',
            fontSize: '0.8rem',
          }}
        >
          <thead>
            <tr>
              {['Time', 'Temp (°C)', 'RH (%)', 'VOC (IAQ)', 'CO₂ (ppm)', 'Moisture (%)', 'Mold Risk (%)'].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '10px 12px',
                    textAlign: i === 0 ? 'left' : 'right',
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border-color)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(-20).map((row, idx) => {
              const tempStatus = getStatusBadge(row.temperature, 30, 35);
              const humStatus = getStatusBadge(row.humidity, 75, 85);
              const moldStatus = getStatusBadge(row.moldRisk, 50, 70);

              return (
                <tr
                  key={row.id}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(46,125,50,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {formatDateTime(row.timestamp)}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: tempStatus.color, fontWeight: 600 }}>
                    {row.temperature}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: humStatus.color, fontWeight: 600 }}>
                    {row.humidity}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {row.voc}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {row.co2}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {row.grainMoisture}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: moldStatus.color,
                        background: moldStatus.bg,
                      }}
                    >
                      {row.moldRisk}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.7rem',
        color: 'var(--text-dim)',
      }}>
        <span>Showing {Math.min(20, data.length)} of {data.length} records</span>
        <span>{filter === 'today' ? 'Last 24 Hours' : filter === '7days' ? 'Last 7 Days' : 'Last 30 Days'}</span>
      </div>
    </div>
  );
}
