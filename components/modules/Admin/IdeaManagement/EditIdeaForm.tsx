"use client"

import { updateIdeaAction } from "@/app/(dashboardLayout)/admin/dashboard/idea-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ICategory } from "@/types/category"
import { IIdea } from "@/types/idea.types"
import { updateIdeaZodSchema } from "@/zod/idea.validator"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { ChevronLeft, X, Upload, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { getTags } from "@/services/tag.service"
import CategoryMultiSelect from "./CategoryMultiSelect"
import TagMultiSelect from "./TagMultiSelect"
import Link from "next/link"

interface EditIdeaFormProps {
    idea: IIdea
    categories: ICategory[]
    isLoadingCategories?: boolean
}

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) return String(error.message)
    return "Invalid input"
}

const EditIdeaForm = ({ idea, categories, isLoadingCategories }: EditIdeaFormProps) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const queryClient = useQueryClient()
    const router = useRouter()

    useEffect(() => {
        if (idea?.images) {
            setImagePreviews(idea.images)
        }
    }, [idea])

    const { data: tagsResponse, isLoading: isLoadingTags } = useQuery({
        queryKey: ["tags"],
        queryFn: () => getTags(),
    })
    const tags = tagsResponse?.data || []

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateIdeaAction(id, formData),
    })

    const form = useForm({
        defaultValues: {
            title: idea?.title || "",
            description: idea?.description || "",
            problemStatement: idea?.problemStatement || "",
            proposedSolution: idea?.proposedSolution || "",
            status: idea?.status || "DRAFT",
            isPaid: idea?.isPaid || false,
            price: idea?.price || 0,
            isFeatured: idea?.isFeatured || false,
            categories: idea?.categories?.map(c => c.category.id) || [],
            tags: idea?.tags?.map(t => t.tag.id) || [],
            newImages: [] as File[],
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()

            const data = {
                title: value.title,
                description: value.description,
                problemStatement: value.problemStatement,
                proposedSolution: value.proposedSolution,
                status: value.status,
                isPaid: value.isPaid,
                price: Number(value.price) || 0,
                isFeatured: value.isFeatured,
                categories: value.categories,
                tags: value.tags,
                existingImages: imagePreviews.filter(p => !p.startsWith("data:"))
            }

            formData.append("data", JSON.stringify(data))

            if (value.newImages && value.newImages.length > 0) {
                value.newImages.forEach(file => {
                    formData.append("files", file)
                })
            }

            const result = await mutateAsync({ id: idea.id, formData })

            if (!result.success) {
                toast.error(result.message || "Failed to update idea")
                return
            }

            toast.success(result.message || "Idea updated successfully")
            void queryClient.invalidateQueries({ queryKey: ["ideas"] })
            router.push("/admin/dashboard/idea-management")
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            const currentImages = form.getFieldValue("newImages")
            form.setFieldValue("newImages", [...currentImages, ...files])

            files.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeSelectedImage = (index: number) => {
        const preview = imagePreviews[index]
        const isNewImage = preview.startsWith("data:")

        if (isNewImage) {
            // Find its relative index in newImages
            const newImagesPrevs = imagePreviews.filter(p => p.startsWith("data:"))
            const relativeIndex = newImagesPrevs.indexOf(preview)

            const currentNewImages = form.getFieldValue("newImages")
            const nextNewImages = currentNewImages.filter((_, i) => i !== relativeIndex)
            form.setFieldValue("newImages", nextNewImages)
        }
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/idea-management">
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Editing Idea</span>
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">#{idea.id.slice(-6)}</span>
                        </div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight leading-none">{idea.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl font-bold gap-2 text-neutral-500 hover:text-neutral-900 transition-all h-12 px-6">
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="space-y-8 pb-20"
            >
                {/* SECTION: GENERAL INFORMATION */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-neutral-100">
                    <div className="mb-8 border-b border-neutral-100 pb-6">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">General Information</h2>
                        <p className="text-neutral-500 font-medium mt-1">Provide the foundational details for your new idea.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                            <form.Field
                                name="title"
                                validators={{
                                    onChange: ({ value }) => {
                                        const res = updateIdeaZodSchema.shape.title.safeParse(value)
                                        return res.success ? undefined : res.error.issues[0]?.message
                                    }
                                }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label={<span>Idea Title <span className="text-rose-500">*</span></span> as any}
                                        placeholder="Enter a catchy title"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="status">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label className="font-bold text-neutral-700">Idea Status</Label>
                                        <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                                            <SelectTrigger className="h-12 rounded-xl transition-all focus:ring-2 focus:ring-emerald-500/20 border-neutral-200">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-neutral-100 shadow-xl">
                                                <SelectItem value="DRAFT">Draft</SelectItem>
                                                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <form.Field
                            name="description"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = updateIdeaZodSchema.shape.description.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="font-bold text-neutral-700">Description <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="Describe your idea in detail..."
                                        className="h-32 rounded-2xl p-4 transition-all focus:ring-2 focus:ring-emerald-500/20 border-neutral-200 font-sans"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>
                </div>

                {/* SECTION: PROBLEM & SOLUTION */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-neutral-100">
                    <div className="mb-8 border-b border-neutral-100 pb-6">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Problem & Solution</h2>
                        <p className="text-neutral-500 font-medium mt-1">Elaborate on the issue and your approach.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <form.Field
                            name="problemStatement"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = updateIdeaZodSchema.shape.problemStatement.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="font-bold text-neutral-700">Problem Statement <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="What problem does this solve?"
                                        className="h-32 rounded-2xl p-4 transition-all focus:ring-2 focus:ring-emerald-500/20 border-neutral-200 font-sans"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field
                            name="proposedSolution"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = updateIdeaZodSchema.shape.proposedSolution.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="font-bold text-neutral-700">Proposed Solution <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="How do you plan to solve it?"
                                        className="h-32 rounded-2xl p-4 transition-all focus:ring-2 focus:ring-emerald-500/20 border-neutral-200 font-sans"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>
                </div>

                {/* SECTION: CATEGORIZATION */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-neutral-100">
                    <div className="mb-8 border-b border-neutral-100 pb-6">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Categorization</h2>
                        <p className="text-neutral-500 font-medium mt-1">Help users find your idea by adding relevant tags and categories.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <form.Field name="categories">
                            {(field) => (
                                <CategoryMultiSelect
                                    categories={categories}
                                    selectedCategoryIds={field.state.value}
                                    onChange={field.handleChange}
                                    onBlur={field.handleBlur}
                                    isLoadingCategories={isLoadingCategories}
                                    getErrorMessage={getErrorMessage}
                                    error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null}
                                />
                            )}
                        </form.Field>

                        <form.Field name="tags">
                            {(field) => (
                                <TagMultiSelect
                                    tags={tags}
                                    selectedTagIds={field.state.value}
                                    onChange={field.handleChange}
                                    onBlur={field.handleBlur}
                                    isLoadingTags={isLoadingTags}
                                    getErrorMessage={getErrorMessage}
                                    error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null}
                                />
                            )}
                        </form.Field>
                    </div>
                </div>

                {/* SECTION: PRICING & VISIBILITY */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-neutral-100 bg-linear-to-br from-white to-neutral-50/50">
                    <div className="mb-8 border-b border-neutral-100 pb-6">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Pricing & Visibility</h2>
                        <p className="text-neutral-500 font-medium mt-1">Configure monetization and promotion settings.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 items-start">
                        <div className="flex flex-col gap-4">
                            <form.Field name="isPaid">
                                {(field) => (
                                    <div className="space-y-1">
                                        <div
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${field.state.value ? 'bg-emerald-50/50 border-emerald-500' : 'bg-white border-neutral-200 hover:border-emerald-300'}`}
                                            onClick={() => {
                                                field.handleChange(!field.state.value);
                                                if (field.state.value) form.setFieldValue("price", 0);
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                id="isPaid"
                                                checked={field.state.value}
                                                onChange={() => { }}
                                                className={`h-5 w-5 rounded-md border-2 transition-colors focus:ring-emerald-500 cursor-pointer pointer-events-none ${field.state.value ? 'text-emerald-500 border-emerald-500' : 'text-transparent border-neutral-300'}`}
                                            />
                                            <div className="flex flex-col select-none">
                                                <Label htmlFor="isPaid" className="font-bold text-neutral-900 pointer-events-none text-[15px]">Make it a Paid Idea</Label>
                                                <span className="text-xs text-neutral-500 pointer-events-none mt-0.5">Users must purchase to gain access</span>
                                            </div>
                                        </div>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="isFeatured">
                                {(field) => (
                                    <div className="space-y-1">
                                        <div
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${field.state.value ? 'bg-amber-50/50 border-amber-500' : 'bg-white border-neutral-200 hover:border-amber-300'}`}
                                            onClick={() => field.handleChange(!field.state.value)}
                                        >
                                            <input
                                                type="checkbox"
                                                id="isFeatured"
                                                checked={field.state.value}
                                                onChange={() => { }}
                                                className={`h-5 w-5 rounded-md border-2 transition-colors focus:ring-amber-500 cursor-pointer pointer-events-none ${field.state.value ? 'text-amber-500 border-amber-500' : 'text-transparent border-neutral-300'}`}
                                            />
                                            <div className="flex flex-col select-none">
                                                <Label htmlFor="isFeatured" className="font-bold text-neutral-900 pointer-events-none text-[15px]">Feature this Idea</Label>
                                                <span className="text-xs text-neutral-500 pointer-events-none mt-0.5">Promote for higher visibility</span>
                                            </div>
                                        </div>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <div className="flex flex-col h-full justify-start">
                            <form.Subscribe selector={(state) => state.values.isPaid}>
                                {(isPaid) => isPaid && (
                                    <form.Field 
                                        name="price"
                                        validators={{
                                            onChange: ({ value }) => {
                                                if (isPaid && (!value || value <= 0)) {
                                                    return "Price must be greater than $0 for paid ideas"
                                                }
                                                return undefined
                                            }
                                        }}
                                    >
                                        {(field) => (
                                            <div className="space-y-2 p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                                                <div className="flex flex-col">
                                                    <Label className="font-bold text-neutral-800 text-sm">Set Price amount <span className="text-rose-500">*</span></Label>
                                                    <span className="text-[11px] text-neutral-500 mt-0.5">Determine the cost for users to access this idea.</span>
                                                </div>
                                                <div className="relative mt-1 flex items-center">
                                                    <span className="absolute left-4 font-bold text-neutral-500 select-none">$</span>
                                                    <Input
                                                        type="number"
                                                        value={field.state.value || ""}
                                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                                        className="h-11 pl-8 pr-10 rounded-xl bg-white border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20 font-bold text-[15px] font-sans text-neutral-900 transition-all shadow-sm"
                                                        placeholder="0.00"
                                                        min="1"
                                                    />
                                                    <span className="absolute right-4 font-bold text-neutral-400 text-xs select-none">USD</span>
                                                </div>
                                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1 pt-0.5">{field.state.meta.errors[0]}</p>
                                                )}
                                            </div>
                                        )}
                                    </form.Field>
                                )}
                            </form.Subscribe>
                        </div>
                    </div>
                </div>

                {/* SECTION: MEDIA SHOWCASE */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-neutral-100">
                    <div className="mb-8 border-b border-neutral-100 pb-6">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Media Showcase</h2>
                        <p className="text-neutral-500 font-medium mt-1">Manage high-quality images to represent your idea visually.</p>
                    </div>

                    <form.Field name="newImages">
                        {(field) => (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-neutral-100 group shadow-sm transition-transform hover:scale-95">
                                            <Image src={preview} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedImage(idx)}
                                                className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="relative aspect-square flex flex-col items-center justify-center border-3 border-dashed rounded-[1.5rem] bg-neutral-50 border-neutral-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer group shadow-inner">
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            onChange={handleImageChange}
                                        />
                                        <Upload className="h-8 w-8 text-neutral-400 mb-3 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-emerald-600 px-2 text-center">Add Images</span>
                                    </div>
                                </div>
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">{field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
                    <Link href="/admin/dashboard/idea-management" className="w-full sm:w-auto">
                        <Button type="button" variant="outline" className="h-14 w-full sm:px-10 rounded-2xl font-bold text-neutral-500 hover:text-neutral-900 transition-all border-neutral-200" disabled={isPending}>
                            Discard
                        </Button>
                    </Link>
                    <AppSubmitButton isPending={isPending} className="h-14 w-full sm:w-auto sm:min-w-[220px] rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                    </AppSubmitButton>
                </div>
            </form>
        </div>
    )
}

export default EditIdeaForm

