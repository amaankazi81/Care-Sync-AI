import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: React.ReactNode;
  iconBg?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning' | 'primary';
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBg = 'bg-primary/10',
  variant = 'default',
  className = '',
}: MetricCardProps) {
  const variantStyles: Record<string, string> = {
    default: 'bg-card border-border',
    positive: 'bg-card border-positive/20',
    negative: 'bg-card border-negative/20',
    warning: 'bg-card border-warning/20',
    primary: 'bg-card border-primary/20',
  };

  const trendColor = trend
    ? trend.value > 0
      ? 'text-positive'
      : trend.value < 0
        ? 'text-negative'
        : 'text-muted-foreground'
    : '';

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null;

  return (
    <div
      className={`
        rounded-xl border p-5 card-hover shadow-card
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">
            {value}
          </p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && TrendIcon && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon size={13} />
              <span className="text-xs font-600">
                {trend.value > 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
