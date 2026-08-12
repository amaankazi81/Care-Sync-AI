"use client";

import { useEffect, useState } from "react";
import analyticsService from "@/services/analyticsService";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIAnalyticsPage() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionId, setSessionId] = useState("");

    // =========================================================
    // CREATE / RESTORE AI ANALYTICS SESSION
    // =========================================================
    useEffect(() => {
        let id = localStorage.getItem("aiAnalyticsSession");

        if (!id) {
            id = crypto.randomUUID();

            localStorage.setItem(
                "aiAnalyticsSession",
                id
            );
        }

        setSessionId(id);
    }, []);

    // =========================================================
    // ASK AI
    // =========================================================
    const askAI = async (text?: string) => {
        const questionToAsk =
            (text ?? question).trim();

        if (!questionToAsk) {
            return;
        }

        if (!sessionId) {
            setError(
                "Analytics session is not ready."
            );
            return;
        }

        setError("");
        setLoading(true);

        // Add user's question to chat
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: questionToAsk,
            },
        ]);

        setQuestion("");

        try {
            console.log(
                "Sending AI Analytics request:",
                {
                    sessionId,
                    question: questionToAsk,
                }
            );

            const response =
                await analyticsService.query(
                    sessionId,
                    questionToAsk
                );

            console.log(
                "AI Analytics Response:",
                response
            );

            // Handle unsuccessful response
            if (!response.success) {
                setError(
                    response.message ||
                        "AI could not process this request."
                );

                return;
            }

            // Add ONLY the natural-language AI answer
            // SQL / metadata / query results are intentionally
            // not displayed on the frontend.
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        response.answer ||
                        "No answer generated.",
                },
            ]);
        } catch (err: any) {
            console.error(
                "AI Analytics Error:",
                err
            );

            if (
                err?.response?.status === 401 ||
                err?.response?.status === 403
            ) {
                setError(
                    "You are not authorized to use AI Analytics."
                );
            } else {
                setError(
                    err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        "Unable to connect to AI Analytics."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CLEAR CHAT
    // =========================================================
    const clearConversation = async () => {
        if (!sessionId) {
            return;
        }

        try {
            await analyticsService.clearMemory(
                sessionId
            );
        } catch (err) {
            console.error(
                "Failed to clear AI memory:",
                err
            );
        }

        setMessages([]);
        setQuestion("");
        setError("");
    };

    // =========================================================
    // SUGGESTED QUESTIONS
    // =========================================================
    const suggestions = [
        "How many patients are registered?",
        "How many doctors are available?",
        "Show me the number of appointments.",
        "How many appointments are scheduled for each doctor?",
        "Show patient count by department.",
        "Show the latest appointments.",
    ];

    // =========================================================
    // UI
    // =========================================================
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6">
                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                AI Analytics
                            </h1>

                            <p className="mt-2 text-slate-600">
                                Ask questions about healthcare
                                data using natural language.
                            </p>
                        </div>

                        <button
                            onClick={clearConversation}
                            disabled={
                                loading ||
                                messages.length === 0
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Clear Chat
                        </button>

                    </div>
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* =================================================
                    CHAT CONTAINER
                ================================================= */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    <div className="min-h-[500px] space-y-5 p-6">

                        {/* =================================================
                            EMPTY STATE
                        ================================================= */}

                        {messages.length === 0 && (
                            <div className="py-12 text-center">

                                <div className="mb-4 text-5xl">
                                    🤖
                                </div>

                                <h2 className="text-xl font-semibold text-slate-800">
                                    Ask your healthcare database
                                </h2>

                                <p className="mx-auto mt-2 max-w-xl text-slate-500">
                                    Ask questions in normal English
                                    and let AI analyze your
                                    healthcare data.
                                </p>

                                {/* Suggested Questions */}

                                <div className="mx-auto mt-8 grid max-w-4xl gap-3 md:grid-cols-2">

                                    {suggestions.map(
                                        (suggestion) => (
                                            <button
                                                key={
                                                    suggestion
                                                }
                                                onClick={() =>
                                                    askAI(
                                                        suggestion
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                className="rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {suggestion}
                                            </button>
                                        )
                                    )}

                                </div>
                            </div>
                        )}

                        {/* =================================================
                            CHAT MESSAGES
                        ================================================= */}

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

                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                            message.role ===
                                            "user"
                                                ? "bg-cyan-600 text-white"
                                                : "bg-slate-100 text-slate-800"
                                        }`}
                                    >

                                        {/* USER MESSAGE */}

                                        {message.role ===
                                        "user" ? (
                                            <p className="whitespace-pre-wrap text-sm leading-7">
                                                {
                                                    message.content
                                                }
                                            </p>
                                        ) : (

                                            /* AI MESSAGE */

                                            <div
                                                className="
                                                    prose
                                                    prose-slate
                                                    max-w-none
                                                    text-sm
                                                    leading-7

                                                    prose-headings:mb-3
                                                    prose-headings:mt-4
                                                    prose-headings:font-semibold
                                                    prose-headings:text-slate-900

                                                    prose-p:my-2

                                                    prose-ul:my-3
                                                    prose-ol:my-3
                                                    prose-li:my-1

                                                    prose-strong:font-semibold
                                                    prose-strong:text-slate-900

                                                    prose-code:rounded
                                                    prose-code:bg-slate-200
                                                    prose-code:px-1
                                                    prose-code:py-0.5
                                                    prose-code:text-slate-800
                                                "
                                            >
                                                <ReactMarkdown>
                                                    {
                                                        message.content
                                                    }
                                                </ReactMarkdown>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            )
                        )}

                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading && (
                            <div className="flex justify-start">

                                <div className="rounded-2xl bg-slate-100 px-5 py-3 text-sm text-slate-500">

                                    <div className="flex items-center gap-2">
                                        <span>
                                            AI is analyzing your
                                            healthcare data...
                                        </span>
                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        INPUT AREA
                    ================================================= */}

                    <div className="border-t border-slate-200 bg-white p-4">

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
                                        !e.shiftKey &&
                                        !loading
                                    ) {
                                        e.preventDefault();

                                        askAI();
                                    }

                                }}
                                placeholder="Ask something about your healthcare data..."
                                disabled={loading}
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
                            />

                            <button
                                onClick={() =>
                                    askAI()
                                }
                                disabled={
                                    loading ||
                                    !question.trim()
                                }
                                className="rounded-xl bg-cyan-600 px-7 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Analyzing..."
                                    : "Ask AI"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}