"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import aiService from "@/services/aiService";
import userService from "@/services/userService";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIAssistantPage() {
    const [patientId, setPatientId] = useState("");
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const [loading, setLoading] = useState(false);

    // Upload states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    const [error, setError] = useState("");

    // ---------------------------------------------------------
    // LOAD LOGGED-IN PATIENT
    // ---------------------------------------------------------
    useEffect(() => {
        const loadPatient = async () => {
            try {
                const user = await userService.getCurrentUserProfile();

                console.log("AI Assistant - Current User:", user);

                // AI Assistant is only available for patients
                if (user.role !== "PATIENT") {
                    setError(
                        "AI Medical Assistant is available for patients only."
                    );
                    return;
                }

                // Make sure patient ID exists
                if (!user.patientId) {
                    setError("Patient profile not found.");
                    return;
                }

                console.log(
                    "AI Assistant - Patient ID:",
                    user.patientId
                );

                setPatientId(user.patientId);
            } catch (err) {
                console.error(
                    "Failed to load patient:",
                    err
                );

                setError(
                    "Unable to load patient profile."
                );
            }
        };

        loadPatient();
    }, []);

    // ---------------------------------------------------------
    // UPLOAD MEDICAL REPORT
    // ---------------------------------------------------------
    const uploadReport = async () => {
        if (!selectedFile) {
            setUploadMessage(
                "Please select a medical report first."
            );
            return;
        }

        if (!patientId) {
            setUploadMessage(
                "Patient ID not available."
            );
            return;
        }

        setUploading(true);
        setUploadMessage("");
        setError("");

        try {
            console.log(
                "Uploading medical report:",
                selectedFile.name
            );

            const response =
                await aiService.uploadMedicalReport(
                    patientId,
                    selectedFile
                );

            console.log(
                "Medical report upload response:",
                response
            );

            setUploadMessage(
                "Medical report uploaded successfully. You can now ask the AI questions about your report."
            );

            // Clear selected file
            setSelectedFile(null);

            // Reset file input
            const fileInput =
                document.getElementById(
                    "medical-report-upload"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (err: any) {
            console.error(
                "Medical report upload error:",
                err
            );

            setUploadMessage(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Failed to upload medical report."
            );
        } finally {
            setUploading(false);
        }
    };

    // ---------------------------------------------------------
    // ASK AI
    // ---------------------------------------------------------
    const askAI = async (text?: string) => {
        const questionToAsk = (
            text ?? question
        ).trim();

        if (!questionToAsk) {
            return;
        }

        if (!patientId) {
            setError(
                "Patient ID not available."
            );
            return;
        }

        setError("");

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: questionToAsk,
            },
        ]);

        setQuestion("");
        setLoading(true);

        try {
            console.log(
                "Sending AI request:",
                {
                    patientId,
                    question: questionToAsk,
                }
            );

            const response =
                await aiService.askDocumentAI(
                    patientId,
                    questionToAsk
                );

            console.log(
                "AI Response:",
                response
            );

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        response.answer ||
                        "I could not generate an answer.",
                },
            ]);
        } catch (err: any) {
            console.error(
                "AI Error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Unable to connect to AI service."
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // SUGGESTED QUESTIONS
    // ---------------------------------------------------------
    const suggestions = [
        "Summarize my medical report",
        "Explain my latest medical report",
        "What are the abnormal values in my report?",
        "What should I discuss with my doctor?",
    ];

    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl">

                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        AI Medical Assistant
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Ask questions about your medical
                        reports and health records.
                    </p>
                </div>

                {/* ================================================= */}
                {/* ERROR MESSAGE */}
                {/* ================================================= */}
                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* ================================================= */}
                {/* MEDICAL REPORT UPLOAD */}
                {/* ================================================= */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-xl">
                                📄
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Upload Medical Report
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Upload your medical report
                                    for AI analysis.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">

                        {/* File Input */}
                        <input
                            id="medical-report-upload"
                            type="file"
                            accept=".pdf,.txt"
                            onChange={(e) => {
                                const file =
                                    e.target.files?.[0] ||
                                    null;

                                setSelectedFile(file);
                                setUploadMessage("");
                            }}
                            disabled={
                                uploading ||
                                !patientId
                            }
                            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-700 hover:file:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        {/* Upload Button */}
                        <button
                            onClick={uploadReport}
                            disabled={
                                uploading ||
                                !selectedFile ||
                                !patientId
                            }
                            className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Report"}
                        </button>
                    </div>

                    {/* Selected File */}
                    {selectedFile && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                            <span className="font-medium">
                                Selected file:
                            </span>{" "}
                            {selectedFile.name}
                        </div>
                    )}

                    {/* Upload Result */}
                    {uploadMessage && (
                        <div
                            className={`mt-3 rounded-lg border p-3 text-sm ${
                                uploadMessage
                                    .toLowerCase()
                                    .includes("success")
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }`}
                        >
                            {uploadMessage}
                        </div>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                        Supported formats: PDF and TXT
                    </p>
                </div>

                {/* ================================================= */}
                {/* AI CHAT CONTAINER */}
                {/* ================================================= */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* ================================================= */}
                    {/* CHAT AREA */}
                    {/* ================================================= */}
                    <div className="min-h-[450px] space-y-4 p-6">

                        {/* ================================================= */}
                        {/* EMPTY STATE */}
                        {/* ================================================= */}
                        {messages.length === 0 && (
                            <div className="py-12 text-center">

                                <div className="mb-4 text-5xl">
                                    🤖
                                </div>

                                <h2 className="text-xl font-semibold text-slate-800">
                                    How can I help you?
                                </h2>

                                <p className="mt-2 text-slate-500">
                                    Ask me about your uploaded
                                    medical reports.
                                </p>

                                {/* Suggested Questions */}
                                <div className="mx-auto mt-6 grid max-w-2xl gap-3 md:grid-cols-2">

                                    {suggestions.map(
                                        (suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() =>
                                                    askAI(
                                                        suggestion
                                                    )
                                                }
                                                disabled={
                                                    loading ||
                                                    !patientId
                                                }
                                                className="rounded-xl border border-slate-200 p-4 text-left text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {suggestion}
                                            </button>
                                        )
                                    )}

                                </div>
                            </div>
                        )}

                        {/* ================================================= */}
                        {/* CHAT MESSAGES */}
                        {/* ================================================= */}
                        {messages.map(
                            (message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role ===
                                        "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    {/* USER MESSAGE */}
                                    {message.role ===
                                    "user" ? (
                                        <div className="max-w-[80%] rounded-2xl bg-cyan-600 px-5 py-3 text-white">

                                            <p className="whitespace-pre-wrap text-sm leading-7">
                                                {
                                                    message.content
                                                }
                                            </p>

                                        </div>
                                    ) : (

                                        /* AI MESSAGE */
                                        <div className="max-w-[85%] rounded-2xl bg-slate-100 px-5 py-4 text-slate-800">

                                            <div className="prose prose-slate max-w-none text-sm leading-7">

                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({
                                                            children,
                                                        }) => (
                                                            <h1 className="mb-3 mt-2 text-xl font-bold text-slate-900">
                                                                {
                                                                    children
                                                                }
                                                            </h1>
                                                        ),

                                                        h2: ({
                                                            children,
                                                        }) => (
                                                            <h2 className="mb-3 mt-5 text-lg font-bold text-slate-900">
                                                                {
                                                                    children
                                                                }
                                                            </h2>
                                                        ),

                                                        h3: ({
                                                            children,
                                                        }) => (
                                                            <h3 className="mb-2 mt-4 text-base font-bold text-slate-900">
                                                                {
                                                                    children
                                                                }
                                                            </h3>
                                                        ),

                                                        p: ({
                                                            children,
                                                        }) => (
                                                            <p className="mb-3 leading-7 text-slate-700">
                                                                {
                                                                    children
                                                                }
                                                            </p>
                                                        ),

                                                        ul: ({
                                                            children,
                                                        }) => (
                                                            <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700">
                                                                {
                                                                    children
                                                                }
                                                            </ul>
                                                        ),

                                                        ol: ({
                                                            children,
                                                        }) => (
                                                            <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700">
                                                                {
                                                                    children
                                                                }
                                                            </ol>
                                                        ),

                                                        li: ({
                                                            children,
                                                        }) => (
                                                            <li className="leading-7">
                                                                {
                                                                    children
                                                                }
                                                            </li>
                                                        ),

                                                        strong: ({
                                                            children,
                                                        }) => (
                                                            <strong className="font-semibold text-slate-900">
                                                                {
                                                                    children
                                                                }
                                                            </strong>
                                                        ),

                                                        blockquote: ({
                                                            children,
                                                        }) => (
                                                            <blockquote className="my-4 border-l-4 border-cyan-500 pl-4 italic text-slate-600">
                                                                {
                                                                    children
                                                                }
                                                            </blockquote>
                                                        ),
                                                    }}
                                                >
                                                    {
                                                        message.content
                                                    }
                                                </ReactMarkdown>

                                            </div>
                                        </div>
                                    )}

                                </div>
                            )
                        )}

                        {/* ================================================= */}
                        {/* LOADING MESSAGE */}
                        {/* ================================================= */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-slate-100 px-5 py-3 text-slate-500">

                                    <div className="flex items-center gap-2">
                                        <span>
                                            AI is thinking
                                        </span>

                                        <span className="animate-pulse">
                                            ...
                                        </span>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>

                    {/* ================================================= */}
                    {/* QUESTION INPUT */}
                    {/* ================================================= */}
                    <div className="border-t border-slate-200 p-4">

                        <div className="flex gap-3">

                            <input
                                value={question}
                                onChange={(e) =>
                                    setQuestion(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                            "Enter" &&
                                        !loading
                                    ) {
                                        askAI();
                                    }
                                }}
                                placeholder="Ask something about your medical report..."
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                disabled={
                                    loading ||
                                    !patientId
                                }
                            />

                            <button
                                onClick={() =>
                                    askAI()
                                }
                                disabled={
                                    loading ||
                                    !patientId ||
                                    !question.trim()
                                }
                                className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "..."
                                    : "Ask"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* ================================================= */}
                {/* DISCLAIMER */}
                {/* ================================================= */}
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                    <strong>Important:</strong> CareSync AI
                    provides AI-generated information for
                    assistance and educational purposes only.
                    It does not replace professional medical
                    advice, diagnosis, or treatment. Always
                    consult your doctor for medical decisions.
                </div>

            </div>
        </div>
    );
}