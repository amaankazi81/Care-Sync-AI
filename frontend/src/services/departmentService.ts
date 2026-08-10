import dotnetApi from '@/lib/dotnetApi';

import {
  Department,
  DepartmentApiResponse,
  DepartmentResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/Department';

const BASE_URL = '/Department';

const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response =
      await dotnetApi.get<DepartmentApiResponse>(BASE_URL);

    return response.data.data;
  },

  getDepartmentById: async (
    id: string
  ): Promise<Department> => {
    const response =
      await dotnetApi.get<DepartmentResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data;
  },

  createDepartment: async (
    department: CreateDepartmentRequest
  ) => {
    const response = await dotnetApi.post(
      BASE_URL,
      department
    );

    return response.data;
  },

  updateDepartment: async (
    id: string,
    department: UpdateDepartmentRequest
  ) => {
    const response = await dotnetApi.put(
      `${BASE_URL}/${id}`,
      department
    );

    return response.data;
  },

  deleteDepartment: async (id: string) => {
    const response = await dotnetApi.delete(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },
};

export default departmentService;