'use client';

import {
  useMemo,
} from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface Props {
  data: MonthlyRevenue[];
}

// ============================================================
// NUMBER FORMAT
// ============================================================

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }
  ).format(
    Math.max(
      Number(value) || 0,
      0
    )
  );
}

// ============================================================
// MONTH PARSER
//
// Supports:
// 08/2026
// 8/2026
// Aug/2026
// Aug 2026
// 2026-08
// ============================================================

function parseMonth(
  value: string
): Date | null {

  if (!value) {
    return null;
  }

  const trimmed =
    value.trim();

  // ----------------------------------------------------------
  // MM/YYYY
  // ----------------------------------------------------------

  const slashMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{4})$/
    );

  if (slashMatch) {

    const month =
      Number(
        slashMatch[1]
      );

    const year =
      Number(
        slashMatch[2]
      );

    if (
      month >= 1 &&
      month <= 12
    ) {
      return new Date(
        year,
        month - 1,
        1
      );
    }
  }

  // ----------------------------------------------------------
  // YYYY-MM
  // ----------------------------------------------------------

  const yearMonthMatch =
    trimmed.match(
      /^(\d{4})-(\d{1,2})$/
    );

  if (yearMonthMatch) {

    const year =
      Number(
        yearMonthMatch[1]
      );

    const month =
      Number(
        yearMonthMatch[2]
      );

    if (
      month >= 1 &&
      month <= 12
    ) {
      return new Date(
        year,
        month - 1,
        1
      );
    }
  }

  // ----------------------------------------------------------
  // Try normal Date parsing
  // ----------------------------------------------------------

  const parsed =
    new Date(
      `${trimmed} 1`
    );

  if (
    !Number.isNaN(
      parsed.getTime()
    )
  ) {
    return new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      1
    );
  }

  return null;
}

// ============================================================
// INTERNAL MONTH KEY
// ============================================================

function getMonthKey(
  date: Date
) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}`;
}

// ============================================================
// DISPLAY MONTH
// ============================================================

function formatMonthLabel(
  value: string
) {

  const date =
    parseMonth(value);

  if (!date) {
    return value;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      month: 'short',
      year: 'numeric',
    }
  );
}

// ============================================================
// TOOLTIP
// ============================================================

function CustomTooltip({
  active,
  payload,
  label,
}: any) {

  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const value =
    Number(
      payload[0]?.value ?? 0
    );

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs shadow-lg">

      <p className="mb-2 font-semibold text-foreground">
        {formatMonthLabel(
          String(label)
        )}
      </p>

      <div className="flex items-center justify-between gap-6">

        <span className="text-muted-foreground">
          Revenue
        </span>

        <span className="font-semibold text-foreground">
          {formatCurrency(value)}
        </span>

      </div>

    </div>
  );
}

// ============================================================
// MONTHLY REVENUE CHART
// ============================================================

export default function MonthlyRevenueChart({
  data,
}: Props) {

  // ==========================================================
  // NORMALIZE DATA
  //
  // The backend may return only one month, for example:
  //
  // [
  //   {
  //     month: "08/2026",
  //     revenue: 7534
  //   }
  // ]
  //
  // Instead of displaying only one point, we create a
  // six-month timeline.
  //
  // Missing months are ZERO.
  //
  // IMPORTANT:
  // We are NOT inventing revenue.
  // Only the actual backend values are used.
  // ==========================================================

  const chartData =
    useMemo(() => {

      const revenueByMonth =
        new Map<
          string,
          number
        >();

      // --------------------------------------------------------
      // Store actual backend values
      // --------------------------------------------------------

      (data ?? []).forEach(
        (item) => {

          const date =
            parseMonth(
              item.month
            );

          if (!date) {
            return;
          }

          const key =
            getMonthKey(
              date
            );

          const revenue =
            Number(
              item.revenue ?? 0
            );

          revenueByMonth.set(
            key,
            Math.max(
              revenue,
              0
            )
          );
        }
      );

      // --------------------------------------------------------
      // Create last six months
      //
      // Example:
      //
      // Mar 2026
      // Apr 2026
      // May 2026
      // Jun 2026
      // Jul 2026
      // Aug 2026
      // --------------------------------------------------------

      const now =
        new Date();

      const months: MonthlyRevenue[] =
        [];

      for (
        let index = 5;
        index >= 0;
        index--
      ) {

        const date =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              index,
            1
          );

        const key =
          getMonthKey(
            date
          );

        months.push({
          month: key,
          revenue:
            revenueByMonth.get(
              key
            ) ?? 0,
        });
      }

      return months;

    }, [data]);

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (
    !data ||
    data.length === 0
  ) {

    return (
      <div className="h-[220px] flex items-center justify-center">

        <p className="text-xs text-muted-foreground">
          No revenue data available.
        </p>

      </div>
    );
  }

  // ==========================================================
  // CHART
  // ==========================================================

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
    >

      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 15,
          bottom: 5,
          left: 5,
        }}
      >

        {/* ==================================================
            GRADIENT
        ================================================== */}

        <defs>

          <linearGradient
            id="monthlyRevenueGradient"
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

        {/* ==================================================
            GRID
        ================================================== */}

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />

        {/* ==================================================
            X AXIS
        ================================================== */}

        <XAxis
          dataKey="month"
          tick={{
            fontSize: 10,
            fill:
              'var(--muted-foreground)',
          }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(
            value
          ) =>
            formatMonthLabel(
              String(value)
            )
          }
        />

        {/* ==================================================
            Y AXIS
        ================================================== */}

        <YAxis
          tick={{
            fontSize: 10,
            fill:
              'var(--muted-foreground)',
          }}
          tickLine={false}
          axisLine={false}
          width={55}
          tickFormatter={(
            value
          ) =>
            `₹${Number(
              value
            ).toLocaleString(
              'en-IN'
            )}`
          }
        />

        {/* ==================================================
            TOOLTIP
        ================================================== */}

        <Tooltip
          content={
            <CustomTooltip />
          }
        />

        {/* ==================================================
            AREA
        ================================================== */}

        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#monthlyRevenueGradient)"
          dot={{
            r: 3,
            fill:
              'var(--primary)',
          }}
          activeDot={{
            r: 5,
            fill:
              'var(--primary)',
          }}
        />

      </AreaChart>

    </ResponsiveContainer>
  );
}