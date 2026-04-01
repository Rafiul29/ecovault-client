import React from 'react';
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-full flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
    );
}
