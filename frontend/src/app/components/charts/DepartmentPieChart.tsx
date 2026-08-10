'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { id: 'dept-cardiology', name: 'Cardiology', value: 312, color: '#1d6fb8' },
  { id: 'dept-ortho', name: 'Orthopedics', value: 248, color: '#0ea5e9' },
  { id: 'dept-neuro', name: 'Neurology', value: 189, color: '#6366f1' },
  { id: 'dept-peds', name: 'Pediatrics', value: 276, color: '#22c55e' },
  { id: 'dept-onco', name: 'Oncology', value: 143, color: '#f59e0b' },
  { id: 'dept-general', name: 'General Medicine', value: 421, color: '#64748b' },
];

const total = data.reduce((s, d) => s + d.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-3 py-2.5 text-xs">
        <p className="font-600 text-foreground">{d.name}</p>
        <p className="text-muted-foreground mt-0.5">{d.value} appointments</p>
        <p className="text-muted-foreground">{((d.value / total) * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

export default function DepartmentPieChart() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-1.5">
        {data.map((d) => (
          <div key={d.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-muted-foreground truncate max-w-[110px]">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-600 text-foreground tabular-nums">{d.value}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums w-9 text-right">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
