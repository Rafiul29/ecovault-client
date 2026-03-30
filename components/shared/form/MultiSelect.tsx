"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDown, X } from "lucide-react"

interface MultiSelectProps {
    label: string
    options: { label: string; value: string }[]
    selectedValues: string[]
    onChange: (nextValue: string[]) => void
    placeholder?: string
    loading?: boolean
}

const MultiSelect = ({
    label,
    options,
    selectedValues,
    onChange,
    placeholder = "Select options",
    loading = false,
}: MultiSelectProps) => {
    
    const triggerText = loading
        ? `Loading ${label.toLowerCase()}...`
        : selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
            </div>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                        disabled={loading || options.length === 0}
                    >
                        <span className="truncate text-left">{triggerText}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width) max-h-72 overflow-y-auto"
                >
                    {loading ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm italic">Loading...</p>
                    ) : options.length === 0 ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm italic">No options available.</p>
                    ) : (
                        options.map((option) => {
                            const checked = selectedValues.includes(option.value)

                            return (
                                <DropdownMenuItem
                                    key={option.value}
                                    className="gap-3"
                                    onSelect={(event) => event.preventDefault()}
                                    onClick={() => {
                                        const nextValue = checked
                                            ? selectedValues.filter((item) => item !== option.value)
                                            : [...selectedValues, option.value]
                                        onChange(nextValue)
                                    }}
                                >
                                    <Checkbox checked={checked} />
                                    <span className="flex-1">{option.label}</span>
                                </DropdownMenuItem>
                            )
                        })
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedValues.map((value) => {
                        const option = options.find((o) => o.value === value)
                        return option ? (
                            <Badge key={value} variant="secondary" className="gap-1 pr-1">
                                {option.label}
                                <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(selectedValues.filter(v => v !== value));
                                    }}
                                />
                            </Badge>
                        ) : null
                    })}
                </div>
            )}
        </div>
    )
}

export default MultiSelect
