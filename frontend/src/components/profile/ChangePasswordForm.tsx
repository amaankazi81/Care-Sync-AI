'use client';

import { useState } from 'react';
import profileService from '@/services/profileService';

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await profileService.changePassword(form);

      alert('Password Changed Successfully');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      alert('Password Change Failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        className="w-full border rounded p-2"
        value={form.currentPassword}
        onChange={(e) =>
          setForm({
            ...form,
            currentPassword: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full border rounded p-2"
        value={form.newPassword}
        onChange={(e) =>
          setForm({
            ...form,
            newPassword: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border rounded p-2"
        value={form.confirmPassword}
        onChange={(e) =>
          setForm({
            ...form,
            confirmPassword: e.target.value,
          })
        }
      />

      <button className="bg-red-600 text-white px-5 py-2 rounded" type="submit">
        Change Password
      </button>
    </form>
  );
}
