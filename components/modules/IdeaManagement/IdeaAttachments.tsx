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
import { useRouter } from "next/navigation";
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
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                            <LinkIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                        Attachments & Files
                    </h3>
                    <p className="text-xs font-bold text-neutral-400 mt-1.5 uppercase tracking-widest pl-13">Resources & Documentation</p>
                </div>
                {hasPermission && (
                    <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/20 font-black px-6 h-11 transition-all hover:scale-105 active:scale-95">
                        <Plus className="h-5 w-5" /> Add Resource
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-100/50" />
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Syncing Files...</p>
                </div>
            ) : attachments?.length === 0 ? (
                <div className="p-12 text-center bg-neutral-50 border-2 border-neutral-100 border-dashed rounded-[2.5rem] group hover:bg-white hover:border-emerald-100 transition-all duration-500">
                    <div className="h-20 w-20 rounded-3xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <FileIcon className="h-10 w-10 text-neutral-300" />
                    </div>
                    <h4 className="text-lg font-black text-neutral-800 tracking-tight mb-2">No files yet</h4>
                    <p className="text-sm font-medium text-neutral-400 max-w-xs mx-auto">Upload documentation, pitch decks, or resource materials to help others understand your project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {attachments.map((file: any) => (
                        <div key={file.id} className="group relative flex items-center gap-5 p-5 rounded-3xl border border-neutral-100 bg-white hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-neutral-50 border border-neutral-50 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-white group-hover:border-neutral-100 shadow-sm shrink-0">
                                {getIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-neutral-900 truncate pr-2 tracking-tight text-[15px]">{file.title || "Untitled Resource"}</h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0 border-neutral-200 text-neutral-500 bg-neutral-50`}>
                                        {file.type}
                                    </Badge>
                                    <span className="text-[10px] text-neutral-400 font-bold tracking-tighter uppercase flex items-center gap-1">
                                        <div className="h-1 w-1 rounded-full bg-neutral-300" />
                                        RESOURCE ID: {file.id.slice(-6)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 text-neutral-400 transition-colors" onClick={() => handleViewFile(file)} title="View File">
                                    <Eye className="h-5 w-5" />
                                </Button>

                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 text-neutral-400 transition-colors" asChild title="Download File">
                                    <a href={`${API_BASE_URL}/attachments/${file.id}/download`} download={file.title || "download"} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-5 w-5" />
                                    </a>
                                </Button>

                                {hasPermission && (
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-neutral-300 transition-colors" onClick={() => deleteMutation.mutate(file.id)} title="Remove Attachment">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-xl rounded-3xl p-6 border-none shadow-3xl bg-white overflow-hidden">
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
                <DialogContent className="max-w-[50vw] w-full h-[92vh] sm:max-w-[92vw] p-0 flex flex-col rounded-4xl overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.1)] outline-none bg-white">
                    <DialogHeader className="px-10 py-7 border-b border-neutral-50 flex flex-row items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-20">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 shadow-inner">
                                {viewingAttachment && getIcon(viewingAttachment.type)}
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="font-black text-neutral-900 text-2xl tracking-tight leading-none">
                                    {viewingAttachment?.title || "Project Material"}
                                </DialogTitle>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="px-3 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        Verified {viewingAttachment?.type}
                                    </Badge>
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Secure Viewer Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {viewingAttachment && (
                                <Button size="lg" variant="outline" className="rounded-2xl font-black gap-2 h-12 border-neutral-100 hover:bg-neutral-50 shadow-sm transition-all hover:scale-105 active:scale-95 px-6" asChild>
                                    <a href={`${API_BASE_URL}/attachments/${viewingAttachment.id}/download`} download={viewingAttachment.title || "download"} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm">Download Source</span>
                                    </a>
                                </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl text-neutral-400 hover:bg-rose-50 hover:text-rose-500" onClick={() => setViewAttachmentUrl(null)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="relative flex-1 bg-neutral-50/50 overflow-hidden flex items-center justify-center p-4">
                        <div className="w-full h-full rounded-4xl overflow-hidden shadow-3xl bg-white border border-neutral-100 relative group">
                            {viewAttachmentUrl && viewingAttachment?.type === "VIDEO" ? (
                                <video
                                    src={viewAttachmentUrl}
                                    className="w-full h-full object-contain bg-black"
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
                                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                                    <div className="relative h-16 w-16">
                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                                    </div>
                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] animate-pulse">Initializing Viewer</p>
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
