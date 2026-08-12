'use client';

import { useState } from 'react';

import profileService, { UserProfile } from '@/services/profileService';

interface Props {
  user: UserProfile;

  onUpdate: (user: UserProfile) => void;
}

export default function EditProfileForm({ user, onUpdate }: Props) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const updated = await profileService.updateProfile(form);

      onUpdate(updated);

      alert('Profile Updated Successfully');
    } catch (error) {
      alert('Update Failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <input
        className="w-full border rounded p-2"
        value={form.firstName}
        placeholder="First Name"
        onChange={(e) =>
          setForm({
            ...form,
            firstName: e.target.value,
          })
        }
      />

      <input
        className="w-full border rounded p-2"
        value={form.lastName}
        placeholder="Last Name"
        onChange={(e) =>
          setForm({
            ...form,
            lastName: e.target.value,
          })
        }
      />

      <input
        className="w-full border rounded p-2"
        value={form.email}
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        className="w-full border rounded p-2"
        value={form.phoneNumber}
        placeholder="Phone Number"
        onChange={(e) =>
          setForm({
            ...form,
            phoneNumber: e.target.value,
          })
        }
      />

      <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded">
        Update Profile
      </button>
    </form>
  );
}
