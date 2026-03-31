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
import { ICategory } from "@/types/category"
import { ChevronDown } from "lucide-react"

interface CategoryMultiSelectProps {
    categories: ICategory[]
    selectedCategoryIds: string[]
    onChange: (nextValue: string[]) => void
    onBlur: () => void
    isLoadingCategories?: boolean
    error?: any
    getErrorMessage: (error: any) => string
}

const CategoryMultiSelect = ({
    categories,
    selectedCategoryIds,
    onChange,
    onBlur,
    isLoadingCategories = false,
    error,
    getErrorMessage,
}: CategoryMultiSelectProps) => {
    const selectedNames = selectedCategoryIds
        .map((id) => categories.find((category) => category.id === id)?.name)
        .filter((name): name is string => Boolean(name))

    const triggerText = isLoadingCategories
        ? "Loading categories..."
        : selectedNames.length > 0
            ? `${selectedNames.length} selected`
            : "Select categories"

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <Label className={cn(error && "text-destructive")}>Categories</Label>
                {selectedCategoryIds.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1">
                        {selectedCategoryIds.map((categoryId) => {
                            const category = categories.find((item) => item.id === categoryId)

                            return category ? (
                                <Badge key={category.id} variant="secondary" style={{ backgroundColor: category.color + '20', color: category.color }}>
                                    {category.name}
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
                        disabled={isLoadingCategories || categories.length === 0}
                    >
                        <span className="truncate text-left">{triggerText}</span>
                        <ChevronDown className="size-4 opacity-70" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width) max-h-72 overflow-y-auto"
                >
                    {isLoadingCategories ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-muted-foreground px-2 py-1.5 text-sm">No categories available.</p>
                    ) : (
                        categories.map((category) => {
                            const checked = selectedCategoryIds.includes(category.id)

                            return (
                                <DropdownMenuItem
                                    key={category.id}
                                    className="gap-3"
                                    onSelect={(event) => event.preventDefault()}
                                    onClick={() => {
                                        const nextValue = checked
                                            ? selectedCategoryIds.filter((item) => item !== category.id)
                                            : [...selectedCategoryIds, category.id]

                                        onChange(nextValue)

                                        onBlur()
                                    }}
                                >
                                    <Checkbox
                                        checked={checked}
                                        className="pointer-events-none"
                                    />
                                    <span>{category.name}</span>
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

export default CategoryMultiSelect