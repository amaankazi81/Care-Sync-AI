'use client';

import { useState } from 'react';
import Link from 'next/link';
import authService from '@/services/authService';
import { toast } from 'sonner';
import { ArrowLeft, HeartPulse, Mail, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);

      toast.success(res.message || 'Password reset link sent successfully.');

      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left Side */}

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
          Forgot
          <br />
          Password?
        </h2>

        <p className="mt-8 text-lg text-blue-100 leading-8 max-w-md">
          No worries. Enter your registered email address and we'll send you a secure password reset
          link.
        </p>

        <div className="mt-16 space-y-4 text-blue-100">
          <div>✓ Secure Password Recovery</div>

          <div>✓ Email Verification</div>

          <div>✓ Token expires in 30 minutes</div>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex justify-center items-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-5">
              <Mail className="text-blue-600" size={30} />
            </div>

            <h2 className="text-3xl font-bold text-slate-800">Forgot Password</h2>

            <p className="text-slate-500 mt-2 mb-8">
              Enter your registered email to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition disabled:opacity-60"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  Send Reset Link
                </>
              )}
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
