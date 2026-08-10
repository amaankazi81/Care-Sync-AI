'use client';

import React from 'react';
import { Heart, Droplets, Activity, Pill, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const tips = [
  {
    id: 1,
    title: 'Stay Hydrated',
    description: 'Drink at least 2–3 litres of water daily to stay healthy.',
    icon: <Droplets size={18} className="text-sky-600" />,
    bg: 'bg-sky-100',
  },
  {
    id: 2,
    title: 'Daily Exercise',
    description: 'Walk for 30 minutes every day to improve heart health.',
    icon: <Activity size={18} className="text-green-600" />,
    bg: 'bg-green-100',
  },
  {
    id: 3,
    title: 'Take Medicines',
    description: 'Never skip your prescribed medicines without consulting your doctor.',
    icon: <Pill size={18} className="text-purple-600" />,
    bg: 'bg-purple-100',
  },
  {
    id: 4,
    title: 'Heart Healthy Diet',
    description: 'Reduce salt intake and eat more fruits and vegetables.',
    icon: <Heart size={18} className="text-red-600" />,
    bg: 'bg-red-100',
  },
];

export default function PatientHealthTips() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Health Tips</h3>

        <p className="text-xs text-muted-foreground mt-1">Personalized recommendations for today</p>
      </div>

      <div className="divide-y divide-border">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-start gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tip.bg}`}>
              {tip.icon}
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{tip.title}</h4>

              <p className="text-xs text-muted-foreground mt-1 leading-5">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-border">
        <button
          onClick={() => toast.info('Health recommendations page coming soon')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
        >
          View More Tips
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
