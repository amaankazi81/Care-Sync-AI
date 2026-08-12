'use client';

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import departmentService from '@/services/departmentService';

import {
  Check,
  Eye,
  EyeOff,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  X,
} from 'lucide-react';

import { toast } from 'sonner';

import authService from '@/services/authService';
import type {
  Department,
  UserRole,
} from '@/services/authService';

interface RegisterForm {
  // Common

  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole;

  registrationCode: string;

  // Doctor

  specialization: string;
  qualification: string;
  experience: string;
  roomNumber: string;
  departmentId: string;
  isAvailable: boolean;

  // Patient

  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [form, setForm] = useState<RegisterForm>({
    //-----------------------------------
    // Common
    //-----------------------------------

    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',

    role: 'PATIENT',

    registrationCode: '',

    //-----------------------------------
    // Doctor
    //-----------------------------------

    specialization: '',
    qualification: '',
    experience: '',
    roomNumber: '',
    departmentId: '',
    isAvailable: true,

    //-----------------------------------
    // Patient
    //-----------------------------------

    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);

      const departments =
        await departmentService.getDepartments();

      console.log('Departments:', departments);

      setDepartments(departments);
    } catch (error) {
      console.error(error);

      toast.error('Unable to load departments');
    } finally {
      setLoadingDepartments(false);
    }
  };

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /\d/.test(form.password),
    }),
    [form.password]
  );

  const passwordStrength =
    Object.values(passwordChecks).filter(Boolean)
      .length;

  const strengthLabel =
    passwordStrength === 0
      ? ''
      : passwordStrength <= 2
        ? 'Weak'
        : passwordStrength === 3
          ? 'Medium'
          : 'Strong';

  const strengthColor =
    passwordStrength <= 2
      ? 'bg-red-500'
      : passwordStrength === 3
        ? 'bg-yellow-500'
        : 'bg-green-500';

  function handleChange(
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '');

      if (digits.length <= 10) {
        setForm((prev) => ({
          ...prev,
          phoneNumber: digits,
        }));
      }

      return;
    }

    if (name === 'emergencyContactNumber') {
      const digits = value.replace(/\D/g, '');

      if (digits.length <= 10) {
        setForm((prev) => ({
          ...prev,
          emergencyContactNumber: digits,
        }));
      }

      return;
    }

    if (type === 'checkbox') {
      const checked = (
        e.target as HTMLInputElement
      ).checked;

      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    //---------------------------------
    // Common validation
    //---------------------------------

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error('Please fill all required fields');

      return;
    }

    if (form.phoneNumber.length !== 10) {
      toast.error(
        'Phone number must contain exactly 10 digits'
      );

      return;
    }

    if (passwordStrength < 4) {
      toast.error(
        'Password must contain uppercase, lowercase, number and minimum 8 characters.'
      );

      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');

      return;
    }

    //---------------------------------
    // Registration code
    //---------------------------------

    if (
      form.role !== 'PATIENT' &&
      !form.registrationCode.trim()
    ) {
      toast.error(
        'Registration code is required'
      );

      return;
    }

    //---------------------------------
    // Doctor Validation
    //---------------------------------

    if (form.role === 'DOCTOR') {
      if (
        !form.specialization ||
        !form.qualification ||
        !form.gender ||
        !form.departmentId
      ) {
        toast.error(
          'Please fill all doctor details.'
        );
        return;
      }
    }
    //---------------------------------
    // Patient Validation
    //---------------------------------

    if (form.role === 'PATIENT') {
      if (
        !form.dateOfBirth ||
        !form.gender ||
        !form.address
      ) {
        toast.error(
          'Please fill all patient details.'
        );

        return;
      }
    }

    setLoading(true);

    try {
      await authService.register({
        //---------------------------------
        // Common
        //---------------------------------

        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber,
        password: form.password,
        role: form.role,

        registrationCode:
          form.role === 'PATIENT'
            ? undefined
            : form.registrationCode,

        //---------------------------------
        // Doctor
        //---------------------------------

        specialization:
          form.role === 'DOCTOR'
            ? form.specialization
            : undefined,

        qualification:
          form.role === 'DOCTOR'
            ? form.qualification
            : undefined,

        experience:
          form.role === 'DOCTOR'
            ? Number(form.experience)
            : undefined,

        roomNumber:
          form.role === 'DOCTOR'
            ? form.roomNumber
            : undefined,

        departmentId:
          form.role === 'DOCTOR'
            ? form.departmentId
            : undefined,

        isAvailable:
          form.role === 'DOCTOR'
            ? form.isAvailable
            : undefined,

        //---------------------------------
        // Patient
        //---------------------------------

        dateOfBirth:
          form.role === 'PATIENT'
            ? form.dateOfBirth
            : undefined,

        gender:
          form.role === 'PATIENT' || form.role === 'DOCTOR'
            ? form.gender
            : undefined,

        bloodGroup:
          form.role === 'PATIENT'
            ? form.bloodGroup
            : undefined,

        address:
          form.role === 'PATIENT'
            ? form.address
            : undefined,

        emergencyContactName:
          form.role === 'PATIENT'
            ? form.emergencyContactName
            : undefined,

        emergencyContactNumber:
          form.role === 'PATIENT'
            ? form.emergencyContactNumber
            : undefined,
      });

      toast.success(
        'Account created successfully.'
      );
      console.log('Redirecting to login...');
      router.replace('/login');
      
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-slate-100 lg:grid lg:grid-cols-2 overflow-hidden">

      <aside
        className="
    hidden
    lg:flex
    lg:flex-col
    sticky
    top-0
    h-screen
    overflow-hidden
    bg-gradient-to-br
    from-cyan-700
    via-blue-800
    to-slate-950
    text-white
    px-16
    pt-20
    pb-12
  "
      >

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative max-w-md">

          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">

            <HeartPulse size={36} />

          </div>

          <p className="mb-3 text-sm font-semibold tracking-[0.22em] text-cyan-200">

            CareSync AI

          </p>

          <h1 className="text-4xl font-bold leading-tight">

            Better care begins with a connected account.

          </h1>

          <p className="mt-6 text-lg leading-8 text-cyan-50/90">

            Register yourself and securely access every healthcare
            service in one place.

          </p>

          <div className="mt-12 space-y-6">

            <Feature
              icon={<ShieldCheck size={26} />}
              title="Secure"
              text="End-to-end protected healthcare platform."
            />

            <Feature
              icon={<Stethoscope size={26} />}
              title="Modern Healthcare"
              text="Appointments, reports, prescriptions and doctors together."
            />

          </div>

        </div>

      </aside>

      <main
        className="
    h-screen
    overflow-y-auto
    flex
    justify-center
    p-8
  "
      >

        <form
          onSubmit={handleSubmit}
          className="
    w-full
    max-w-2xl
    min-h-fit
    rounded-3xl
    bg-white
    p-10
    shadow-xl
  "
        >
          <div className="mb-10 text-center">

            <div className="mb-4 flex justify-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">

                <UserPlus size={28} />

              </div>

            </div>

            <h2 className="text-3xl font-bold text-slate-900">

              Create your account

            </h2>

            <p className="mt-2 text-slate-500">

              Register to access the CareSync Hospital Management System.

            </p>

          </div>

          {/* ==========================================
                  COMMON DETAILS
          ========================================== */}

          <div className="grid gap-4 sm:grid-cols-2">

            <InputField
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange}
            />

            <InputField
              label="Last Name"
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange}
            />

          </div>

          <div className="mt-4">

            <InputField
              label="Username"
              name="username"
              placeholder="Choose username"
              value={form.username}
              onChange={handleChange}
            />

          </div>

          <div className="mt-4">

            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div className="mt-4">

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Mobile Number

            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter mobile number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />

          </div>

          {/* ==========================================
                  ROLE
          ========================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Register As

            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            >

              <option value="PATIENT">

                Patient

              </option>

              <option value="DOCTOR">

                Doctor

              </option>

              <option value="RECEPTIONIST">

                Receptionist

              </option>

              <option value="ADMIN">

                Administrator

              </option>

            </select>

          </div>

          {/* ==========================================
                 REGISTRATION CODE
          ========================================== */}

          {form.role !== 'PATIENT' && (

            <div className="mt-5">

              <InputField
                label="Registration Code"
                name="registrationCode"
                placeholder="Enter registration code"
                value={form.registrationCode}
                onChange={handleChange}
              />

              <p className="mt-2 text-xs text-amber-600">

                Registration code is mandatory for
                Doctor, Receptionist and Admin.

              </p>

            </div>

          )}

          {/* ==========================================
                    DOCTOR DETAILS
          ========================================== */}

          {form.role === 'DOCTOR' && (

            <>

              <div className="mt-8 border-t pt-8">

                <h3 className="mb-5 text-xl font-bold text-cyan-700">

                  Doctor Information

                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Specialization"
                    name="specialization"
                    placeholder="Cardiology"
                    value={form.specialization}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Qualification"
                    name="qualification"
                    placeholder="MBBS, MD"
                    value={form.qualification}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <InputField
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    placeholder="5"
                    value={form.experience}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Room Number"
                    name="roomNumber"
                    placeholder="101"
                    value={form.roomNumber}
                    onChange={handleChange}
                  />

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Department

                  </label>

                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  >

                    <option value="">

                      {loadingDepartments
                        ? 'Loading Departments...'
                        : 'Select Department'}

                    </option>

                    {departments.map((department) => (

                      <option
                        key={department.id}
                        value={department.id}
                      >

                        {department.name}

                      </option>

                    ))}

                  </select>

                </div>

                <div className="mt-5 flex items-center gap-3">

                  <input
                    id="isAvailable"
                    type="checkbox"
                    name="isAvailable"
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

            </>

          )}

          {/* PATIENT DETAILS START IN NEXT PART */}
          {/* ==========================================
                    PATIENT DETAILS
          ========================================== */}

          {form.role === 'PATIENT' && (

            <>

              <div className="mt-8 border-t pt-8">

                <h3 className="mb-5 text-xl font-bold text-cyan-700">

                  Patient Information

                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                      Date of Birth

                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                      Gender

                    </label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                    >

                      <option value="">

                        Select Gender

                      </option>

                      <option value="MALE">

                        Male

                      </option>

                      <option value="FEMALE">

                        Female

                      </option>

                      <option value="OTHER">

                        Other

                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                      Blood Group

                    </label>

                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
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

                  <InputField
                    label="Emergency Contact Name"
                    name="emergencyContactName"
                    placeholder="Full Name"
                    value={form.emergencyContactName}
                    onChange={handleChange}
                    required={false}
                  />

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Emergency Contact Number

                  </label>

                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    value={form.emergencyContactNumber}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 digit mobile number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Address

                  </label>

                  <textarea
                    name="address"
                    rows={4}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />

                </div>

              </div>

            </>

          )}

          {/* ==========================================
                    PASSWORD
          ========================================== */}

          <div className="mt-8 border-t pt-8">

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Password

            </label>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

            {form.password && (

              <>

                <div className="mt-4 flex gap-2">

                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${i <= passwordStrength
                        ? strengthColor
                        : 'bg-slate-200'
                        }`}
                    />
                  ))}

                </div>

                <p className="mt-2 text-sm text-slate-500">

                  Password Strength :
                  <span className="ml-2 font-semibold">

                    {strengthLabel}

                  </span>

                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">

                  <PasswordCheck
                    passed={passwordChecks.length}
                    text="8 Characters"
                  />

                  <PasswordCheck
                    passed={passwordChecks.uppercase}
                    text="Uppercase"
                  />

                  <PasswordCheck
                    passed={passwordChecks.lowercase}
                    text="Lowercase"
                  />

                  <PasswordCheck
                    passed={passwordChecks.number}
                    text="Number"
                  />

                </div>

              </>

            )}
            {/* ======================================
                    CONFIRM PASSWORD
            ====================================== */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Confirm Password

              </label>

              <div className="relative">

                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >

                  {showConfirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}

                </button>

              </div>

              {form.confirmPassword && (

                <p
                  className={`mt-2 text-sm font-medium ${form.password === form.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >

                  {form.password === form.confirmPassword
                    ? 'Passwords match.'
                    : 'Passwords do not match.'}

                </p>

              )}

            </div>

            {/* ======================================
                      NOTE
            ====================================== */}

            <div className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50 p-5">

              <p className="text-sm leading-6 text-cyan-900">

                <strong>Note:</strong>

                Patients can register directly.

                Doctors, Receptionists and Administrators
                must enter a valid registration code
                issued by the hospital administration.

              </p>

            </div>

            {/* ======================================
                     SUBMIT BUTTON
            ====================================== */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-cyan-700 px-4 py-3.5 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? 'Creating Account...'
                : 'Create Account'}

            </button>

            {/* ======================================
                       LOGIN LINK
            ====================================== */}

            <p className="mt-6 text-center text-sm text-slate-600">

              Already have an account?

              <Link
                href="/login"
                className="ml-2 font-semibold text-cyan-700 hover:text-cyan-800 hover:underline"
              >

                Login

              </Link>

            </p>

            {/* ======================================
                         FOOTER
            ====================================== */}

            <p className="mt-8 text-center text-xs text-slate-400">

              © 2026 CareSync Hospital Management System

            </p>

          </div>

        </form>

      </main>

    </div>

  );

}
/* ===========================================================
   INPUT FIELD
=========================================================== */

function InputField({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = true,
}: {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  value: string | number;
  required?: boolean;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
      />
    </div>
  );
}

/* ===========================================================
   LEFT SIDE FEATURES
=========================================================== */

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 text-cyan-200">
        {icon}
      </div>

      <div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-1 leading-6 text-cyan-100/90">
          {text}
        </p>

      </div>

    </div>
  );
}

/* ===========================================================
   PASSWORD CHECK
=========================================================== */

function PasswordCheck({
  passed,
  text,
}: {
  passed: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${passed
        ? 'text-emerald-600'
        : 'text-slate-500'
        }`}
    >
      {passed ? (
        <Check size={15} />
      ) : (
        <X size={15} />
      )}

      <span>{text}</span>
    </div>
  );
}