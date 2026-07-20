'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { type SensorReading, formatTime, formatDate } from '../lib/data';

interface TrendChartsProps {
  data24h: SensorReading[];
  data7d: SensorReading[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(15, 26, 18, 0.95)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{entry.name}:</span>
          <span style={{ fontSize: '0.75rem', color: entry.color, fontWeight: 700 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendCharts({ data24h, data7d }: TrendChartsProps) {
  const formatted24h = data24h.map(d => ({
    ...d,
    time: formatTime(d.timestamp),
  }));

  const formatted7d = data7d.map(d => ({
    ...d,
    date: formatDate(d.timestamp),
  }));

  const chartCardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    marginBottom: '20px',
  };

  const chartTitleStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
      {/* Temperature 24h */}
      <div style={chartCardStyle} className="animate-fade-in-up delay-100">
        <div style={chartTitleStyle}>
          <span>🌡️</span> Temperature (24 Hours)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted24h}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF7043" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FF7043" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temperature"
              name="Temperature (°C)"
              stroke="#FF7043"
              fill="url(#tempGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#FF7043', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity 24h */}
      <div style={chartCardStyle} className="animate-fade-in-up delay-200">
        <div style={chartTitleStyle}>
          <span>💧</span> Humidity (24 Hours)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted24h}>
            <defs>
              <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42A5F5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#42A5F5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="humidity"
              name="Humidity (%RH)"
              stroke="#42A5F5"
              fill="url(#humGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#42A5F5', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CO₂ Trend */}
      <div style={chartCardStyle} className="animate-fade-in-up delay-300">
        <div style={chartTitleStyle}>
          <span>🌬️</span> CO₂ Trend (24 Hours)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted24h}>
            <defs>
              <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#26A69A" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#26A69A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="co2"
              name="CO₂ (ppm)"
              stroke="#26A69A"
              fill="url(#co2Grad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#26A69A', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mold Risk Trend */}
      <div style={chartCardStyle} className="animate-fade-in-up delay-400">
        <div style={chartTitleStyle}>
          <span>🍃</span> Mold Risk Trend (24 Hours)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted24h}>
            <defs>
              <linearGradient id="moldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F44336" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#F44336" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            {/* Warning line */}
            <Line
              type="monotone"
              dataKey={() => 70}
              name="Warning Threshold"
              stroke="#FFC107"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="moldRisk"
              name="Mold Risk (%)"
              stroke="#F44336"
              fill="url(#moldGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#F44336', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grain Moisture 7 days - full width */}
      <div style={{ ...chartCardStyle, gridColumn: '1 / -1' }} className="animate-fade-in-up delay-500">
        <div style={chartTitleStyle}>
          <span>🌾</span> Grain Moisture (7 Days)
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={formatted7d}>
            <defs>
              <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFA726" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FFA726" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            {/* Warning line */}
            <Line
              type="monotone"
              dataKey={() => 14}
              name="Warning Threshold"
              stroke="#FFC107"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="grainMoisture"
              name="Grain Moisture (%)"
              stroke="#FFA726"
              fill="url(#moistGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#FFA726', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
