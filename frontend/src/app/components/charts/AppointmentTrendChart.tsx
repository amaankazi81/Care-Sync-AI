'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Jun 26', total: 78, completed: 61, cancelled: 7 },
  { date: 'Jun 27', total: 82, completed: 65, cancelled: 9 },
  { date: 'Jun 28', total: 55, completed: 42, cancelled: 5 },
  { date: 'Jun 29', total: 48, completed: 38, cancelled: 3 },
  { date: 'Jun 30', total: 91, completed: 72, cancelled: 11 },
  { date: 'Jul 1', total: 103, completed: 88, cancelled: 8 },
  { date: 'Jul 2', total: 97, completed: 79, cancelled: 12 },
  { date: 'Jul 3', total: 88, completed: 71, cancelled: 6 },
  { date: 'Jul 4', total: 62, completed: 49, cancelled: 4 },
  { date: 'Jul 5', total: 95, completed: 76, cancelled: 10 },
  { date: 'Jul 6', total: 108, completed: 91, cancelled: 9 },
  { date: 'Jul 7', total: 112, completed: 94, cancelled: 13 },
  { date: 'Jul 8', total: 99, completed: 83, cancelled: 8 },
  { date: 'Jul 9', total: 87, completed: 70, cancelled: 7 },
  { date: 'Jul 10', total: 74, completed: 58, cancelled: 5 },
  { date: 'Jul 11', total: 93, completed: 77, cancelled: 9 },
  { date: 'Jul 12', total: 118, completed: 102, cancelled: 11 },
  { date: 'Jul 13', total: 105, completed: 88, cancelled: 14 },
  { date: 'Jul 14', total: 96, completed: 80, cancelled: 8 },
  { date: 'Jul 15', total: 84, completed: 68, cancelled: 6 },
  { date: 'Jul 16', total: 79, completed: 63, cancelled: 7 },
  { date: 'Jul 17', total: 101, completed: 85, cancelled: 10 },
  { date: 'Jul 18', total: 115, completed: 97, cancelled: 12 },
  { date: 'Jul 19', total: 109, completed: 91, cancelled: 9 },
  { date: 'Jul 20', total: 92, completed: 75, cancelled: 8 },
  { date: 'Jul 21', total: 67, completed: 53, cancelled: 5 },
  { date: 'Jul 22', total: 88, completed: 72, cancelled: 7 },
  { date: 'Jul 23', total: 106, completed: 89, cancelled: 11 },
  { date: 'Jul 24', total: 113, completed: 95, cancelled: 10 },
  { date: 'Jul 25', total: 98, completed: 81, cancelled: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-4 py-3 text-xs">
        <p className="font-600 text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={`tt-${entry.dataKey}`} className="flex items-center justify-between gap-6 mb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground capitalize">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-600 text-foreground tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AppointmentTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.12} />
            <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCancelled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--negative)" stopOpacity={0.1} />
            <stop offset="95%" stopColor="var(--negative)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          name="Total"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#gradTotal)"
          dot={false}
          activeDot={{ r: 4, fill: 'var(--primary)' }}
        />
        <Area
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="var(--positive)"
          strokeWidth={1.5}
          fill="url(#gradCompleted)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--positive)' }}
        />
        <Area
          type="monotone"
          dataKey="cancelled"
          name="Cancelled"
          stroke="var(--negative)"
          strokeWidth={1.5}
          fill="url(#gradCancelled)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--negative)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
