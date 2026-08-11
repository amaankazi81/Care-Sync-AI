import axios from "axios";

const AI_API_URL =
    process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

export interface SQLAnalyticsRequest {
    session_id: string;
    question: string;
}

export interface SQLAnalyticsResponse {
    success: boolean;
    message?: string;
    answer?: string;
    generated_sql?: string;
    chart?: any;
    metadata?: {
        rows: number;
        username: string;
        role: string;
    };
    data?: Record<string, any>[];
    unauthorized_tables?: string[];
}

const analyticsService = {

    query: async (
        sessionId: string,
        question: string
    ): Promise<SQLAnalyticsResponse> => {

        const token = localStorage.getItem("accessToken");

        const response = await axios.post<SQLAnalyticsResponse>(
            `${AI_API_URL}/sql/query`,
            {
                session_id: sessionId,
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

    clearMemory: async (sessionId: string) => {

        const token = localStorage.getItem("accessToken");

        const response = await axios.delete(
            `${AI_API_URL}/sql/memory/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },
};

export default analyticsService;