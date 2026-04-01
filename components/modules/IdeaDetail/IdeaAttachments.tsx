"use client";

import { FileText, Download, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Attachment {
    id: string;
    type: string;
    url: string;
    title: string;
    ideaId: string;
    createdAt: string;
}

interface IdeaAttachmentsProps {
    attachments: Attachment[];
}

const IdeaAttachments = ({ attachments }: IdeaAttachmentsProps) => {
    if (!attachments || attachments.length === 0) return null;

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden mt-6">
            <div className="border-b border-border px-5 py-3 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">Attachments</h2>
            </div>
            <div className="divide-y divide-border">
                {attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileIcon className="size-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground line-clamp-1">
                                    {file.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground uppercase font-bold">
                                    {file.type}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                            asChild
                        >
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="size-3.5" /> Download
                            </a>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IdeaAttachments;
