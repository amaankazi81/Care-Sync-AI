'use client';

import { useState } from 'react';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SPRING_API_BASE_URL =
  process.env.NEXT_PUBLIC_SPRING_API_BASE_URL ||
  'http://localhost:8080';

interface RegisterPatientFormData {
  username: string;
  password: string;
  confirmPassword: string;

  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  email: string;
  phoneNumber: string;
  address: string;

  emergencyContactName: string;
  emergencyContactNumber: string;
}

export default function RegisterPatientForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPatientFormData>({
    username: '',
    password: '',
    confirmPassword: '',

    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    email: '',
    phoneNumber: '',
    address: '',

    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
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

    if (!form.firstName.trim()) {
      return 'First name is required.';
    }

    if (!form.lastName.trim()) {
      return 'Last name is required.';
    }

    if (!form.dateOfBirth) {
      return 'Date of birth is required.';
    }

    if (!form.gender) {
      return 'Please select gender.';
    }

    if (!form.email.trim()) {
      return 'Email is required.';
    }

    if (!form.phoneNumber.trim()) {
      return 'Phone number is required.';
    }

    if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
      return 'Phone number must contain exactly 10 digits.';
    }

    if (!form.bloodGroup) {
      return 'Please select blood group.';
    }

    if (!form.address.trim()) {
      return 'Address is required.';
    }

    if (!form.emergencyContactName.trim()) {
      return 'Emergency contact name is required.';
    }

    if (!form.emergencyContactNumber.trim()) {
      return 'Emergency contact number is required.';
    }

    if (!/^[0-9]{10}$/.test(form.emergencyContactNumber)) {
      return 'Emergency contact number must contain exactly 10 digits.';
    }

    return null;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT
       *
       * We are NOT calling the .NET patient API directly.
       *
       * We call Spring Boot:
       *
       * POST /api/auth/register
       *
       * Spring will:
       *
       * 1. Create the PATIENT user in Spring MySQL database.
       * 2. Encode the password using BCrypt.
       * 3. Forward the patient profile to .NET.
       */

      const requestBody = {
        username: form.username.trim(),

        email: form.email.trim(),

        password: form.password,

        firstName: form.firstName.trim(),

        lastName: form.lastName.trim(),

        phoneNumber: form.phoneNumber.trim(),

        role: 'PATIENT',

        /*
         * No registrationCode is required for PATIENT.
         */

        dateOfBirth: form.dateOfBirth,

        gender: form.gender,

        bloodGroup: form.bloodGroup,

        address: form.address.trim(),

        emergencyContactName:
          form.emergencyContactName.trim(),

        emergencyContactNumber:
          form.emergencyContactNumber.trim(),
      };

      console.log(
        'Registering patient through Spring API:',
        {
          ...requestBody,
          password: '********',
        }
      );

      const response = await fetch(
        `${SPRING_API_BASE_URL}/api/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(requestBody),
        }
      );

      let result: any = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        console.error(
          'Patient registration failed:',
          {
            status: response.status,
            statusText: response.statusText,
            response: result,
          }
        );

        /*
         * Spring validation response
         */

        if (
          result &&
          typeof result === 'object' &&
          result.errors
        ) {
          const errors = result.errors;

          const messages = Object.entries(errors)
            .flatMap(([field, fieldErrors]) => {
              if (Array.isArray(fieldErrors)) {
                return fieldErrors.map(
                  (message) =>
                    `${field}: ${message}`
                );
              }

              return [
                `${field}: ${String(fieldErrors)}`,
              ];
            })
            .join(' ');

          throw new Error(
            messages ||
              'Patient registration failed.'
          );
        }

        /*
         * Standard Spring API response
         */

        if (
          result &&
          typeof result === 'object' &&
          typeof result.message === 'string'
        ) {
          throw new Error(result.message);
        }

        throw new Error(
          `Patient registration failed. Status: ${response.status}`
        );
      }

      /*
       * Registration successful
       */

      toast.success(
        'Patient registered successfully.'
      );

      /*
       * Clear the form
       */

      setForm({
        username: '',
        password: '',
        confirmPassword: '',

        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        email: '',
        phoneNumber: '',
        address: '',

        emergencyContactName: '',
        emergencyContactNumber: '',
      });

      /*
       * Return to patients page after a short delay.
       */

      setTimeout(() => {
        router.push(
          '/receptionist-dashboard/patients'
        );
      }, 1000);
    } catch (error) {
      console.error(
        'Patient registration error:',
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to register patient.'
      );
    } finally {
      setLoading(false);
    }
  };

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
    block
    text-sm
    font-medium
    text-slate-700
    mb-2
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-xl
        border
        border-slate-200
        shadow-sm
        p-8
      "
    >
      {/* ===================================================== */}
      {/* ACCOUNT INFORMATION */}
      {/* ===================================================== */}

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-cyan-100
              flex
              items-center
              justify-center
            "
          >
            <UserPlus
              size={20}
              className="text-cyan-700"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Patient Login Account
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              These credentials will be used by the patient
              to log in to the patient portal.
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >
          {/* Username */}

          <div>
            <label
              htmlFor="username"
              className={labelClass}
            >
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

            <p className="text-xs text-slate-500 mt-1">
              Minimum 4 characters.
            </p>
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className={labelClass}
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                  hover:text-slate-800
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Minimum 8 characters.
            </p>
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClass}
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                  hover:text-slate-800
                "
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

      {/* ===================================================== */}
      {/* PERSONAL INFORMATION */}
      {/* ===================================================== */}

      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Personal Information
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >
          {/* First Name */}

          <div>
            <label
              htmlFor="firstName"
              className={labelClass}
            >
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

          {/* Last Name */}

          <div>
            <label
              htmlFor="lastName"
              className={labelClass}
            >
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

          {/* Date of Birth */}

          <div>
            <label
              htmlFor="dateOfBirth"
              className={labelClass}
            >
              Date of Birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Gender */}

          <div>
            <label
              htmlFor="gender"
              className={labelClass}
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Blood Group */}

          <div>
            <label
              htmlFor="bloodGroup"
              className={labelClass}
            >
              Blood Group
            </label>

            <select
              id="bloodGroup"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Blood Group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className={labelClass}
            >
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

          {/* Phone */}

          <div>
            <label
              htmlFor="phoneNumber"
              className={labelClass}
            >
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

          {/* Address */}

          <div>
            <label
              htmlFor="address"
              className={labelClass}
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Enter complete address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* EMERGENCY CONTACT */}
      {/* ===================================================== */}

      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Emergency Contact
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >
          {/* Emergency Contact Name */}

          <div>
            <label
              htmlFor="emergencyContactName"
              className={labelClass}
            >
              Emergency Contact Name
            </label>

            <input
              id="emergencyContactName"
              name="emergencyContactName"
              type="text"
              placeholder="Enter emergency contact name"
              value={form.emergencyContactName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Emergency Contact Number */}

          <div>
            <label
              htmlFor="emergencyContactNumber"
              className={labelClass}
            >
              Emergency Contact Number
            </label>

            <input
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit number"
              value={form.emergencyContactNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* SUBMIT */}
      {/* ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
          justify-end
          border-t
          border-slate-200
          pt-6
        "
      >
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            router.push(
              '/receptionist-dashboard/patients'
            )
          }
          className="
            px-6
            py-3
            rounded-lg
            border
            border-slate-300
            text-slate-700
            font-semibold
            hover:bg-slate-50
            transition
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            px-7
            py-3
            rounded-lg
            bg-cyan-700
            hover:bg-cyan-800
            text-white
            font-semibold
            transition
            flex
            items-center
            justify-center
            gap-2
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Registering...
            </>
          ) : (
            <>
              <UserPlus size={18} />

              Register Patient
            </>
          )}
        </button>
      </div>
    </form>
  );
}