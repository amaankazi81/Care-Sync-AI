'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import profileService from '@/services/profileService';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
    }),
    [newPassword]
  );

  const strength = Object.values(passwordChecks).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all password fields.');
      return;
    }

    if (strength < 4) {
      toast.error('New password must have 8 characters, uppercase, lowercase and a number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await profileService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to change password.');
    } finally {
      setLoading(false);
    }
  }

  const barColor =
    strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Account Security</h2>
          <p className="mt-1 text-sm text-slate-500">
            Change your password regularly to keep your account secure.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          visible={showCurrent}
          onToggle={() => setShowCurrent((value) => !value)}
          placeholder="Enter current password"
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          visible={showNew}
          onToggle={() => setShowNew((value) => !value)}
          placeholder="Create a new password"
        />

        {newPassword && (
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Password strength</span>
              <span className="font-semibold text-slate-700">
                {strength <= 2 ? 'Weak' : strength === 3 ? 'Medium' : 'Strong'}
              </span>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={`h-1.5 flex-1 rounded-full ${
                    item <= strength ? barColor : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <CheckItem passed={passwordChecks.length} text="8+ characters" />
              <CheckItem passed={passwordChecks.uppercase} text="Uppercase" />
              <CheckItem passed={passwordChecks.lowercase} text="Lowercase" />
              <CheckItem passed={passwordChecks.number} text="Number" />
            </div>
          </div>
        )}

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirm}
          onToggle={() => setShowConfirm((value) => !value)}
          placeholder="Re-enter new password"
        />

        {confirmPassword && (
          <p
            className={`text-xs font-medium ${
              newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {newPassword === confirmPassword ? 'Passwords match.' : 'Passwords do not match.'}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <KeyRound size={18} />
              Change Password
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

function CheckItem({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${
        passed ? 'text-emerald-600' : 'text-slate-500'
      }`}
    >
      {passed ? <Check size={14} /> : <X size={14} />}
      {text}
    </div>
  );
}
