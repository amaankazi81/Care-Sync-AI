import dotnetApi from '@/lib/dotnetApi';

import type {
  Billing,
  CreateBillingRequest,
  UpdateBillingRequest,
} from '@/types/Billing';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const billingService = {
  // ============================================================
  // GET ALL BILLINGS
  // ADMIN / RECEPTIONIST
  // ============================================================

  async getBillings(): Promise<Billing[]> {
    const response =
      await dotnetApi.get<ApiResponse<Billing[]>>(
        '/billings'
      );

    return response.data.data || [];
  },

  // ============================================================
  // GET PATIENT BILLINGS
  // PATIENT
  // ============================================================

  async getPatientBillings(
    patientId: string
  ): Promise<Billing[]> {
    if (!patientId) {
      throw new Error('Patient ID is required.');
    }

    const response =
      await dotnetApi.get<ApiResponse<Billing[]>>(
        `/billings/patient/${patientId}`
      );

    return response.data.data || [];
  },

  // ============================================================
  // GET BILL BY ID
  // ============================================================

  async getBillingById(
    id: string
  ): Promise<Billing> {
    const response =
      await dotnetApi.get<ApiResponse<Billing>>(
        `/billings/${id}`
      );

    if (!response.data.data) {
      throw new Error(
        'Billing record could not be retrieved.'
      );
    }

    return response.data.data;
  },

  // ============================================================
  // CREATE BILL
  // ============================================================

  async createBilling(
    data: CreateBillingRequest
  ): Promise<Billing> {
    const response =
      await dotnetApi.post<ApiResponse<Billing>>(
        '/billings',
        data
      );

    if (!response.data.data) {
      throw new Error(
        'Bill was created but no billing record was returned.'
      );
    }

    return response.data.data;
  },

  // ============================================================
  // UPDATE BILL
  // ============================================================

  async updateBilling(
    id: string,
    data: UpdateBillingRequest
  ): Promise<Billing | null> {
    const response =
      await dotnetApi.put<ApiResponse<Billing>>(
        `/billings/${id}`,
        data
      );

    return response.data?.data || null;
  },

  // ============================================================
  // DELETE BILL
  // ============================================================

  async deleteBilling(
    id: string
  ): Promise<void> {
    await dotnetApi.delete(
      `/billings/${id}`
    );
  },
};

export default billingService;