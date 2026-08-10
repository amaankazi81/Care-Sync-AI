// src/services/billingService.ts

import type {
  Billing,
  BillingApiResponse,
  BillingResponse,
  CreateBillingRequest,
  UpdateBillingRequest,
} from '@/types/Billing';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5036';

/*
 * ==========================================================
 * GENERIC REQUEST HELPER
 * ==========================================================
 */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers || {}),
      },
    }
  );

  /*
   * Some PUT / DELETE endpoints may return:
   *
   * 204 No Content
   *
   * In that case response.json() would fail.
   *
   * We therefore safely handle an empty response.
   */

  let result: any = null;

  try {
    const text = await response.text();

    if (text) {
      result = JSON.parse(text);
    }
  } catch {
    result = null;
  }

  /*
   * HTTP ERROR
   */

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}`
    );
  }

  /*
   * API LEVEL ERROR
   */

  if (result?.success === false) {
    throw new Error(
      result?.message ||
        'Request failed.'
    );
  }

  /*
   * Successful request.
   *
   * Can be an object OR null when API returns 204.
   */

  return result as T | null;
}

/*
 * ==========================================================
 * BILLING SERVICE
 * ==========================================================
 */

const billingService = {

  /*
   * ========================================================
   * GET ALL BILLINGS
   * ========================================================
   *
   * GET /api/billings
   */

  async getBillings(): Promise<Billing[]> {
    const response =
      await request<BillingApiResponse>(
        '/api/billings'
      );

    return response?.data || [];
  },

  /*
   * ========================================================
   * GET BILLING BY ID
   * ========================================================
   *
   * GET /api/billings/{id}
   */

  async getBillingById(
    id: string
  ): Promise<Billing> {
    const response =
      await request<BillingResponse>(
        `/api/billings/${id}`
      );

    if (!response?.data) {
      throw new Error(
        'Billing record could not be retrieved.'
      );
    }

    return response.data;
  },

  /*
   * ========================================================
   * CREATE BILLING
   * ========================================================
   *
   * POST /api/billings
   */

  async createBilling(
    data: CreateBillingRequest
  ): Promise<Billing> {
    const response =
      await request<BillingResponse>(
        '/api/billings',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

    if (!response?.data) {
      throw new Error(
        'Bill was created but no billing record was returned by the server.'
      );
    }

    return response.data;
  },

  /*
   * ========================================================
   * UPDATE BILLING
   * ========================================================
   *
   * PUT /api/billings/{id}
   *
   * IMPORTANT:
   *
   * The backend may successfully update the bill and return
   * 204 No Content.
   *
   * Therefore this method returns:
   *
   * Billing | null
   *
   * instead of assuming response.data always exists.
   */

  async updateBilling(
    id: string,
    data: UpdateBillingRequest
  ): Promise<Billing | null> {

    const response =
      await request<BillingResponse>(
        `/api/billings/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

    /*
     * Backend returned an updated billing object.
     */

    if (response?.data) {
      return response.data;
    }

    /*
     * Backend successfully updated the database but
     * returned no body.
     */

    return null;
  },

  /*
   * ========================================================
   * DELETE BILLING
   * ========================================================
   *
   * DELETE /api/billings/{id}
   */

  async deleteBilling(
    id: string
  ): Promise<void> {

    await request(
      `/api/billings/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};

export default billingService;