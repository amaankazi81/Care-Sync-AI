'use client';

import React from 'react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DepartmentStatistic {
  departmentName: string;
  doctorCount: number;
  appointmentCount: number;
}

interface Props {
  data: DepartmentStatistic[];
}

const colors = [
  'var(--primary)',
  'var(--accent)',
  '#6366f1',
  'var(--positive)',
  'var(--warning)',
  '#64748b',
];

function CustomTooltip({
  active,
  payload,
}: any) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const department =
    payload[0].payload;

  return (
    <div className="bg-card border border-border rounded-xl shadow-card-md px-3 py-2.5 text-xs">
      <p className="font-600 text-foreground">
        {department.departmentName}
      </p>

      <p className="text-muted-foreground mt-0.5">
        {department.appointmentCount}{' '}
        appointments
      </p>

      <p className="text-muted-foreground">
        {department.doctorCount}{' '}
        doctors
      </p>
    </div>
  );
}

export default function DepartmentPieChart({
  data,
}: Props) {
  const validData = data.filter(
    (item) =>
      item.appointmentCount > 0
  );

  const total = validData.reduce(
    (sum, item) =>
      sum + item.appointmentCount,
    0
  );

  if (
    !validData.length ||
    total === 0
  ) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          No appointment data available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={160}
      >
        <PieChart>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={2}
            dataKey="appointmentCount"
            nameKey="departmentName"
          >
            {validData.map(
              (entry, index) => (
                <Cell
                  key={
                    entry.departmentName
                  }
                  fill={
                    colors[
                      index %
                        colors.length
                    ]
                  }
                  stroke="none"
                />
              )
            )}
          </Pie>

          <Tooltip
            content={
              <CustomTooltip />
            }
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-1.5">
        {validData.map(
          (department, index) => {
            const percentage =
              total > 0
                ? (
                    (department.appointmentCount /
                      total) *
                    100
                  ).toFixed(0)
                : '0';

            return (
              <div
                key={
                  department.departmentName
                }
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        colors[
                          index %
                            colors.length
                        ],
                    }}
                  />

                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {
                      department.departmentName
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-600 text-foreground tabular-nums">
                    {
                      department.appointmentCount
                    }
                  </span>

                  <span className="text-[10px] text-muted-foreground tabular-nums w-9 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}