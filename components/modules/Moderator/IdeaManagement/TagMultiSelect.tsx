/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ITag } from "@/types/tag.types"
import { ChevronDown } from "lucide-react"

interface TagMultiSelectProps {
    tags: ITag[]
    selectedTagIds: string[]
    onChange: (nextValue: string[]) => void
    onBlur: () => void
    isLoadingTags?: boolean
    error?: any
    getErrorMessage: (error: any) => string
}

const TagMultiSelect = ({
    tags,
    selectedTagIds,
    onChange,
    onBlur,
    isLoadingTags = false,
    error,
    getErrorMessage,
}: TagMultiSelectProps) => {
    const selectedNames = selectedTagIds
        .map((id) => tags.find((tag) => tag.id === id)?.name)
        .filter((name): name is string => Boolean(name))

    const triggerText = isLoadingTags
        ? "Loading tags..."
        : selectedNames.length > 0
            ? `${selectedNames.length} selected`
            : "Select tags"

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <Label className={cn(error && "text-destructive")}>Tags</Label>
                {selectedTagIds.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1">
                        {selectedTagIds.map((tagId) => {
                            const tag = tags.find((item) => item.id === tagId)

                            return tag ? (
                                <Badge key={tag.id} variant="outline" className="font-normal">
                                    #{tag.name}
                                </Badge>
                            ) : null
                        })}
                    </div>
                )}
            </div>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full justify-between",
                            error && "border-destructive",
                        )}
                        disabled={isLoadingTags || tags.length === 0}
                    >
                        <span className="truncate text-left">{triggerText}</span>
                        <ChevronDown className="size-4 opacity-70" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width) max-h-72 overflow-y-auto"
                >
                    {isLoadingTags ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm">Loading tags...</p>
                    ) : tags.length === 0 ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm">No tags available.</p>
                    ) : (
                        tags.map((tag) => {
                            const checked = selectedTagIds.includes(tag.id)

                            return (
                                <DropdownMenuItem
                                    key={tag.id}
                                    className="gap-3"
                                    onSelect={(event) => event.preventDefault()}
                                    onClick={() => {
                                        const nextValue = checked
                                            ? selectedTagIds.filter((item) => item !== tag.id)
                                            : [...selectedTagIds, tag.id]

                                        onChange(nextValue)

                                        onBlur()
                                    }}
                                >
                                    <Checkbox
                                        checked={checked}
                                        className="pointer-events-none"
                                    />
                                    <span>{tag.name}</span>
                                </DropdownMenuItem>
                            )
                        })
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {error ? (
                <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
            ) : null}
        </div>
    )
}

export default TagMultiSelect