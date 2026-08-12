'use client';

import { useEffect, useState } from 'react';
import { AtSign, LoaderCircle, Mail, Phone, Save, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import profileService, { UpdateProfileRequest, UserProfile } from '@/services/profileService';

type EditProfileFormProps = {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
};

export default function EditProfileForm({ user, onUpdate }: EditProfileFormProps) {
  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '');

      if (digitsOnly.length <= 10) {
        setForm((previous) => ({
          ...previous,
          phoneNumber: digitsOnly,
        }));
      }

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phoneNumber
    ) {
      toast.error('Please fill all profile fields.');
      return;
    }

    if (form.phoneNumber.length !== 10) {
      toast.error('Phone number must contain exactly 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await profileService.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber,
      });

      onUpdate(updatedUser);
      toast.success('Profile updated successfully.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to update your profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
          <UserRound size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
          <p className="mt-1 text-sm text-slate-500">Keep your contact information up to date.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

          <FormInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
            <AtSign size={18} />
            <span className="text-sm font-medium">{user.username}</span>
          </div>

          <p className="mt-1.5 text-xs text-slate-500">Username cannot be changed.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mobile Number</label>

          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="tel"
              name="phoneNumber"
              inputMode="numeric"
              value={form.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              required
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
      />
    </div>
  );
}
