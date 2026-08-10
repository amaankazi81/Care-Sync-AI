import { Prescription } from '@/types/Prescription';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5036';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medicines: string;
  instructions: string;
  followUpDate: string | null;
}

export interface UpdatePrescriptionRequest {
  diagnosis: string;
  medicines: string;
  instructions: string;
  followUpDate: string | null;
}

class PrescriptionService {
  /*
   * ---------------------------------------------------------
   * AUTH HEADERS
   * ---------------------------------------------------------
   */

  private getAuthHeaders(
    contentType = 'application/json'
  ): HeadersInit {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    return {
      'Content-Type': contentType,

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  }

  /*
   * ---------------------------------------------------------
   * GET ALL PRESCRIPTIONS
   * ---------------------------------------------------------
   */

  async getPrescriptions(): Promise<Prescription[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/prescriptions`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch prescriptions. Status: ${response.status}`
      );
    }

    const result: ApiResponse<Prescription[]> =
      await response.json();

    return result.data || [];
  }

  /*
   * ---------------------------------------------------------
   * GET PRESCRIPTION BY ID
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This method returns Promise<Prescription>, NOT
   * Promise<Prescription | null>.
   *
   * This prevents TypeScript errors in existing pages
   * which expect data to always be a Prescription.
   *
   * If the backend returns 404, we throw an error.
   */

  async getPrescriptionById(
    id: string
  ): Promise<Prescription> {
    if (!id) {
      throw new Error(
        'Prescription ID is required.'
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/prescriptions/${id}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (response.status === 404) {
      throw new Error(
        'Prescription not found.'
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch prescription. Status: ${response.status}`
      );
    }

    const result: ApiResponse<Prescription> =
      await response.json();

    if (!result.data) {
      throw new Error(
        'Prescription data was not returned by the server.'
      );
    }

    return result.data;
  }

  /*
   * ---------------------------------------------------------
   * CREATE PRESCRIPTION
   * ---------------------------------------------------------
   *
   * Backend:
   *
   * POST /api/prescriptions
   *
   */

  async createPrescription(
    data: CreatePrescriptionRequest
  ): Promise<Prescription> {
    if (!data.appointmentId) {
      throw new Error(
        'Appointment ID is required.'
      );
    }

    if (!data.patientId) {
      throw new Error(
        'Patient ID is required.'
      );
    }

    if (!data.doctorId) {
      throw new Error(
        'Doctor ID is required.'
      );
    }

    const requestBody = {
      appointmentId:
        data.appointmentId,

      patientId:
        data.patientId,

      doctorId:
        data.doctorId,

      diagnosis:
        data.diagnosis,

      medicines:
        data.medicines,

      instructions:
        data.instructions,

      followUpDate:
        data.followUpDate
          ? `${data.followUpDate}T00:00:00.000Z`
          : null,
    };

    console.log(
      'Creating prescription:',
      requestBody
    );

    const response = await fetch(
      `${API_BASE_URL}/api/prescriptions`,
      {
        method: 'POST',

        headers:
          this.getAuthHeaders(
            'application/json'
          ),

        body: JSON.stringify(
          requestBody
        ),
      }
    );

    /*
     * -------------------------------------------------------
     * ERROR
     * -------------------------------------------------------
     */

    if (!response.ok) {
      let errorResult: unknown = null;

      try {
        errorResult =
          await response.json();
      } catch {
        errorResult = null;
      }

      console.error(
        'Create prescription failed:',
        {
          status: response.status,
          statusText:
            response.statusText,
          response: errorResult,
        }
      );

      /*
       * ASP.NET validation errors
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'errors' in errorResult
      ) {
        const errors =
          (
            errorResult as {
              errors?: Record<
                string,
                string[] | string
              >;
            }
          ).errors;

        if (errors) {
          const messages =
            Object.entries(errors)
              .flatMap(
                ([field, fieldErrors]) => {
                  if (
                    Array.isArray(
                      fieldErrors
                    )
                  ) {
                    return fieldErrors.map(
                      (message) =>
                        `${field}: ${message}`
                    );
                  }

                  return [
                    `${field}: ${fieldErrors}`,
                  ];
                }
              )
              .join(' ');

          throw new Error(
            messages ||
              'The prescription could not be created.'
          );
        }
      }

      /*
       * Standard message
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'message' in errorResult
      ) {
        const message =
          (
            errorResult as {
              message?: string;
            }
          ).message;

        if (message) {
          throw new Error(message);
        }
      }

      /*
       * ASP.NET ProblemDetails
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'title' in errorResult
      ) {
        const title =
          (
            errorResult as {
              title?: string;
            }
          ).title;

        if (title) {
          throw new Error(title);
        }
      }

      throw new Error(
        `The prescription could not be created. Status: ${response.status}`
      );
    }

    /*
     * -------------------------------------------------------
     * SUCCESS
     * -------------------------------------------------------
     */

    let result: unknown = null;

    try {
      result =
        await response.json();
    } catch {
      result = null;
    }

    /*
     * Wrapped response:
     *
     * {
     *   success: true,
     *   message: "...",
     *   data: {...}
     * }
     */

    if (
      result &&
      typeof result ===
        'object' &&
      'data' in result
    ) {
      const wrapped =
        result as ApiResponse<Prescription>;

      if (wrapped.data) {
        return wrapped.data;
      }
    }

    /*
     * Direct Prescription response
     */

    if (
      result &&
      typeof result ===
        'object' &&
      'id' in result
    ) {
      return result as Prescription;
    }

    throw new Error(
      'Prescription was created, but the server returned an invalid response.'
    );
  }

  /*
   * ---------------------------------------------------------
   * UPDATE PRESCRIPTION
   * ---------------------------------------------------------
   *
   * Backend:
   *
   * PUT /api/prescriptions/{id}
   *
   */

  async updatePrescription(
    id: string,
    data: UpdatePrescriptionRequest
  ): Promise<Prescription | null> {
    if (!id) {
      throw new Error(
        'Prescription ID is required.'
      );
    }

    /*
     * Convert:
     *
     * 2026-08-16
     *
     * to:
     *
     * 2026-08-16T00:00:00.000Z
     */

    const formattedFollowUpDate =
      data.followUpDate
        ? `${data.followUpDate}T00:00:00.000Z`
        : null;

    const requestBody = {
      diagnosis:
        data.diagnosis,

      medicines:
        data.medicines,

      instructions:
        data.instructions,

      followUpDate:
        formattedFollowUpDate,
    };

    console.log(
      'Updating prescription:',
      {
        id,
        requestBody,
      }
    );

    const response = await fetch(
      `${API_BASE_URL}/api/prescriptions/${id}`,
      {
        method: 'PUT',

        headers:
          this.getAuthHeaders(
            'application/json-patch+json'
          ),

        body: JSON.stringify(
          requestBody
        ),
      }
    );

    /*
     * -------------------------------------------------------
     * ERROR
     * -------------------------------------------------------
     */

    if (!response.ok) {
      let errorResult: unknown = null;

      try {
        errorResult =
          await response.json();
      } catch {
        errorResult = null;
      }

      console.error(
        'Update prescription failed:',
        {
          status: response.status,
          statusText:
            response.statusText,
          response: errorResult,
        }
      );

      /*
       * ASP.NET validation errors
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'errors' in errorResult
      ) {
        const errors =
          (
            errorResult as {
              errors?: Record<
                string,
                string[] | string
              >;
            }
          ).errors;

        if (errors) {
          const messages =
            Object.entries(errors)
              .flatMap(
                ([field, fieldErrors]) => {
                  if (
                    Array.isArray(
                      fieldErrors
                    )
                  ) {
                    return fieldErrors.map(
                      (message) =>
                        `${field}: ${message}`
                    );
                  }

                  return [
                    `${field}: ${fieldErrors}`,
                  ];
                }
              )
              .join(' ');

          throw new Error(
            messages ||
              'The prescription could not be updated.'
          );
        }
      }

      /*
       * Standard backend message
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'message' in errorResult
      ) {
        const message =
          (
            errorResult as {
              message?: string;
            }
          ).message;

        if (message) {
          throw new Error(message);
        }
      }

      /*
       * ASP.NET ProblemDetails
       */

      if (
        errorResult &&
        typeof errorResult ===
          'object' &&
        'title' in errorResult
      ) {
        const title =
          (
            errorResult as {
              title?: string;
            }
          ).title;

        if (title) {
          throw new Error(title);
        }
      }

      throw new Error(
        `The prescription could not be updated. Status: ${response.status}`
      );
    }

    /*
     * -------------------------------------------------------
     * 204 NO CONTENT
     * -------------------------------------------------------
     */

    if (response.status === 204) {
      console.log(
        'Prescription updated successfully. Backend returned 204.'
      );

      return null;
    }

    /*
     * -------------------------------------------------------
     * READ SUCCESS RESPONSE
     * -------------------------------------------------------
     */

    let result: unknown = null;

    try {
      result =
        await response.json();
    } catch {
      result = null;
    }

    /*
     * Empty successful response
     */

    if (!result) {
      return null;
    }

    /*
     * Wrapped response
     */

    if (
      typeof result ===
        'object' &&
      result !== null &&
      'data' in result
    ) {
      const wrapped =
        result as ApiResponse<Prescription>;

      if (wrapped.data) {
        return wrapped.data;
      }
    }

    /*
     * Direct Prescription response
     */

    if (
      typeof result ===
        'object' &&
      result !== null &&
      'id' in result
    ) {
      return result as Prescription;
    }

    /*
     * Successful update but backend
     * returned no prescription object.
     */

    return null;
  }
}

export default new PrescriptionService();