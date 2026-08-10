'use client';

import AppLayout from '@/components/AppLayout';
import React from 'react';

import {
  Users,
  Stethoscope,
  CalendarDays,
  Building2,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  FileText,
  ArrowUpRight,
  HeartPulse,
  ShieldCheck,
  Download,
  RefreshCcw,
  Plus,
  CheckCircle,
  XCircle,
  IndianRupee,
} from 'lucide-react';

const stats = [
  {
    title: 'TOTAL DOCTORS',
    value: '148',
    subtitle: '12 on leave today',
    growth: '+4.2% vs last month',
    icon: Stethoscope,
    color: 'bg-cyan-100 text-cyan-700',
  },

  {
    title: 'TOTAL PATIENTS',
    value: '4821',
    subtitle: '38 new this week',
    growth: '+6.8% vs last month',
    icon: Users,
    color: 'bg-blue-100 text-blue-700',
  },

  {
    title: "TODAY'S APPOINTMENTS",
    value: '94',
    subtitle: '17 yet to check in',
    growth: '+11.3% vs yesterday',
    icon: CalendarDays,
    color: 'bg-green-100 text-green-700',
  },

  {
    title: 'COMPLETED TODAY',
    value: '61',
    subtitle: '64.9% completion rate',
    growth: '+3.1% vs yesterday',
    icon: CheckCircle,
    color: 'bg-emerald-100 text-emerald-700',
  },

  {
    title: 'CANCELLED TODAY',
    value: '9',
    subtitle: '9.6% cancellation rate',
    growth: '-2.4% vs yesterday',
    icon: XCircle,
    color: 'bg-red-100 text-red-700',
  },

  {
    title: "TODAY'S REVENUE",
    value: '$12,480',
    subtitle: 'Billing in progress',
    growth: '+8.7% vs yesterday',
    icon: IndianRupee,
    color: 'bg-yellow-100 text-yellow-700',
  },
];

const appointments = [
  {
    id: 'APT-1021',
    patient: 'Rahul Sharma',
    doctor: 'Dr. Amit Patel',
    department: 'Cardiology',
    date: '26 Jul 2026',
    time: '10:30 AM',
    status: 'Confirmed',
  },

  {
    id: 'APT-1022',
    patient: 'Sneha Joshi',
    doctor: 'Dr. Priya Singh',
    department: 'Neurology',
    date: '26 Jul 2026',
    time: '11:15 AM',
    status: 'Pending',
  },

  {
    id: 'APT-1023',
    patient: 'Vikram Mehta',
    doctor: 'Dr. Raj Kumar',
    department: 'Orthopedic',
    date: '26 Jul 2026',
    time: '12:00 PM',
    status: 'Completed',
  },

  {
    id: 'APT-1024',
    patient: 'Anita Verma',
    doctor: 'Dr. Neha Shah',
    department: 'Dermatology',
    date: '26 Jul 2026',
    time: '02:30 PM',
    status: 'Cancelled',
  },
];

export default function AdminDashboard() {
  return (
    <AppLayout role="admin">
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Hospital Overview</h1>

            <p className="text-sm text-slate-500 mt-1">
              Saturday, July 26, 2026 • Last updated 2 minutes ago
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="
flex items-center gap-2
px-4 py-2
border rounded-xl
text-sm
bg-white
hover:bg-slate-50
"
            >
              <Download size={16} />
              Export
            </button>

            <button
              className="
flex items-center gap-2
px-4 py-2
border rounded-xl
text-sm
bg-white
hover:bg-slate-50
"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>

            <button
              className="
flex items-center gap-2
px-4 py-2
rounded-xl
text-sm
bg-cyan-600
text-white
hover:bg-cyan-700
"
            >
              <Plus size={16} />
              New Appointment
            </button>
          </div>
        </div>

        {/* STAT CARDS */}

        <div
          className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
"
        >
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
bg-white
border
rounded-2xl
p-5
shadow-sm
"
              >
                <div className="flex justify-between">
                  <div
                    className={`
w-12
h-12
rounded-xl
flex
items-center
justify-center
${item.color}
`}
                  >
                    <Icon size={24} />
                  </div>

                  <TrendingUp size={18} className="text-green-600" />
                </div>

                <p className="text-xs text-slate-500 mt-5 tracking-wide">{item.title}</p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">{item.value}</h2>

                <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>

                <p className="text-xs text-green-600 mt-3 font-semibold">↑ {item.growth}</p>
              </div>
            );
          })}
        </div>
        {/* APPOINTMENT ANALYTICS + QUICK ACTIONS */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* APPOINTMENT VOLUME */}

          <div
            className="
