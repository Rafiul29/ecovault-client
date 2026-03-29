import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;

    if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
    }

    return String(error);
}

type AppFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    append,
    prepend,
    className,
    disabled = false,
}: AppFieldProps) => {

    const firstError = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? getErrorMessage(field.state.meta.errors[0]) : null;

    const hasError = firstError !== null;

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <Label
                htmlFor={field.name}
                className={cn(
                    "text-sm tracking-tight transition-colors duration-200",
                    hasError ? "text-destructive" : "text-foreground/70"
                )}
            >
                {label}
            </Label>

            <div className="relative group transition-all duration-200">
                {
                    prepend && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground z-10">
                            {prepend}
                        </div>
                    )
                }

                <Input
                    id={field.name}
                    name={field.name}
                    type={type}
                    value={field.state.value}
                    placeholder={placeholder}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={disabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${field.name}-error` : undefined}
                    className={cn(
                        "h-10 bg-background border-muted-foreground/20 transition-all duration-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50",
                        prepend && "pl-10",
                        append && "pr-10",
                        hasError && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
                    )}
                />

                {
                    append && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground z-10 transition-colors duration-200 group-focus-within:text-emerald-500">
                            {append}
                        </div>
                    )
                }
            </div>

            {
                hasError && (
                    <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-[12px] font-medium text-destructive mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        {firstError}
                    </p>
                )
            }
        </div>
    )
}


export default AppField