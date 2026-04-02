"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttachmentsByIdea, createAttachment, deleteAttachment } from "@/services/attachment.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Link as LinkIcon, Loader2, Upload, FileText, File as FileIcon, Video, Plus, Trash2, Download, Maximize2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/types/enums";
import { API_BASE_URL } from "@/lib/env";
import Image from "next/image";

interface IdeaAttachmentsProps {
    ideaId: string;
    authorId: string;
    currentUserId?: string;
    currentUserRole?: string;
}

const IdeaAttachments = ({ ideaId, authorId, currentUserId, currentUserRole }: IdeaAttachmentsProps) => {

    const pathname = usePathname();

    // Logic: ideas/{id} রাউটে থাকলে বাটন হাইড করার জন্য
    // যদি pathname এ '/ideas/' থাকে এবং সেটা '/ideas/edit' না হয়
    const isPublicView = pathname.startsWith("/ideas/") && !pathname.startsWith("/edit");

    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [viewingAttachment, setViewingAttachment] = useState<{ id: string; url: string; type: string; title: string } | null>(null);
    const [viewAttachmentUrl, setViewAttachmentUrl] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileKey, setFileKey] = useState(Date.now());
    const [type, setType] = useState<"PDF">("PDF");
    const router = useRouter();

    const { data: response, isLoading } = useQuery({
        queryKey: ["attachments", ideaId],
        queryFn: () => getAttachmentsByIdea(ideaId),
    });

    // Data normalization
    const attachments = (Array.isArray(response) ? response : (response as any)?.data) || [];
    const hasPermission = currentUserId === authorId || currentUserRole === Role.ADMIN || currentUserRole === Role.SUPER_ADMIN || currentUserRole === Role.MODERATOR;

    const createMutation = useMutation({
        mutationFn: (payload: FormData) => createAttachment(payload),
        onSuccess: async () => {
            toast.success("Attachment added successfully!");
            await queryClient.invalidateQueries({ queryKey: ["attachments", ideaId] });
            setIsAddOpen(false);
            setTitle("");
            setFile(null);
            setFileKey(Date.now());
            setType("PDF");
        },
        onError: (err: any) => {
            if (err?.response?.data?.errorSources?.length > 0) {
                err.response.data.errorSources.forEach((error: any) => {
                    toast.error(`${error.path}: ${error.message}`);
                });
            } else {
                toast.error(err?.response?.data?.message || "Failed to add attachment");
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAttachment(id),
        onSuccess: async () => {
            toast.success("Attachment deleted successfully!");
            await queryClient.invalidateQueries({ queryKey: ["attachments", ideaId] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete attachment");
        }
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("File is required");
            return;
        }

        // --- PDF ONLY VALIDATION ---
        if (type === "PDF" && !file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
            toast.error("Selected file must be a PDF");
            return;
        }

        const formData = new FormData();
        const dataPayload = { ideaId, title: title || file.name, type };

        formData.append("data", JSON.stringify(dataPayload));
        formData.append("file", file);

        createMutation.mutate(formData);
    };

    const getIcon = (attachmentType: string) => {
        switch (attachmentType) {
            case "PDF": return <FileText className="h-6 w-6 text-rose-500" />;
            case "VIDEO": return <Video className="h-6 w-6 text-indigo-500" />;
            case "DOCUMENT": return <FileIcon className="h-6 w-6 text-blue-500" />;
            default: return <LinkIcon className="h-6 w-6 text-neutral-500" />;
        }
    };

    const handleViewFile = (attachment: any) => {
        const { id, url, type, title } = attachment;
        setViewingAttachment({ id, url, type, title });

        // Optimized viewer for PDFs and Documents
        if (type === "DOCUMENT" || type === "PDF") {
            // Using a more robust viewer URL or direct embedding for PDFs
            setViewAttachmentUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
        } else {
            setViewAttachmentUrl(url);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Attachments</h3>
                    <p className="text-xs text-slate-500">Project resources and documentation</p>
                </div>
                {(!isPublicView && hasPermission) && (
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add File
                    </Button>
                )}
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-3">
                {isLoading ? (
                    <div className="py-10 text-center animate-pulse text-slate-400 text-sm font-medium">Loading files...</div>
                ) : attachments?.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-xl p-8 text-center">
                        <FileIcon className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No attachments found</p>
                    </div>
                ) : (
                    attachments.map((file: any) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-50">
                                    {getIcon(file.type)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-slate-700 truncate max-w-[200px] md:max-w-md">
                                        {file.title || "Unnamed file"}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{file.type}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                                        <span className="text-[10px] text-slate-400 font-mono">ID:{file.id.slice(-5)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                    onClick={() => {
                                        setViewingAttachment(file);
                                        setViewAttachmentUrl(file.url);
                                    }}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                    asChild
                                >
                                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/attachments/${file.id}/download`} target="_blank">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>

                                {(!isPublicView && hasPermission) && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => {/* delete mutation */ }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-xl rounded-3xl p-2 border-none shadow-3xl bg-white overflow-hidden">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-rose-500" />
                            </div>
                            Upload PDF Resource
                        </DialogTitle>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-12">Only PDF documents are supported</p>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-5 mt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Document Title</Label>
                            <Input
                                placeholder="e.g. Project Whitepaper v2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 transition-all focus:bg-white focus:ring-emerald-500/20 font-bold px-4 border-2 text-sm"
                            />
                        </div>

                        <div className="group relative">
                            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1 block mb-2">Target File</Label>
                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-neutral-100 border-dashed rounded-2xl cursor-pointer bg-neutral-50/50 group-hover:bg-white group-hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
                                <div className="flex flex-col items-center justify-center py-6 z-10 text-center">
                                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-3 transition-transform group-hover:rotate-3 group-hover:scale-110">
                                        <Upload className={`h-5 w-5 ${file ? 'text-emerald-500' : 'text-neutral-300'}`} />
                                    </div>
                                    <h5 className="text-xs font-black text-neutral-800 tracking-tight px-4">
                                        {file ? <span className="text-emerald-600 truncate block">{file.name}</span> : "Tap to upload file"}
                                    </h5>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">
                                        PDF format mandatory
                                    </p>
                                </div>
                                <Input
                                    key={fileKey}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf"
                                />
                                {file && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full bg-white/80 backdrop-blur-md shadow-sm" onClick={(e) => { e.preventDefault(); setFile(null); }}>
                                            <X className="h-3.5 w-3.5 text-rose-500" />
                                        </Button>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-neutral-600" onClick={() => setIsAddOpen(false)}>
                                Dismiss
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending} className="flex-2 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-500/20 text-sm transition-all active:scale-95 group overflow-hidden">
                                {createMutation.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Complete Upload
                                        <Maximize2 className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Premium Immersive File Viewer */}
            <Dialog open={!!viewAttachmentUrl} onOpenChange={(val) => {
                if (!val) {
                    setViewAttachmentUrl(null);
                    setViewingAttachment(null);
                }
            }}>
                <DialogContent className="h-[90vh] md:max-w-[800px] w-[95vw] p-0 flex flex-col rounded-3xl overflow-hidden border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] outline-none bg-white transition-all">
                    {/* Header Section */}
                    <DialogHeader className="px-6 py-4 border-b border-neutral-100 flex flex-row items-center justify-between shrink-0 bg-white/90 backdrop-blur-md z-20">
                        <div className="flex items-center gap-4">
                            {/* Icon Container */}
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 shadow-sm shrink-0">
                                {viewingAttachment && (
                                    <div className="text-emerald-600 scale-110">
                                        {getIcon(viewingAttachment.type)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <DialogTitle className="font-bold text-neutral-800 text-lg md:text-xl tracking-tight leading-tight line-clamp-1">
                                    {viewingAttachment?.title || "Project Material"}
                                </DialogTitle>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-emerald-100/50 text-emerald-700 border-none">
                                        {viewingAttachment?.type}
                                    </Badge>
                                    <div className="h-1 w-1 rounded-full bg-neutral-300" />
                                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        Secure Viewer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {viewingAttachment && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-xl font-bold gap-2 h-10 px-3 text-neutral-600 hover:bg-neutral-100 transition-all active:scale-95"
                                    asChild
                                >
                                    <a href={`${API_BASE_URL}/attachments/${viewingAttachment.id}/download`} download={viewingAttachment.title || "download"} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline text-xs">Download</span>
                                    </a>
                                </Button>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                onClick={() => setViewAttachmentUrl(null)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Main Content / Viewer Section */}
                    <div className="relative flex-1 bg-neutral-50 overflow-hidden flex items-center justify-center p-4 md:p-6">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-white border border-neutral-200/60 relative group">
                            {viewAttachmentUrl && viewingAttachment?.type === "VIDEO" ? (
                                <video
                                    src={viewAttachmentUrl}
                                    className="w-full h-full object-contain bg-black rounded-xl"
                                    controls
                                    autoPlay
                                />
                            ) : viewAttachmentUrl ? (
                                <iframe
                                    src={viewAttachmentUrl}
                                    className="w-full h-full border-0 absolute inset-0 bg-white"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title="Material Viewer"
                                />
                            ) : (
                                /* Loading State */
                                <div className="w-full h-full flex flex-col items-center justify-center gap-5">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-100" />
                                        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">
                                            Loading Assets
                                        </p>
                                        <p className="text-[9px] text-neutral-400">Please wait a moment...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IdeaAttachments;
