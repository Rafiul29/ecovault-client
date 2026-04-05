"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { toast } from "sonner"
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit2,
    Save,
    Globe,
    Phone,
    MapPin,
    Link as LinkIcon,
    Camera,
    Info,
    LayoutDashboard
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import ChangePasswordForm from "./ChangePasswordForm"
import { UserInfo } from "@/types/user.types"
import { UserRole } from "@/types/userRole"
import { updateMyModeratorProfile } from "@/services/moderator.service"
import { updateMyMemberProfile } from "@/services/member.service";
import { updateProfile } from "@/services/auth.service";
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProfileModuleProps {
    userInfo: UserInfo;
    profileData: any; // Role specific profile data
}

// Zod schema for individual field validation could be used, or just handle it in the form.
const profileValidationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
})

const ProfileModule = ({ userInfo, profileData }: ProfileModuleProps) => {

    const route = useRouter()

    const [isEditing, setIsEditing] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(userInfo.image || null)

    const isModerator = userInfo.role === UserRole.MODERATOR
    const isMember = userInfo.role === UserRole.MEMBER
    const isAdmin = userInfo.role === UserRole.ADMIN || userInfo.role === UserRole.SUPER_ADMIN

    const socialLinks = profileData?.socialLinks || {}

    const form = useForm({
        defaultValues: {
            name: userInfo.name || "",
            bio: profileData?.bio || userInfo.bio || "",
            phoneNumber: profileData?.phoneNumber || "",
            address: profileData?.address || "",
            contactNumber: profileData?.contactNumber || "",
            facebook: socialLinks.facebook || "",
            twitter: socialLinks.twitter || "",
            linkedin: socialLinks.linkedin || "",
            instagram: socialLinks.instagram || "",
        },
        onSubmit: async ({ value }) => {
            setIsPending(true)
            try {
                // Validation check
                const validation = profileValidationSchema.safeParse(value)
                if (!validation.success) {
                    const firstError = validation.error.issues[0].message
                    toast.error(firstError)
                    setIsPending(false)
                    return
                }

                let payload: any;
                const links = {
                    facebook: value.facebook,
                    twitter: value.twitter,
                    linkedin: value.linkedin,
                    instagram: value.instagram,
                }

                if (selectedImage) {
                    const formData = new FormData()
                    formData.append("name", value.name)
                    formData.append("bio", value.bio)

                    if (isModerator) {
                        formData.append("phoneNumber", value.phoneNumber)
                        formData.append("address", value.address)
                        formData.append("contactNumber", value.contactNumber)
                        formData.append("socialLinks", JSON.stringify(links))
                    }
                    payload = formData
                } else {
                    payload = {
                        name: value.name,
                        bio: value.bio,
                    }
                    if (isModerator) {
                        payload.phoneNumber = value.phoneNumber
                        payload.address = value.address
                        payload.contactNumber = value.contactNumber
                        payload.socialLinks = links
                    }
                }

                let res;
                if (isModerator) {
                    res = await updateMyModeratorProfile(payload) as any
                } else if (isMember) {
                    res = await updateMyMemberProfile(payload) as any
                } else {
                    res = await updateProfile(payload) as any
                }

                if (res.success) {
                    toast.success("Profile updated successfully")
                    setIsEditing(false)
                    route.refresh();
                } else {
                    toast.error(res.message || "Failed to update profile")
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred")
            } finally {
                setIsPending(false)
            }
        },
    })

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            const formData = new FormData()
            formData.append("file", file)
            updateMyModeratorProfile(formData)
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Title/Header Section */}
            <div className="mb-6 flex flex-col md:flex-row items-center gap-6 p-8 bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-4xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] group-hover:bg-emerald-500/30 transition-colors duration-700" />

                <div className="relative group/avatar">
                    <Avatar className="h-32 w-32 border-4 border-emerald-500/30 shadow-2xl transition-all duration-500 group-hover/avatar:scale-105 group-hover/avatar:border-emerald-500">
                        <AvatarImage src={imagePreview || ""} />
                        <AvatarFallback className="bg-emerald-100 text-3xl font-black text-emerald-700">
                            {userInfo.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {/* {isEditing && ( */}
                    <label className="absolute bottom-1 right-1 p-2 bg-emerald-600 text-white rounded-xl shadow-xl cursor-pointer hover:bg-emerald-500 transition-all hover:scale-110 active:scale-95 border-2 border-slate-900">
                        <Camera className="size-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                    {/* )} */}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                        <h1 className="text-4xl font-black tracking-tight text-white">{userInfo.name}</h1>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 font-bold tracking-wider uppercase text-[10px]">
                            {userInfo.role.replace("_", " ")}
                        </Badge>
                    </div>
                    <p className="text-emerald-50/60 font-medium max-w-lg mb-4">
                        {profileData?.bio || userInfo.bio || "Crafting a sustainable future, one idea at a time."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-emerald-100/50">
                        <span className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
                            <Mail className="size-3" /> {userInfo.email}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
                            <Calendar className="size-3" /> Joined {new Date(userInfo.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vertical Tabs Sections */}
            <Tabs orientation="vertical" defaultValue="overview" className="flex flex-col md:flex-row gap-6">
                <TabsList className="flex md:flex-col h-fit p-1.5 bg-white/80 backdrop-blur-md shadow-xl shadow-gray-200/40 rounded-3xl border border-gray-100 min-w-[240px]">
                    <TabsTrigger value="overview" className="flex-1 md:flex-none justify-start gap-3 py-3.5 px-5 rounded-2xl transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-600/20 group">
                        <Info className="size-5 group-data-[state=active]:text-white" />
                        <span className="font-bold tracking-tight">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="edit" className="flex-1 md:flex-none justify-start gap-3 py-4 px-6 rounded-2xl transition-all data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none group">
                        <Edit2 className="size-5 group-data-[state=active]:text-emerald-600" />
                        <span className="font-bold tracking-tight">Personal Info</span>
                    </TabsTrigger>
                    {isModerator && (
                        <TabsTrigger value="social" className="flex-1 md:flex-none justify-start gap-3 py-4 px-6 rounded-2xl transition-all data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none group">
                            <Globe className="size-5 group-data-[state=active]:text-emerald-600" />
                            <span className="font-bold tracking-tight">Social Connect</span>
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="security" className="flex-1 md:flex-none justify-start gap-3 py-4 px-6 rounded-2xl transition-all data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none group">
                        <Shield className="size-5 group-data-[state=active]:text-emerald-600" />
                        <span className="font-bold tracking-tight">Change Password</span>
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1">
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-4xl overflow-hidden">
                                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                                        <CardTitle className="text-2xl font-black flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg">
                                                <User className="size-5" />
                                            </div>
                                            Biography & Mission
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                                            "{profileData?.bio || userInfo.bio || "No biography shared yet. Every change maker starts somewhere."}"
                                        </p>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl p-8 hover:bg-emerald-50/30 transition-colors duration-500">
                                        <LayoutDashboard className="size-8 text-emerald-600 mb-4" />
                                        <h3 className="text-3xl font-black text-slate-800 mb-1">{userInfo.ideasCount || 0}</h3>
                                        <p className="font-bold text-slate-500 text-sm uppercase tracking-widest">Ideas Shared</p>
                                    </Card>
                                    <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl p-8 hover:bg-emerald-50/30 transition-colors duration-500">
                                        <User className="size-8 text-blue-600 mb-4" />
                                        <h3 className="text-3xl font-black text-slate-800 mb-1">{userInfo.followersCount || 0}</h3>
                                        <p className="font-bold text-slate-500 text-sm uppercase tracking-widest">Followers</p>
                                    </Card>
                                </div>
                            </div>

                            <Card className="border-none shadow-xl shadow-gray-200/50 rounded-4xl h-fit">
                                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                                    <CardTitle className="text-xl font-black">Account Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Status</span>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 font-bold">{userInfo.status}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Subscription</span>
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 font-bold">{userInfo.subscription?.tier || "FREE"}</Badge>
                                        </div>
                                    </div>
                                    <Separator className="my-6 opacity-50" />
                                    <div className="space-y-4 text-sm font-medium">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="size-4 text-emerald-500" />
                                            <span>{profileData?.phoneNumber || "No phone added"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin className="size-4 text-emerald-500" />
                                            <span>{profileData?.address || "Location not set"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="edit">
                        <Card className="border-none shadow-xl shadow-gray-200/40 rounded-4xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-gray-100 bg-linear-to-r from-gray-50 to-transparent">
                                <CardTitle className="text-2xl font-black text-slate-900">Update Profile</CardTitle>
                                <CardDescription className="text-base font-medium text-slate-500">Refine your public identity and storyteller persona.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        form.handleSubmit()
                                    }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-3">
                                                <div className="h-[2px] w-8 bg-emerald-500" /> Identity Info
                                            </h3>
                                            <form.Field
                                                name="name"
                                                validators={{
                                                    onChange: z.string().min(2, "Name must be at least 2 characters")
                                                }}
                                                children={(field) => (
                                                    <AppField field={field} label="Full Name" placeholder="Eco Champ" />
                                                )}
                                            />
                                            <form.Field
                                                name="bio"
                                                children={(field) => (
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-sm font-bold text-slate-700 tracking-tight">Biography</label>
                                                        <textarea
                                                            className="min-h-[160px] flex w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-4 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 outline-none resize-none placeholder:text-gray-300"
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="Tell your story. What drives you?"
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-3">
                                                <div className="h-[2px] w-8 bg-blue-500" /> Contact Details
                                            </h3>
                                            <form.Field
                                                name="phoneNumber"
                                                children={(field) => (
                                                    <AppField field={field} label="Phone primary" placeholder="+1 (555) 000-0000" prepend={<Phone className="size-4" />} />
                                                )}
                                            />
                                            <form.Field
                                                name="address"
                                                children={(field) => (
                                                    <AppField field={field} label="Home Base" placeholder="San Francisco, CA" prepend={<MapPin className="size-4" />} />
                                                )}
                                            />
                                            <form.Field
                                                name="contactNumber"
                                                children={(field) => (
                                                    <AppField field={field} label="Emergency / Alternative Contact" placeholder="+1 (555) 111-2222" prepend={<Shield className="size-4" />} />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <AppSubmitButton isPending={isPending} className="w-full md:w-64 h-12 bg-linear-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-bold text-base shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                                            <Save className="size-4 mr-2" /> Sync Changes
                                        </AppSubmitButton>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social">
                        <Card className="border-none shadow-xl shadow-gray-200/40 rounded-4xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-gray-100 bg-linear-to-r from-gray-50 to-transparent text-center">
                                <CardTitle className="text-2xl font-black text-slate-900">Social Connections</CardTitle>
                                <CardDescription className="text-base font-medium text-slate-500">Amplify your reach and engage with the community.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        form.handleSubmit()
                                    }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <form.Field
                                            name="facebook"
                                            validators={{
                                                onChange: z.string().url("Must be a valid URL").optional().or(z.literal(""))
                                            }}
                                            children={(field) => (
                                                <AppField field={field} label="Facebook Profile" placeholder="https://facebook.com/..." prepend={<LinkIcon className="size-4 text-[#1877F2]" />} />
                                            )}
                                        />
                                        <form.Field
                                            name="twitter"
                                            validators={{
                                                onChange: z.string().url("Must be a valid URL").optional().or(z.literal(""))
                                            }}
                                            children={(field) => (
                                                <AppField field={field} label="X (Twitter) Handle" placeholder="https://twitter.com/..." prepend={<LinkIcon className="size-4 text-[#1DA1F2]" />} />
                                            )}
                                        />
                                        <form.Field
                                            name="linkedin"
                                            validators={{
                                                onChange: z.string().url("Must be a valid URL").optional().or(z.literal(""))
                                            }}
                                            children={(field) => (
                                                <AppField field={field} label="LinkedIn Professional" placeholder="https://linkedin.com/in/..." prepend={<LinkIcon className="size-4 text-[#0A66C2]" />} />
                                            )}
                                        />
                                        <form.Field
                                            name="instagram"
                                            validators={{
                                                onChange: z.string().url("Must be a valid URL").optional().or(z.literal(""))
                                            }}
                                            children={(field) => (
                                                <AppField field={field} label="Instagram Gallery" placeholder="https://instagram.com/..." prepend={<LinkIcon className="size-4 text-[#E4405F]" />} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <AppSubmitButton isPending={isPending} className="w-full md:w-64 h-12 bg-linear-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-bold text-base shadow-xl shadow-emerald-600/10 active:scale-95 transition-all">
                                            <Save className="size-4 mr-2" /> Save Connections
                                        </AppSubmitButton>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card className="border-none shadow-xl shadow-gray-200/40 rounded-4xl max-w-2xl mx-auto overflow-hidden">
                            <CardHeader className="p-8 border-b border-gray-100 bg-slate-50/50 text-center">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/5">
                                    <Shield className="size-8" />
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900">Security Vault</CardTitle>
                                <CardDescription className="text-base font-medium text-slate-500">Protect your assets and change your access credentials.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ChangePasswordForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default ProfileModule
