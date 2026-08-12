'use client';

import React from 'react';

import {
  Droplets,
  Dumbbell,
  Moon,
  Apple,
  Pill,
  HeartPulse,
} from 'lucide-react';

const healthTips = [
  {
    id: 1,
    title: 'Stay Hydrated',
    description: 'Drink enough water throughout the day.',
    icon: Droplets,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 2,
    title: 'Exercise Regularly',
    description: 'Try to stay physically active every day.',
    icon: Dumbbell,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    id: 3,
    title: 'Get Enough Sleep',
    description: 'Aim for 7–9 hours of quality sleep.',
    icon: Moon,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    id: 4,
    title: 'Eat Healthy',
    description: 'Include fruits, vegetables and balanced meals.',
    icon: Apple,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    id: 5,
    title: 'Take Medicines on Time',
    description: 'Follow your doctor’s prescribed schedule.',
    icon: Pill,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  {
    id: 6,
    title: 'Take Care of Your Body',
    description: 'Manage stress and maintain a healthy lifestyle.',
    icon: HeartPulse,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
];

export default function PatientHealthTips() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="px-5 py-4 border-b border-border">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <HeartPulse
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              General Health Tips
            </h3>

            <p className="text-xs text-muted-foreground mt-0.5">
              Simple habits for a healthier life
            </p>
          </div>

        </div>

      </div>

      {/* ======================================================
          HEALTH TIPS
      ====================================================== */}

      <div className="divide-y divide-border">

        {healthTips.map((tip) => {
          const Icon = tip.icon;

          return (
            <div
              key={tip.id}
              className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition"
            >

              {/* Icon */}

              <div
                className={`w-9 h-9 rounded-full ${tip.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon
                  size={17}
                  className={tip.iconColor}
                />
              </div>

              {/* Content */}

              <div className="min-w-0">

                <p className="text-xs font-semibold text-foreground">
                  {tip.title}
                </p>

                <p className="text-[11px] text-muted-foreground mt-0.5 leading-4">
                  {tip.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}