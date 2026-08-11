'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

import { toast } from 'sonner';

import doctorService from '@/services/doctorService';
import departmentService from '@/services/departmentService';
import authService from '@/services/authService';

import { Doctor, UpdateDoctorRequest } from '@/types/Doctor';
import { Department } from '@/types/Department';

interface Props {
  doctor?: Doctor;
}

interface DoctorRegistrationForm {
  // ==========================================
  // ACCOUNT INFORMATION
  // ==========================================

  username: string;
  password: string;
  confirmPassword: string;
  registrationCode: string;

  // ==========================================
  // COMMON INFORMATION
  // ==========================================

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;

  // ==========================================
  // DOCTOR INFORMATION
  // ==========================================

  specialization: string;
  qualification: string;
  experience: string;
  roomNumber: string;
  departmentId: string;
  isAvailable: boolean;
}

export default function DoctorForm({ doctor }: Props) {
  const router = useRouter();

  const isEditMode = Boolean(doctor);

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] = useState<DoctorRegistrationForm>({
    // Account

    username: '',
    password: '',
    confirmPassword: '',
    registrationCode: '',

    // Common

    firstName: doctor?.firstName ?? '',
    lastName: doctor?.lastName ?? '',
    email: doctor?.email ?? '',
    phoneNumber: doctor?.phone ?? '',
    gender: doctor?.gender ?? '',

    // Doctor

    specialization: doctor?.specialization ?? '',
    qualification: doctor?.qualification ?? '',
    experience: doctor?.experience?.toString() ?? '0',
    roomNumber: doctor?.roomNumber ?? '',
    departmentId: doctor?.departmentId ?? '',
    isAvailable: doctor?.isAvailable ?? true,
  });

  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD DEPARTMENTS
  // ==========================================

  useEffect(() => {
    async function loadDepartments() {
      try {
        setLoadingDepartments(true);

        const data = await departmentService.getDepartments();

        setDepartments(data);
      } catch (error) {
        console.error('Failed to load departments:', error);

        toast.error('Unable to load departments.');
      } finally {
        setLoadingDepartments(false);
      }
    }

    loadDepartments();
  }, []);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    // ------------------------------------------
    // PHONE NUMBER
    // ------------------------------------------

    if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '');

      if (digits.length <= 10) {
        setForm((previous) => ({
          ...previous,
          phoneNumber: digits,
        }));
      }

      return;
    }

    // ------------------------------------------
    // CHECKBOX
    // ------------------------------------------

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;

      setForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    // ------------------------------------------
    // NORMAL FIELD
    // ------------------------------------------

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================
  // VALIDATE NEW DOCTOR REGISTRATION
  // ==========================================

  function validateRegistration(): string | null {
    // ------------------------------------------
    // ACCOUNT VALIDATION
    // ------------------------------------------

    if (!form.username.trim()) {
      return 'Username is required.';
    }

    if (form.username.trim().length < 4) {
      return 'Username must contain at least 4 characters.';
    }

    if (!form.password) {
      return 'Password is required.';
    }

    if (form.password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (!form.confirmPassword) {
      return 'Please confirm the password.';
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }

    if (!form.registrationCode.trim()) {
      return 'Registration code is required for doctors.';
    }

    // ------------------------------------------
    // COMMON VALIDATION
    // ------------------------------------------

    if (!form.firstName.trim()) {
      return 'First name is required.';
    }

    if (!form.lastName.trim()) {
      return 'Last name is required.';
    }

    if (!form.email.trim()) {
      return 'Email is required.';
    }

    if (!form.phoneNumber) {
      return 'Phone number is required.';
    }

    if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
      return 'Phone number must contain exactly 10 digits.';
    }

    if (!form.gender) {
      return 'Please select gender.';
    }

    // ------------------------------------------
    // DOCTOR VALIDATION
    // ------------------------------------------

    if (!form.specialization.trim()) {
      return 'Specialization is required.';
    }

    if (!form.qualification.trim()) {
      return 'Qualification is required.';
    }

    if (!form.departmentId) {
      return 'Please select a department.';
    }

    return null;
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // =====================================================
    // EDIT EXISTING DOCTOR
    // =====================================================

    if (doctor) {
      try {
        setLoading(true);

        const payload: UpdateDoctorRequest = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phoneNumber,
          gender: form.gender,
          specialization: form.specialization.trim(),
          qualification: form.qualification.trim(),
          experience: Number(form.experience),
          roomNumber: form.roomNumber.trim(),
          isAvailable: form.isAvailable,
          departmentId: form.departmentId,
        };

        await doctorService.updateDoctor(doctor.id, payload);

        toast.success('Doctor updated successfully.');

        router.push('/admin-dashboard/doctors');
      } catch (error) {
        console.error('Doctor update error:', error);

        toast.error('Unable to update doctor.');
      } finally {
        setLoading(false);
      }

      return;
    }

    // =====================================================
    // NEW DOCTOR REGISTRATION
    // =====================================================

    const validationError = validateRegistration();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      /*
       * =====================================================
       * IMPORTANT ARCHITECTURE
       * =====================================================
       *
       * NEW DOCTOR REGISTRATION DOES NOT CALL:
       *
       * doctorService.createDoctor()
       *
       * Instead it goes through Spring Boot authentication:
       *
       * Next.js
       *    ↓
       * Spring Boot /api/auth/register
       *    ↓
       * Create DOCTOR user
       *    ↓
       * BCrypt password
       *    ↓
       * Spring forwards doctor profile
       *    ↓
       * .NET Doctor/Profile data
       *
       * This is the same registration flow used by the
       * main registration page.
       */

      await authService.register({
        // ==========================================
        // COMMON INFORMATION
        // ==========================================

        firstName: form.firstName.trim(),

        lastName: form.lastName.trim(),

        username: form.username.trim(),

        email: form.email.trim(),

        phoneNumber: form.phoneNumber,

        password: form.password,

        // ==========================================
        // ROLE
        // ==========================================

        role: 'DOCTOR',

        // ==========================================
        // REGISTRATION CODE
        // ==========================================

        registrationCode: form.registrationCode.trim(),

        // ==========================================
        // DOCTOR INFORMATION
        // ==========================================

        specialization: form.specialization.trim(),

        qualification: form.qualification.trim(),

        experience: Number(form.experience),

        roomNumber: form.roomNumber.trim(),

        departmentId: form.departmentId,

        isAvailable: form.isAvailable,

        // ==========================================
        // GENDER
        // ==========================================

        gender: form.gender,
      });

      // ==========================================
      // SUCCESS
      // ==========================================

      toast.success('Doctor registered successfully.');

      /*
       * Give Spring/.NET a moment to complete the
       * registration/profile creation before returning
       * to the doctor list.
       */

      setTimeout(() => {
        router.push('/admin-dashboard/doctors');
      }, 800);
    } catch (error: any) {
      console.error('Doctor registration error:', error);

      /*
       * authService.register() normally throws an Axios
       * error, so try to display the backend message.
       */

      const message =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Doctor registration failed.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // COMMON CSS
  // ==========================================

  const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    py-3
    text-sm
    text-slate-800
    placeholder:text-slate-400
    outline-none
    transition
    focus:border-cyan-600
    focus:ring-2
    focus:ring-cyan-100
  `;

  const labelClass = `
    mb-2
    block
    text-sm
    font-medium
    text-slate-700
  `;

  // ==========================================
  // UI
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      {/* ===================================================== */}
      {/* NEW DOCTOR ACCOUNT INFORMATION */}
      {/* ===================================================== */}

      {!isEditMode && (
        <div className="border-b border-slate-200 pb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
              <UserPlus size={20} className="text-cyan-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Doctor Login Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These credentials will be used by the doctor to log in to the
                doctor portal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* USERNAME */}

            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                className={inputClass}
              />

              <p className="mt-1 text-xs text-slate-500">
                Minimum 4 characters.
              </p>
            </div>

            {/* REGISTRATION CODE */}

            <div>
              <label htmlFor="registrationCode" className={labelClass}>
                Registration Code
              </label>

              <input
                id="registrationCode"
                name="registrationCode"
                type="text"
                placeholder="Enter doctor registration code"
                value={form.registrationCode}
                onChange={handleChange}
                className={inputClass}
              />

              <p className="mt-1 text-xs text-amber-600">
                Required for doctor registration.
              </p>
            </div>

            {/* PASSWORD */}

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Minimum 8 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* COMMON INFORMATION */}
      {/* ===================================================== */}

      <div>
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* FIRST NAME */}

          <div>
            <label htmlFor="firstName" className={labelClass}>
              First Name
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* LAST NAME */}

          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last Name
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* EMAIL */}

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {/* PHONE */}

          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number
            </label>

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* GENDER */}

          <div>
            <label htmlFor="gender" className={labelClass}>
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Gender</option>

              <option value="MALE">Male</option>

              <option value="FEMALE">Female</option>

              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* DOCTOR INFORMATION */}
      {/* ===================================================== */}

      <div className="border-t border-slate-200 pt-8">
        <h2 className="mb-6 text-xl font-bold text-cyan-700">
          Doctor Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* SPECIALIZATION */}

          <div>
            <label htmlFor="specialization" className={labelClass}>
              Specialization
            </label>

            <input
              id="specialization"
              name="specialization"
              type="text"
              placeholder="Cardiology"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* QUALIFICATION */}

          <div>
            <label htmlFor="qualification" className={labelClass}>
              Qualification
            </label>

            <input
              id="qualification"
              name="qualification"
              type="text"
              placeholder="MBBS, MD"
              value={form.qualification}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* EXPERIENCE */}

          <div>
            <label htmlFor="experience" className={labelClass}>
              Experience (Years)
            </label>

            <input
              id="experience"
              name="experience"
              type="number"
              min="0"
              placeholder="5"
              value={form.experience}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* ROOM NUMBER */}

          <div>
            <label htmlFor="roomNumber" className={labelClass}>
              Room Number
            </label>

            <input
              id="roomNumber"
              name="roomNumber"
              type="text"
              placeholder="101"
              value={form.roomNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* DEPARTMENT */}

          <div>
            <label htmlFor="departmentId" className={labelClass}>
              Department
            </label>

            <select
              id="departmentId"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                {loadingDepartments
                  ? 'Loading Departments...'
                  : 'Select Department'}
              </option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AVAILABLE */}

        <div className="mt-6 flex items-center gap-3">
          <input
            id="isAvailable"
            name="isAvailable"
            type="checkbox"
            checked={form.isAvailable}
            onChange={handleChange}
            className="h-5 w-5"
          />

          <label
            htmlFor="isAvailable"
            className="font-medium text-slate-700"
          >
            Available for Appointments
          </label>
        </div>
      </div>

      {/* ===================================================== */}
      {/* SUBMIT */}
      {/* ===================================================== */}

      <div className="flex flex-col justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
        {/* CANCEL */}

        <button
          type="button"
          disabled={loading}
          onClick={() => router.push('/admin-dashboard/doctors')}
          className="
            rounded-lg
            border
            border-slate-300
            px-6
            py-3
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-cyan-700
            px-7
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-800
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />

              {isEditMode ? 'Updating...' : 'Registering...'}
            </>
          ) : (
            <>
              {!isEditMode && <UserPlus size={18} />}

              {isEditMode ? 'Update Doctor' : 'Add Doctor'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}