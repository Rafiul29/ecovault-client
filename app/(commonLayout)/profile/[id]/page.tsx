import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicProfileByUserId } from "@/services/admin.service";
import { getUserInfo } from "@/services/auth.service";
import { getUserFollowers } from "@/services/follow.service";
import FollowButton from "@/components/modules/Profile/FollowButton";
import { format } from "date-fns";
import {
  Activity,
  Bookmark,
  Calendar,
  ExternalLink,
  Globe,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
} from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  let userProfile: any = null;
  let error = "";
  let currentUser: any = null;
  let followersList: any[] = [];

  try {
    const res = await getPublicProfileByUserId(id);
    if (res?.success) {
      userProfile = res.data;
    } else {
      error = res?.message || "Failed to fetch user profile.";
    }
  } catch (err: any) {
    error = err?.message || "An error occurred while fetching the profile.";
  }

  try {
    currentUser = await getUserInfo();
    const followRes = await getUserFollowers(id);
    if (followRes?.success) {
      followersList = (followRes.data as any[]) || [];
    }
  } catch {
    // Non-critical — skip silently
  }

  const isFollowing = followersList.some(
    (f: any) =>
      f.follower?.id === currentUser?.id || f.followerId === currentUser?.id,
  );

  if (error || !userProfile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          {error ||
            "The profile you are looking for does not exist or has been removed."}
        </p>
      </div>
    );
  }

  const { role, _count: stats, moderator, admin } = userProfile;
  const isMod = role === "MODERATOR";
  const activeProfile = isMod ? moderator : admin;
  const displayName = activeProfile?.name || userProfile.name;
  const displayEmail = activeProfile?.email || userProfile.email;
  const displayPhoto = activeProfile?.profilePhoto || userProfile.image;

  // Parse social links
  let socialLinks: Record<string, string> = {};
  if (activeProfile?.socialLinks) {
    try {
      socialLinks =
        typeof activeProfile.socialLinks === "string"
          ? JSON.parse(activeProfile.socialLinks)
          : activeProfile.socialLinks;
    } catch {
      socialLinks = {};
    }
  }

  const socialIconMap: Record<string, React.ElementType> = {
    github: Globe,
    twitter: Globe,
    linkedin: Globe,
    facebook: Globe,
    website: Globe,
  };

  const roleLabel =
    role === "SUPER_ADMIN"
      ? "Super Admin"
      : role === "ADMIN"
        ? "Admin"
        : "Moderator";

  return (
    <div className="flex flex-1 flex-col py-6 px-2">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Hero / Header Card */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-muted" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/20">
                  <AvatarImage
                    src={displayPhoto || ""}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                    {displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {!isMod && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow border">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>

              {/* Name + Role */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight truncate">
                    {displayName}
                  </h1>
                  <Badge variant="secondary" className="shrink-0 font-medium">
                    {roleLabel}
                  </Badge>
                  {activeProfile?.isDeleted === false && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-emerald-500 text-emerald-600 text-xs"
                    >
                      Active
                    </Badge>
                  )}
                </div>
                {isMod && activeProfile?.bio && (
                  <p className="text-muted-foreground text-sm line-clamp-2 max-w-xl">
                    {activeProfile.bio}
                  </p>
                )}
                {!isMod && (
                  <p className="text-muted-foreground text-sm">
                    Platform Administrator
                  </p>
                )}
              </div>

              {/* Meta chips + Follow */}
              <div className="flex flex-col gap-2.5 sm:self-center shrink-0 items-end">
                <div className="flex flex-wrap gap-2 justify-end">
                  {activeProfile?.address && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      <MapPin className="h-3 w-3" />
                      <span>{activeProfile.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Joined{" "}
                      {format(new Date(userProfile.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                </div>
                <FollowButton
                  targetUserId={userProfile.id}
                  initialIsFollowing={isFollowing}
                  initialFollowerCount={
                    userProfile._count?.followers ?? followersList.length
                  }
                  currentUserId={currentUser?.id}
                  showCount={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pt-0">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-xl font-bold">{stats?.ideas ?? 0}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Ideas
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xl font-bold">
                    {stats?.followers ?? 0}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Followers
                  </span>
                </div>
                {isMod && (
                  <>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <Star className="h-5 w-5 text-orange-500 mb-1" />
                      <span className="text-xl font-bold">
                        {activeProfile?.reputationScore ?? 0}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Reputation
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <Bookmark className="h-5 w-5 text-violet-500 mb-1" />
                      <span className="text-xl font-bold">
                        {activeProfile?.activityScore ?? 0}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Activity
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">
                      {displayEmail}
                    </p>
                  </div>
                </div>
                {(activeProfile?.phoneNumber ||
                  activeProfile?.contactNumber) && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium truncate">
                          {activeProfile.phoneNumber ||
                            activeProfile.contactNumber}
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Social Links — Moderator only */}
            {isMod && Object.keys(socialLinks).length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {Object.entries(socialLinks).map(([platform, url]) => {
                    const Icon = socialIconMap[platform.toLowerCase()] || Globe;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground capitalize">
                            {platform}
                          </p>
                          <p className="text-sm truncate text-foreground group-hover:text-primary transition-colors">
                            {url}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold">
                  Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Full Name
                    </p>
                    <p className="text-sm font-medium">{displayName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                    <p className="text-sm font-medium">{roleLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Status
                    </p>
                    <p className="text-sm font-medium">{userProfile.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Following
                    </p>
                    <p className="text-sm font-medium">
                      {stats?.following ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Member Since
                    </p>
                    <p className="text-sm font-medium">
                      {format(new Date(userProfile.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {isMod && activeProfile?.assignedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Moderator Since
                      </p>
                      <p className="text-sm font-medium">
                        {format(
                          new Date(activeProfile.assignedAt),
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* {!isMod && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">User ID</p>
                                            <p className="text-xs font-mono text-muted-foreground break-all">{userProfile.id}</p>
                                        </div>
                                    </>
                                )} */}
              </CardContent>
            </Card>

            {/* Moderator Notes */}
            {activeProfile?.assignNotes && (
              <Card className="shadow-sm border-amber-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {isMod ? "Moderator Notes" : "Admin Notes"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeProfile.assignNotes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Activity Summary */}
            <Card className="shadow-sm bg-muted/30 border-dashed">
              <CardContent className="py-4 flex flex-wrap gap-6 items-center justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.ideas ?? 0}</p>
                  <p className="text-xs text-muted-foreground">
                    Published Ideas
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.followers ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.following ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                {isMod && (
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {activeProfile?.reputationScore ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Reputation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