xl:col-span-2
bg-white
border
rounded-2xl
p-6
shadow-sm
"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Appointment Volume</h2>

                <p className="text-sm text-slate-500">Last 30 days</p>
              </div>

              <div className="flex items-center gap-2 text-cyan-700">
                <TrendingUp size={18} />

                <span className="text-sm font-semibold">+15%</span>
              </div>
            </div>

            {/* SIMPLE LINE STYLE GRAPH */}

            <div
              className="
h-64
flex
items-end
justify-between
gap-3
px-4
"
            >
              {[55, 70, 45, 85, 65, 90, 75].map((value, index) => (
                <div
                  key={index}
                  className="
flex
flex-col
items-center
gap-2
flex-1
"
                >
                  <div
                    className="
w-full
bg-cyan-500
rounded-t-xl
transition-all
"
                    style={{
                      height: `${value}%`,
                    }}
                  ></div>

                  <span
                    className="
text-xs
text-slate-400
"
                  >
                    {['Jun 26', 'Jul 1', 'Jul 6', 'Jul 11', 'Jul 16', 'Jul 21', 'Jul 26'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DEPARTMENT ANALYTICS */}

          <div
            className="
bg-white
border
rounded-2xl
p-6
shadow-sm
"
          >
            <h2
              className="
text-lg
font-bold
text-slate-800
"
            >
              By Department
            </h2>

            <p className="text-sm text-slate-500 mb-6">This month</p>

            <div className="space-y-5">
              {[
                {
                  name: 'Cardiology',
                  count: 312,
                  percent: '20%',
                  color: 'bg-blue-500',
                },
                {
                  name: 'Orthopedics',
                  count: 248,
                  percent: '16%',
                  color: 'bg-cyan-500',
                },
                {
                  name: 'Neurology',
                  count: 189,
                  percent: '12%',
                  color: 'bg-purple-500',
                },
                {
                  name: 'Pediatrics',
                  count: 276,
                  percent: '17%',
                  color: 'bg-green-500',
                },
              ].map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{dept.name}</span>

                    <div className="flex gap-3 text-slate-500">
                      <span>{dept.count}</span>

                      <span>{dept.percent}</span>
                    </div>
                  </div>

                  <div
                    className="
h-2
bg-slate-100
rounded-full
overflow-hidden
"
                  >
                    <div
                      className={`
h-full
${dept.color}
rounded-full
`}
                      style={{
                        width: dept.percent,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div
          className="
bg-white
border
rounded-2xl
p-6
shadow-sm
"
        >
          <h2
            className="
text-lg
font-bold
text-slate-800
mb-5
"
          >
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 xl:grid-cols-1 gap-4">
            <button
              className="
flex
items-center
gap-4
p-4
rounded-xl
bg-cyan-50
hover:bg-cyan-100
transition
"
            >
              <div
                className="
w-11
h-11
rounded-xl
bg-cyan-600
text-white
flex
items-center
justify-center
"
              >
                <UserPlus size={22} />
              </div>

              <div className="text-left">
                <p
                  className="
font-semibold
text-slate-800
"
                >
                  Add Doctor
                </p>

                <p
                  className="
text-xs
text-slate-500
"
                >
                  Register new doctor
                </p>
              </div>
            </button>

            <button
              className="
flex
items-center
gap-4
p-4
rounded-xl
bg-blue-50
hover:bg-blue-100
transition
"
            >
              <div
                className="
w-11
h-11
rounded-xl
bg-blue-600
text-white
flex
items-center
justify-center
"
              >
                <CalendarPlus size={22} />
              </div>

              <div className="text-left">
                <p
                  className="
font-semibold
text-slate-800
"
                >
                  Manage Appointments
                </p>

                <p
                  className="
text-xs
text-slate-500
"
                >
                  View today's schedule
                </p>
              </div>
            </button>

            <button
              className="
flex
items-center
gap-4
p-4
rounded-xl
bg-purple-50
hover:bg-purple-100
transition
"
            >
              <div
                className="
w-11
h-11
rounded-xl
bg-purple-600
text-white
flex
items-center
justify-center
"
              >
                <FileText size={22} />
              </div>

              <div className="text-left">
                <p
                  className="
font-semibold
text-slate-800
"
                >
                  Reports
                </p>

                <p
                  className="
text-xs
text-slate-500
"
                >
                  Generate hospital reports
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* // ================= RECENT APPOINTMENTS ================= */}

        <div
          className="
bg-white
border
rounded-2xl
p-6
shadow-sm
"
        >
          <div
            className="
flex
justify-between
items-center
mb-6
"
          >
            <div>
              <h2
                className="
text-lg
font-bold
text-slate-800
"
              >
                Recent Appointments
              </h2>

              <p
                className="
text-sm
text-slate-500
"
              >
                Latest patient appointments
              </p>
            </div>

            <button
              className="
flex
items-center
gap-1
text-sm
font-semibold
text-cyan-700
hover:text-cyan-800
"
            >
              View All
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              className="
w-full
text-sm
"
            >
              <thead>
                <tr
                  className="
border-b
text-slate-500
"
                >
                  <th className="text-left py-3">ID</th>

                  <th className="text-left py-3">Patient</th>

                  <th className="text-left py-3">Doctor</th>

                  <th className="text-left py-3">Department</th>

                  <th className="text-left py-3">Date</th>

                  <th className="text-left py-3">Time</th>

                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((item) => (
                  <tr
                    key={item.id}
                    className="
border-b
hover:bg-slate-50
transition
"
                  >
                    <td
                      className="
py-4
font-medium
text-slate-700
"
                    >
                      {item.id}
                    </td>

                    <td
                      className="
py-4
text-slate-700
"
                    >
                      {item.patient}
                    </td>

                    <td
                      className="
py-4
text-slate-700
"
                    >
                      {item.doctor}
                    </td>

                    <td
                      className="
py-4
text-slate-700
"
                    >
                      {item.department}
                    </td>

                    <td
                      className="
py-4
text-slate-700
"
                    >
                      {item.date}
                    </td>

                    <td
                      className="
py-4
text-slate-700
"
                    >
                      {item.time}
                    </td>

                    <td className="py-4">
                      <span
                        className={`
px-3
py-1
rounded-full
text-xs
font-semibold
${
  item.status === 'Confirmed'
    ? 'bg-green-100 text-green-700'
    : item.status === 'Pending'
      ? 'bg-yellow-100 text-yellow-700'
      : item.status === 'Completed'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-red-100 text-red-700'
}
`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SYSTEM INFORMATION ================= */}

        <div
          className="
    grid
    grid-cols-1
    gap-6
  "
        >
          {/* AI HEALTHCARE CARD */}

          <div
            className="
    bg-gradient-to-br
    from-cyan-600
    to-blue-700
    rounded-2xl
    p-6
    text-white
  "
          >
            <HeartPulse size={34} className="mb-4" />

            <h3
              className="
    text-lg
    font-bold
  "
            >
              CareSync AI Healthcare
            </h3>

            <p
              className="
    text-sm
    text-cyan-100
    mt-2
    leading-relaxed
  "
            >
              Smart hospital management platform with AI powered healthcare solutions, secure
              patient records and intelligent analytics.
            </p>

            <div
              className="
    mt-5
    flex
    items-center
    gap-2
    text-sm
  "
            >
              <div
                className="
    w-2
    h-2
    bg-green-300
    rounded-full
  "
              ></div>
              AI Services Ready
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
