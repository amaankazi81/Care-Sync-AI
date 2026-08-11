import axios from "axios";

const AI_API_URL =
  process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

export interface AIChatResponse {
  success: boolean;
  answer: string;
  sources?: unknown[];
}

export interface AIChatRequest {
  patient_id: string;
  question: string;
}

const aiService = {
  askDocumentAI: async (
    patientId: string,
    question: string
  ): Promise<AIChatResponse> => {
    const token = localStorage.getItem("accessToken");

    const response = await axios.post<AIChatResponse>(
      `${AI_API_URL}/document/chat`,
      {
        patient_id: patientId,
        question,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  uploadMedicalReport: async (
    patientId: string,
    file: File
  ) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${AI_API_URL}/upload/${patientId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  clearMemory: async (patientId: string) => {
    const token = localStorage.getItem("accessToken");

    const response = await axios.delete(
      `${AI_API_URL}/document/memory/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default aiService;