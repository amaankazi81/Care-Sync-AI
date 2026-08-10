'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import authService from '@/services/authService';
import { toast } from 'sonner';

import { HeartPulse, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function passwordStrength(password: string) {
    if (password.length < 6)
      return {
        label: 'Weak',
        color: 'bg-red-500',
        width: 'w-1/3',
      };

    if (password.length < 10)
      return {
        label: 'Medium',
        color: 'bg-yellow-500',
        width: 'w-2/3',
      };

    return {
      label: 'Strong',
      color: 'bg-green-500',
      width: 'w-full',
    };
  }

  const strength = passwordStrength(newPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      toast.success(res.message || 'Password changed successfully.');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left */}

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white p-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-white/20 rounded-full p-4">
            <HeartPulse size={42} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">CareSync HMS</h1>

            <p className="text-blue-100 mt-2">Hospital Management System</p>
          </div>
        </div>

        <h2 className="text-5xl font-bold leading-tight">
          Create
          <br />
          New Password
        </h2>

        <p className="mt-8 text-lg text-blue-100 leading-8 max-w-md">
          Your new password should be different from your previous password and should be easy for
          you to remember but difficult for others to guess.
        </p>

        <div className="mt-16 space-y-4 text-blue-100">
          <div>✓ Minimum 8 characters</div>

          <div>✓ Strong password recommended</div>

          <div>✓ Securely encrypted</div>
        </div>
      </div>

      {/* Right */}

      <div className="flex justify-center items-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-5">
              <KeyRound size={30} className="text-blue-600" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800">Reset Password</h2>

            <p className="text-slate-500 mt-2 mb-8">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="mt-3">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className={`h-full ${strength.width} ${strength.color}`} />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Password Strength:
                  <span className="font-semibold ml-1">{strength.label}</span>
                </p>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-500 text-sm mt-2">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition disabled:opacity-60"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
