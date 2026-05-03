"use client"

import { createIdeaAction } from "@/app/(dashboardLayout)/admin/dashboard/idea-management/_action"
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
import { createIdeaZodSchema } from "@/zod/idea.validator"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { ChevronLeft, X, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { getTags } from "@/services/tag.service"
import CategoryMultiSelect from "./CategoryMultiSelect"
import TagMultiSelect from "./TagMultiSelect"
import Link from "next/link"

interface CreateIdeaFormProps {
    categories: ICategory[]
    isLoadingCategories?: boolean
    user?: any
}

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) return String(error.message)
    return "Invalid input"
}

const CreateIdeaForm = ({ categories, isLoadingCategories, user }: CreateIdeaFormProps) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const queryClient = useQueryClient()
    const router = useRouter()

    const { data: tagsResponse, isLoading: isLoadingTags } = useQuery({
        queryKey: ["tags"],
        queryFn: () => getTags("limit=1000"),
    })
    const tags = tagsResponse?.data || []

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createIdeaAction,
    })

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            problemStatement: "",
            proposedSolution: "",
            status: "DRAFT",
            isPaid: false,
            price: 0,
            isFeatured: false,
            categories: [] as string[],
            tags: [] as string[],
            images: [] as File[],
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()

            const data = {
                title: value.title,
                description: value.description,
                problemStatement: value.problemStatement,
                proposedSolution: value.proposedSolution,
                status: value.status || "DRAFT",
                isPaid: value.isPaid,
                price: Number(value.price),
                isFeatured: value.isFeatured,
                categories: value.categories,
                tags: value.tags
            }

            formData.append("data", JSON.stringify(data))

            if (value.images && value.images.length > 0) {
                value.images.forEach(file => {
                    formData.append("files", file)
                })
            }

            const result = await mutateAsync(formData)

            if (!result.success) {
                toast.error(result.message || "Failed to create idea")
                return
            }

            toast.success(result.message || "Idea created successfully")
            form.reset()
            setImagePreviews([])

            void queryClient.invalidateQueries({ queryKey: ["ideas"] })
            if (user.role === "MODERATOR") {
                router.push("/moderator/dashboard/ideas")
            } else {
                router.push("/admin/dashboard/idea-management")
            }
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            const currentImages = form.getFieldValue("images")
            form.setFieldValue("images", [...currentImages, ...files])

            files.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        const currentImages = form.getFieldValue("images")
        const nextImages = currentImages.filter((_, i) => i !== index)
        form.setFieldValue("images", nextImages)
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard/idea-management">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Create New Idea</h1>
                    <p className="text-neutral-500 font-medium">Share your innovative solution with the ecosystem.</p>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="space-y-8"
            >
                {/* SECTION: GENERAL INFORMATION */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 md:px-8 py-5 border-b border-neutral-200 bg-white">
                        <h2 className="text-lg font-bold text-neutral-900">Basic Information</h2>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Title, description, and overview of your idea</p>
                    </div>

                    <div className="p-6 md:p-8 space-y-8 bg-white">
                        <div className="grid grid-cols-1">
                            <form.Field
                                name="title"
                                validators={{
                                    onChange: ({ value }) => {
                                        const res = createIdeaZodSchema.shape.title.safeParse(value)
                                        return res.success ? undefined : res.error.issues[0]?.message
                                    }
                                }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label={<span>Title <span className="text-rose-500">*</span></span>}
                                        placeholder="e.g., Solar-Powered Water Purification System"
                                    />
                                )}
                            </form.Field>


                        </div>

                        <form.Field
                            name="description"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createIdeaZodSchema.shape.description.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-neutral-800">Short Description <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="A concise overview of your idea (2–3 sentences)"
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
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 md:px-8 py-5 border-b border-neutral-200 bg-white">
                        <h2 className="text-lg font-bold text-neutral-900">Problem & Solution</h2>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Clearly define the problem you're solving</p>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col gap-6 sm:gap-8 bg-white">
                        <form.Field
                            name="problemStatement"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createIdeaZodSchema.shape.problemStatement.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-neutral-800">Problem Statement <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="What specific problem does your idea address? Include data or evidence if possible."
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
                                    const res = createIdeaZodSchema.shape.proposedSolution.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-neutral-800">Proposed Solution <span className="text-rose-500">*</span></Label>
                                    <Textarea
                                        placeholder="How does your idea solve the problem? Be specific about the approach, technology, or method."
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
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 md:px-8 py-5 border-b border-neutral-200 bg-white">
                        <h2 className="text-lg font-bold text-neutral-900">Categorization</h2>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Help users discover your idea</p>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 bg-white">
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
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 md:px-8 py-5 border-b border-neutral-200 bg-white">
                        <h2 className="text-lg font-bold text-neutral-900">Pricing & Visibility</h2>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Configure monetization and promotion settings.</p>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 items-start bg-white">
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
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 md:px-8 py-5 border-b border-neutral-200 bg-white">
                        <h2 className="text-lg font-bold text-neutral-900">Media Showcase</h2>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Upload high-quality images to represent your idea visually.</p>
                    </div>

                    <div className="p-6 md:p-8 bg-white">
                        <form.Field name="images">
                            {(field) => (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-neutral-100 group shadow-sm transition-transform hover:scale-95">
                                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
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
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
                    <Link href="/admin/dashboard/idea-management" className="w-full sm:w-auto">
                        <Button type="button" variant="outline" className="h-14 w-full sm:px-10 rounded-2xl font-bold text-neutral-500 hover:text-neutral-900 transition-all border-neutral-200" disabled={isPending}>
                            Discard
                        </Button>
                    </Link>
                    <AppSubmitButton isPending={isPending} className="h-14 w-full sm:w-auto sm:min-w-[220px] rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                        Publish Idea
                    </AppSubmitButton>
                </div>
            </form>
        </div>
    )
}

export default CreateIdeaForm
