'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import doctorService from '@/services/doctorService';

import {
  decodeToken,
  getAccessToken,
  getRole,
  type JwtPayload,
} from '@/utils/auth';

import type { Doctor } from '@/types/Doctor';

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Save,
  Loader2,
} from 'lucide-react';

export default function DoctorAvailabilityPage() {
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  /**
   * Normalize values before comparing them.
   *
   * Example:
   *
   * "Vaibhav@Gmail.com"
   * "vaibhav@gmail.com"
   *
   * will both become:
   *
   * "vaibhav@gmail.com"
   */
  const normalize = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim().toLowerCase();
  };

  /**
   * Extract all useful identity values from JWT.
   *
   * We do NOT assume that the backend uses only "sub".
   */
  const getJwtIdentityValues = (
    decoded: JwtPayload | null
  ): string[] => {
    if (!decoded) {
      return [];
    }

    const possibleClaims = [
      decoded.sub,
      decoded.email,
      decoded.name,
      decoded.unique_name,
      decoded.preferred_username,
      decoded.username,
      decoded.userName,
      decoded.userId,
    ];

    const values = possibleClaims
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ''
      )
      .map((value) => normalize(value));

    return [...new Set(values)];
  };

  /**
   * Try to find the logged-in doctor.
   *
   * Priority:
   *
   * 1. Doctor email
   * 2. Doctor ID
   * 3. Doctor name
   * 4. Username/name combination
   */
  const findLoggedInDoctor = (
    doctors: Doctor[],
    decoded: JwtPayload | null
  ): Doctor | null => {
    const identityValues = getJwtIdentityValues(decoded);

    console.log(
      'Identity values found:',
      identityValues
    );

    if (identityValues.length === 0) {
      return null;
    }

    /**
     * --------------------------------------------------
     * MATCH 1: EMAIL
     * --------------------------------------------------
     */
    const emailMatch = doctors.find((doctor) => {
      const doctorEmail = normalize(doctor.email);

      return (
        doctorEmail !== '' &&
        identityValues.includes(doctorEmail)
      );
    });

    if (emailMatch) {
      console.log(
        'Doctor matched using email:',
        emailMatch
      );

      return emailMatch;
    }

    /**
     * --------------------------------------------------
     * MATCH 2: DOCTOR ID
     * --------------------------------------------------
     */
    const idMatch = doctors.find((doctor) => {
      const doctorId = normalize(doctor.id);

      return (
        doctorId !== '' &&
        identityValues.includes(doctorId)
      );
    });

    if (idMatch) {
      console.log(
        'Doctor matched using doctor ID:',
        idMatch
      );

      return idMatch;
    }

    /**
     * --------------------------------------------------
     * MATCH 3: FULL NAME
     * --------------------------------------------------
     */
    const fullNameMatch = doctors.find((doctor) => {
      const fullName = normalize(
        `${doctor.firstName} ${doctor.lastName}`
      );

      return (
        fullName !== '' &&
        identityValues.includes(fullName)
      );
    });

    if (fullNameMatch) {
      console.log(
        'Doctor matched using full name:',
        fullNameMatch
      );

      return fullNameMatch;
    }

    /**
     * --------------------------------------------------
     * MATCH 4: FIRST NAME
     * --------------------------------------------------
     */
    const firstNameMatch = doctors.find((doctor) => {
      const firstName = normalize(
        doctor.firstName
      );

      return (
        firstName !== '' &&
        identityValues.includes(firstName)
      );
    });

    if (firstNameMatch) {
      console.log(
        'Doctor matched using first name:',
        firstNameMatch
      );

      return firstNameMatch;
    }

    /**
     * --------------------------------------------------
     * MATCH 5: USERNAME CONTAINS EMAIL
     * --------------------------------------------------
     */
    const partialEmailMatch = doctors.find(
      (doctor) => {
        const doctorEmail = normalize(
          doctor.email
        );

        if (!doctorEmail) {
          return false;
        }

        return identityValues.some(
          (identity) =>
            identity.includes(doctorEmail) ||
            doctorEmail.includes(identity)
        );
      }
    );

    if (partialEmailMatch) {
      console.log(
        'Doctor matched using partial email:',
        partialEmailMatch
      );

      return partialEmailMatch;
    }

    return null;
  };

  /**
   * --------------------------------------------------
   * LOAD CURRENT DOCTOR
   * --------------------------------------------------
   */
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);

        setError('');

        setSuccess('');

        const token = getAccessToken();

        const role = getRole();

        console.log(
          'Access token exists:',
          !!token
        );

        console.log(
          'Logged in role:',
          role
        );

        if (!token) {
          setError(
            'Authentication token not found. Please login again.'
          );

          setLoading(false);

          return;
        }

        if (
          role &&
          role.toLowerCase() !== 'doctor'
        ) {
          setError(
            'This page is available only for doctors.'
          );

          setLoading(false);

          return;
        }

        /**
         * Decode JWT
         */
        const decoded = decodeToken();

        console.log(
          'Decoded JWT:',
          decoded
        );

        if (!decoded) {
          setError(
            'Unable to read your login information. Please login again.'
          );

          setLoading(false);

          return;
        }

        /**
         * Get all doctors
         */
        const doctors =
          await doctorService.getDoctors();

        console.log(
          'Doctors received:',
          doctors
        );

        /**
         * Find currently logged-in doctor
         */
        const loggedInDoctor =
          findLoggedInDoctor(
            doctors,
            decoded
          );

        if (!loggedInDoctor) {
          console.error(
            'Unable to match logged-in user with a doctor.',
            {
              decodedToken: decoded,
              doctors,
            }
          );

          setError(
            'Unable to identify your doctor profile. Please make sure your login email matches the doctor email in the system.'
          );

          setLoading(false);

          return;
        }

        console.log(
          'Logged-in doctor found:',
          loggedInDoctor
        );

        setDoctor(loggedInDoctor);

        setIsAvailable(
          Boolean(loggedInDoctor.isAvailable)
        );
      } catch (err) {
        console.error(
          'Error loading doctor availability:',
          err
        );

        setError(
          'Unable to load your availability status.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, []);

  /**
   * --------------------------------------------------
   * TOGGLE STATUS
   * --------------------------------------------------
   */
  const handleToggle = () => {
    setIsAvailable(
      (current) => !current
    );

    setSuccess('');

    setError('');
  };

  /**
   * --------------------------------------------------
   * SAVE STATUS
   * --------------------------------------------------
   */
  const handleSave = async () => {
    if (!doctor) {
      setError(
        'Doctor profile is not loaded.'
      );

      return;
    }

    try {
      setSaving(true);

      setError('');

      setSuccess('');

      /**
       * We send the complete doctor object because
       * the backend exposes PUT /api/doctors/{id}
       * rather than a dedicated availability endpoint.
       */
      const updateDoctor = {
        firstName: doctor.firstName,

        lastName: doctor.lastName,

        email: doctor.email,

        phone: doctor.phone,

        gender: doctor.gender,

        specialization:
          doctor.specialization,

        qualification:
          doctor.qualification,

        experience: doctor.experience,

        roomNumber:
          doctor.roomNumber,

        isAvailable: isAvailable,

        departmentId:
          doctor.departmentId,
      };

      console.log(
        'Updating doctor availability:',
        {
          doctorId: doctor.id,
          isAvailable,
          updateDoctor,
        }
      );

      await doctorService.updateDoctor(
        doctor.id,
        updateDoctor
      );

      /**
       * Update local state after successful API call.
       */
      setDoctor({
        ...doctor,

        isAvailable,
      });

      setSuccess(
        `Availability updated successfully. You are now ${
          isAvailable
            ? 'Available'
            : 'Not Available'
        }.`
      );
    } catch (err) {
      console.error(
        'Unable to update doctor availability:',
        err
      );

      setError(
        'Unable to update availability. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * --------------------------------------------------
   * STATUS TEXT
   * --------------------------------------------------
   */
  const statusText = useMemo(() => {
    return isAvailable
      ? 'Available'
      : 'Not Available';
  }, [isAvailable]);

  if (loading) {
    return (
      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'Availability',
          },
        ]}
      >
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>
              Loading availability...
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'Availability',
        },
      ]}
    >
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>
            <button
              onClick={() =>
                router.push(
                  '/doctor-dashboard'
                )
              }
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft size={16} />

              Back to Dashboard
            </button>

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-primary/10 p-3">
                <CalendarDays
                  size={26}
                  className="text-primary"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Availability
                </h1>

                <p className="text-muted-foreground mt-1">
                  Manage your current availability status.
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-full border bg-card px-4 py-2 text-sm font-medium">
            Doctor Portal
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* AVAILABILITY CARD */}
        <div className="rounded-xl border bg-card p-6">

          <div className="flex items-start gap-4 mb-6">

            <CalendarDays
              size={22}
              className="text-primary mt-1"
            />

            <div>
              <h2 className="text-xl font-semibold">
                Doctor Availability
              </h2>

              <p className="text-sm text-muted-foreground">
                Let patients and staff know whether you are currently available for appointments.
              </p>
            </div>

          </div>

          <div className="rounded-xl border p-6">

            <div className="flex items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isAvailable
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle2
                      size={22}
                      className="text-green-600"
                    />
                  ) : (
                    <CircleX
                      size={22}
                      className="text-red-600"
                    />
                  )}
                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Current Status
                  </p>

                  <p
                    className={`text-lg font-semibold ${
                      isAvailable
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {statusText}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    {isAvailable
                      ? 'Patients can see that you are currently available.'
                      : 'Patients will see that you are currently unavailable.'}
                  </p>

                </div>

              </div>

              {/* TOGGLE */}
              <button
                type="button"
                onClick={handleToggle}
                disabled={saving}
                aria-label="Toggle doctor availability"
                aria-pressed={isAvailable}
                className={`relative h-7 w-14 rounded-full transition-colors ${
                  isAvailable
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                } ${
                  saving
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isAvailable
                      ? 'translate-x-8'
                      : 'translate-x-1'
                  }`}
                />
              </button>

            </div>

          </div>

          {/* SAVE */}
          <div className="flex justify-end mt-6">

            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving || !doctor
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />

                  Save Changes
                </>
              )}
            </button>

          </div>

        </div>

        {/* INFORMATION */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

          <h3 className="font-semibold text-blue-900 mb-3">
            How availability works
          </h3>

          <ul className="space-y-2 text-sm text-blue-800">

            <li>
              • <strong>Available</strong> means you are currently accepting appointments.
            </li>

            <li>
              • <strong>Not Available</strong> means patients and staff should not consider you available for new appointments.
            </li>

            <li>
              • Your availability is saved directly to your doctor record.
            </li>

            <li>
              • The status is stored in the database using the{' '}
              <strong>IsAvailable</strong> field.
            </li>

          </ul>

        </div>

      </div>
    </AppLayout>
  );
}