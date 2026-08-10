import { BadgeCheck, CalendarDays, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { UserProfile } from '@/services/profileService';

type ProfileCardProps = {
  user: UserProfile;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-28 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800" />

      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-cyan-500 to-blue-700 text-3xl font-bold text-white shadow-lg">
              {initials}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck size={14} />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>

          <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            <ShieldCheck size={16} />
            {user.role}
          </div>
        </div>

        <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
          <InfoItem icon={<UserRound size={19} />} label="Username" value={user.username} />

          <InfoItem icon={<Mail size={19} />} label="Email Address" value={user.email} />

          <InfoItem icon={<Phone size={19} />} label="Mobile Number" value={user.phoneNumber} />

          <InfoItem icon={<CalendarDays size={19} />} label="Account Type" value={user.role} />
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-cyan-700 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
