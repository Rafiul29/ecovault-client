"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttachmentsByIdea, createAttachment, deleteAttachment, IAttachmentPayload } from "@/services/attachment.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Link as LinkIcon, Loader2, Upload, FileText, File as FileIcon, Video, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Role } from "@/types/enums";

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
    const [type, setType] = useState<"VIDEO" | "PDF" | "DOCUMENT">("DOCUMENT");
    const router = useRouter();

    // Fetch attachments
    const { data: response, isLoading } = useQuery({
        queryKey: ["attachments", ideaId],
        queryFn: () => getAttachmentsByIdea(ideaId),
        refetchInterval: 3000,
    });

    // Data normalization: handle both direct array and ApiResponse object
    const attachments = (Array.isArray(response) ? response : (response as any)?.data) || [];
    const hasPermission = currentUserId === authorId || currentUserRole === Role.ADMIN || currentUserRole === Role.SUPER_ADMIN || currentUserRole === Role.MODERATOR;

    const createMutation = useMutation({
        mutationFn: (payload: FormData) => createAttachment(payload),
        onSuccess: async () => {
            toast.success("Attachment added successfully!");
            await queryClient.invalidateQueries({ queryKey: ["attachments", ideaId] });
            await queryClient.invalidateQueries({ queryKey: ["ideas"] });
            await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });

            setIsAddOpen(false);
            setTitle("");
            setFile(null);
            setFileKey(Date.now());
            setType("DOCUMENT");
        },
        onError: (err: any) => {
            if (err?.response?.data?.errorSources?.length > 0) {
                err.response.data.errorSources.forEach((error: any) => {
                    toast.error(`${error.path}: ${error.message}`);
                });
            } else {
                console.log(err);
                toast.error(err?.response?.data?.message || "Failed to add attachment");
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAttachment(id),
        onSuccess: async () => {
            toast.success("Attachment deleted successfully!");
            await queryClient.invalidateQueries({ queryKey: ["attachments", ideaId] });
            await queryClient.invalidateQueries({ queryKey: ["ideas"] });
            await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
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

        const formData = new FormData();
        const dataPayload = { ideaId, title, type };

        formData.append("data", JSON.stringify(dataPayload));
        formData.append("file", file);

        console.log("--- Frontend FormData Data Payload ---");
        for (let [key, value] of (formData as any).entries()) {
            console.log(`${key}:`, value);
        }

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

        // Use Google Docs viewer for PPTX, DOCX, XLSX, and PDFs to ensure reliable cross-browser embedding
        if (type === "DOCUMENT" || type === "PDF") {
            setViewAttachmentUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
        } else {
            // For Videos or other types, try direct render/embedding
            setViewAttachmentUrl(url);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-emerald-500" />
                        Attachments & Files
                    </h3>
                    <p className="text-sm font-medium text-neutral-500 mt-1">Resource files, presentations, and videos</p>
                </div>
                {hasPermission && (
                    <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold">
                        <Plus className="h-4 w-4" /> Add File
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
            ) : attachments?.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 border border-neutral-100 border-dashed rounded-[2rem]">
                    <FileIcon className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-neutral-500">No attachments have been added yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attachments.map((file: any) => (
                        <div key={file.id} className="group relative flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                                {getIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-neutral-900 truncate pr-4">{file.title || "Untitled File"}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest bg-neutral-100 text-neutral-500">{file.type}</Badge>
                                    <span className="text-xs text-neutral-400 font-mono truncate">
                                        {(() => {
                                            try { return new URL(file.url).hostname }
                                            catch { return 'Attached File' }
                                        })()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 transition-all duration-300">
                                <Button size="icon" variant="secondary" className="h-9 w-9 bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-600 rounded-lg shadow-sm border border-neutral-200" onClick={() => handleViewFile(file)} title="View File">
                                    <Eye className="h-4 w-4" />
                                </Button>

                                <Button size="icon" variant="secondary" className="h-9 w-9 bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-600 rounded-lg shadow-sm border border-neutral-200" asChild title="Download File">
                                    <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/attachments/${file.id}/download`} download={file.title || "download"} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>

                                {hasPermission && (
                                    <Button size="icon" variant="destructive" className="h-9 w-9 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-colors border-none shadow-sm" onClick={() => deleteMutation.mutate(file.id)} title="Delete Attachment">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Attachment Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-neutral-900 tracking-tight">Add New Resource</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="font-bold text-neutral-700">File Type <span className="text-rose-500">*</span></Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger className="h-12 rounded-xl border-neutral-200">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PDF"> PDF File</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-neutral-700">File Description / Title</Label>
                            <Input
                                placeholder="e.g. Pitch Deck Q1 2026"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 rounded-xl border-neutral-200 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-neutral-700">Upload File <span className="text-rose-500">*</span></Label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-200 border-dashed rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-neutral-500 font-bold">
                                        {file ? <span className="text-emerald-600">{file.name}</span> : <span>Click to upload or drag and drop</span>}
                                    </p>
                                    <p className="text-xs text-neutral-400">PDF, PPTX, DOCX, MP4</p>
                                </div>
                                <Input
                                    key={fileKey}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mov,.avi"
                                />
                            </label>
                        </div>

                        <Button type="submit" disabled={createMutation.isPending} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base shadow-xl shadow-emerald-500/20">
                            {createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Attachment"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View File Inline Modal */}
            <Dialog open={!!viewAttachmentUrl} onOpenChange={(val) => {
                if (!val) {
                    setViewAttachmentUrl(null);
                    setViewingAttachment(null);
                }
            }}>
                <DialogContent className="max-w-[70vw] w-full h-[85vh] p-0 flex flex-col rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="px-8 py-5 border-b border-neutral-100 flex flex-row items-center justify-between shrink-0 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                {viewingAttachment && getIcon(viewingAttachment.type)}
                            </div>
                            <div>
                                <DialogTitle className="font-black text-neutral-800 text-lg leading-none">
                                    {viewingAttachment?.title || "File Viewer"}
                                </DialogTitle>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                                    {viewingAttachment?.type} Resource
                                </p>
                            </div>
                        </div>
                        {viewingAttachment && (
                            <Button size="sm" variant="outline" className="rounded-xl font-bold gap-2 h-10 border-neutral-200 hover:bg-neutral-50" asChild>
                                <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/attachments/${viewingAttachment.id}/download`} download={viewingAttachment.title || "download"} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 text-emerald-600" />
                                    <span>Download</span>
                                </a>
                            </Button>
                        )}
                    </DialogHeader>
                    <div className="relative flex-1 bg-neutral-900 overflow-hidden">
                        {viewAttachmentUrl && viewingAttachment?.type === "VIDEO" ? (
                            <video
                                src={viewAttachmentUrl}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                            />
                        ) : viewAttachmentUrl ? (
                            <iframe
                                src={viewAttachmentUrl}
                                className="w-full h-full border-0 absolute inset-0 bg-white"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title="File Viewer"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IdeaAttachments;
