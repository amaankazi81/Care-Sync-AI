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

interface RevenueItem {
  month: string;
  revenue: number;
}

interface Props {
  data: RevenueItem[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-card-md px-4 py-3 text-xs">
      <p className="font-600 text-foreground mb-2">
        {label}
      </p>

      {payload.map((entry: any) => (
        <div
          key={`revenue-tooltip-${entry.dataKey}`}
          className="flex items-center justify-between gap-6"
        >
          <span className="text-muted-foreground">
            Revenue
          </span>

          <span className="font-600 text-foreground tabular-nums">
            {formatCurrency(Number(entry.value))}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AppointmentTrendChart({
  data,
}: Props) {
  if (!data.length) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No revenue data available.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
    >
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          bottom: 0,
          left: -10,
        }}
      >
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="var(--primary)"
              stopOpacity={0.18}
            />

            <stop
              offset="95%"
              stopColor="var(--primary)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{
            fontSize: 10,
            fill: 'var(--muted-foreground)',
          }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          tick={{
            fontSize: 10,
            fill: 'var(--muted-foreground)',
          }}
          tickLine={false}
          axisLine={false}
          width={45}
          tickFormatter={(value) =>
            `₹${Number(value).toLocaleString('en-IN')}`
          }
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={{
            r: 4,
            fill: 'var(--primary)',
          }}
          activeDot={{
            r: 5,
            fill: 'var(--primary)',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}