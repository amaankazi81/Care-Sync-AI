'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

import authService from '@/services/authService';
import { saveTokens } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      router.replace('/');
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        username,
        password,
      });

      saveTokens(response.accessToken, response.refreshToken, response.role);

      switch (response.role) {
        case 'ADMIN':
          router.push('/admin-dashboard');
          break;

        case 'DOCTOR':
          router.push('/doctor-dashboard');
          break;

        case 'PATIENT':
          router.push('/patient-dashboard');
          break;

        case 'RECEPTIONIST':
          router.push('/receptionist-dashboard');
          break;

        default:
          setError('Invalid user role.');
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid Username or Password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      {/* LEFT SIDE */}

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-cyan-700 via-blue-800 to-blue-950 text-white p-16">
        <div className="max-w-md">
          <HeartPulse size={60} className="mb-6" />

          <h1 className="text-5xl font-bold">CareSync AI</h1>

          <p className="text-cyan-100 mt-4 text-lg">Smart Hospital Management System</p>

          <div className="mt-14 space-y-8">
            <div className="flex gap-4">
              <ShieldCheck size={30} />

              <div>
                <h3 className="font-semibold text-xl">Secure Authentication</h3>

                <p className="text-cyan-100 mt-1">
                  JWT based secure login with Role-Based Authorization.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Stethoscope size={30} />

              <div>
                <h3 className="font-semibold text-xl">Complete Hospital Solution</h3>

                <p className="text-cyan-100 mt-1">
                  Doctors • Patients • Appointments • Prescriptions • Reports • Billing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex justify-center items-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10"
        >
          <h2 className="text-3xl font-bold text-center text-slate-800">Welcome Back</h2>

          <p className="text-center text-slate-500 mt-2 mb-8">Sign in to continue to CareSync AI</p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 text-red-700 p-3 text-sm">{error}</div>
          )}

          {/* Username */}

          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700">Username</label>

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          {/* Password */}

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-slate-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}

          <div className="flex justify-end mt-3">
            <Link
              href="/forgot-password"
              className="text-sm text-cyan-700 hover:text-cyan-900 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-cyan-700 py-3 text-white font-semibold hover:bg-cyan-800 transition"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>

          {/* Register */}

          <div className="mt-8 border-t pt-6">
            <p className="text-center text-slate-500">Don't have an account?</p>

            <Link
              href="/register"
              className="mt-4 flex justify-center items-center gap-2 w-full rounded-lg border border-cyan-700 py-3 font-semibold text-cyan-700 hover:bg-cyan-700 hover:text-white transition"
            >
              <UserPlus size={18} />
              Create New Account
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Footer */}

          <div className="mt-8 text-center text-xs text-slate-400">
            © 2026 CareSync AI Hospital Management System
          </div>
        </form>
      </div>
    </div>
  );
}
