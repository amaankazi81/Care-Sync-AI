export interface Department {
  id: string;
  name: string;
  description: string;
}

/**
 * Request used while creating a department
 */
export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

/**
 * Request used while updating a department
 */
export interface UpdateDepartmentRequest {
  name: string;
  description: string;
}

export interface DepartmentApiResponse {
  success: boolean;
  message: string;
  data: Department[];
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}