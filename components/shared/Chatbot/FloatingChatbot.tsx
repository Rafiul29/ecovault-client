/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
    MessageSquare,
    X,
    Send,
    RefreshCw,
    Bot,
    User,
    Sparkles,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
    queryRagAction,
    ingestIdeasAction,
    getUserRoleAction,
    ingestAttachmentsAction,
    // getUserRoleAction,
} from "@/app/_actions/rag.actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageSource = {
    id: string;
    content: string;
    similarity: number;
    metadata?: { name?: string;[key: string]: unknown };
    sourceType?: string;
};

type Message = {
    id: string;
    role: "user" | "bot";
    content: string;
    sources?: MessageSource[];
    isError?: boolean;
    queryToRetry?: string;
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: "welcome",
        role: "bot",
        content:
            "Hello! I'm your EcoVault AI assistant 🌿\n\nI can help you discover sustainability ideas, environmental solutions, or find the best-rated green innovations from our community. What are you looking to build or learn today?",
    },
];

const SUGGESTED_QUERIES = [
    "Sustainable energy ideas for urban areas?",
    "Best rated waste management solutions?",
    "Are there any free permaculture guides?",
    "Highly supported water harvesting projects?",
];

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-md">
                <Bot size={16} className="text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                    <span
                        className="w-2 h-2 rounded-full bg-muted-foreground inline-block animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <span
                        className="w-2 h-2 rounded-full bg-muted-foreground inline-block animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <span
                        className="w-2 h-2 rounded-full bg-muted-foreground inline-block animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
    message,
    onRetry,
}: {
    message: Message;
    onRetry?: (query: string) => void;
}) {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${isUser
                    ? "bg-secondary"
                    : "bg-linear-to-br from-primary to-accent"
                    }`}
            >
                {isUser ? (
                    <User size={16} className="text-secondary-foreground" />
                ) : (
                    <Bot size={16} className="text-primary-foreground" />
                )}
            </div>

            <div
                className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
            >
                {/* Bubble */}
                <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isUser
                        ? "bg-linear-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-br-sm shadow-md"
                        : "bg-card border border-border text-card-foreground rounded-2xl rounded-bl-sm shadow-sm"
                        }`}
                >
                    {typeof message.content === "string"
                        ? message.content
                            .split(/(\*\*.*?\*\*)/g)
                            .map((part, i) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                    <strong key={i}>{part.slice(2, -2)}</strong>
                                ) : (
                                    part
                                ),
                            )
                        : JSON.stringify(message.content, null, 2)}
                </div>

                {/* Error Retry Button */}
                {message.isError && onRetry && message.queryToRetry && (
                    <button
                        onClick={() => onRetry(message.queryToRetry!)}
                        className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium mt-1 cursor-pointer bg-primary/10 px-2 py-1 rounded-md border border-primary/20"
                    >
                        <RefreshCw size={10} />
                        Retry
                    </button>
                )}

                {/* Sources */}
                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-1">
                        <span className="text-[10px] text-muted-foreground w-full mb-0.5">
                            Sources:
                        </span>
                        {message.sources.map((src, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium"
                            >
                                <Sparkles size={8} />
                                {src?.metadata?.name
                                    ? String(src.metadata.name)
                                    : `Source ${i + 1}`}
                                {typeof src.similarity === "number" && (
                                    <span className="text-primary/70">
                                        {(src.similarity * 100).toFixed(0)}%
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isQuerying, startQueryTransition] = useTransition();
    const [isSyncing, startSyncTransition] = useTransition();
    const [userRole, setUserRole] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch user role on mount
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRoleAction();
            setUserRole(role);
        };
        fetchRole();
    }, []);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isQuerying]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ── Sync handler ────────────────────────────────────────────────────────
    const handleSync = () => {
        startSyncTransition(async () => {
            try {
                // 1. Sync the core Idea data (metrics, counts, etc.)
                const ideaResult = await ingestIdeasAction();

                // 2. Sync the deep-scanned Attachment data (PDFs/Documents)
                const attachmentResult = await ingestAttachmentsAction();

                if (ideaResult.success && attachmentResult.success) {
                    toast.success(`EcoVault Database Synced!`, {
                        description: `Successfully indexed ${ideaResult.indexedCount} ideas and scanned ${attachmentResult.indexedCount} technical documents.`,
                    });
                } else if (ideaResult.success || attachmentResult.success) {
                    // Partial success handling
                    toast.warning("Partial Sync Completed", {
                        description: `Ideas: ${ideaResult.success ? '✅' : '❌'} | Attachments: ${attachmentResult.success ? '✅' : '❌'}`
                    });
                }
            } catch (error) {
                toast.error("Sync failed", {
                    description: error instanceof Error ? error.message : "An unexpected error occurred during indexing."
                });
            }
        });
    };

    // ── Send message handler ─────────────────────────────────────────────────
    const handleSend = (query?: string) => {
        const text = (query ?? inputValue).trim();
        if (!text || isQuerying) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");

        startQueryTransition(async () => {
            const result = await queryRagAction(text);

            const botMsg: Message = {
                id: `bot-${Date.now()}`,
                role: "bot",
                content: result.success
                    ? result.answer!
                    : (result.error ?? "Something went wrong. Please try again."),
                sources: result.success ? result.sources : undefined,
                isError: !result.success,
                queryToRetry: !result.success ? text : undefined,
            };

            setMessages((prev) => [...prev, botMsg]);
        });
    };

    return (
        <>
            {/* ── Chat Window ────────────────────────────────────────────────── */}
            <div
                className={`fixed bottom-20 inset-x-4 sm:left-auto sm:right-6 sm:w-96 lg:w-[420px] z-50 flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden bg-card transition-all duration-300 ease-in-out ${isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-6 pointer-events-none"
                    }`}
                style={{ maxHeight: "calc(100dvh - 7rem)" }}
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="bg-linear-to-br from-primary to-accent px-4 py-3 flex flex-row items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center backdrop-blur-sm">
                            <Bot size={20} className="text-primary-foreground" />
                        </div>
                        <div>
                            <p className="text-primary-foreground font-semibold text-sm leading-none">
                                EcoVault AI Guide
                            </p>
                            <p className="text-primary-foreground/80 text-[10px] mt-0.5">
                                Sustainability Expert · Powered by RAG
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Sync button — ADMIN ONLY */}
                        {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                title="Sync Ideas Data"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                <RefreshCw
                                    size={16}
                                    className={isSyncing ? "animate-spin" : ""}
                                />
                            </button>
                        )}
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 min-h-0"
                    style={{ minHeight: "180px" }}
                >
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
                    ))}

                    {isQuerying && <TypingIndicator />}

                    {/* Suggested queries — only shown when only welcome message exists */}
                    {messages.length === 1 && !isQuerying && (
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-[11px] text-muted-foreground font-medium px-1">
                                Try asking:
                            </p>
                            {SUGGESTED_QUERIES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleSend(q)}
                                    className="text-left text-xs bg-card border border-border text-card-foreground px-3 py-2 rounded-xl hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input area */}
                <div className="shrink-0 px-3 py-3 bg-card border-t border-border">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask about sustainability ideas..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isQuerying}
                            className="flex-1 text-sm bg-muted border border-transparent focus:border-primary/50 focus:bg-background rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-muted-foreground disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={isQuerying || !inputValue.trim()}
                            className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-md"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Floating Trigger Button ────────────────────────────────────── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-br from-primary to-accent text-primary-foreground flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${isOpen ? "rotate-90" : "rotate-0"
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {/* Pulsing ring when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
                )}
            </button>
        </>
    );
}