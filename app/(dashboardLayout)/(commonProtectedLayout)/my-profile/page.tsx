import ProfileModule from "@/components/modules/Profile/ProfileModule";
import { getUserInfo } from "@/services/auth.service";
import { getMyMemberProfile } from "@/services/member.service";
import { getMyModeratorProfile } from "@/services/moderator.service";
import { UserRole } from "@/types/userRole";

const MyProfilePage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        return null; // Or a loading/error state
    }

    let profileData = null;

    try {
        if (userInfo.role === UserRole.MODERATOR) {
            const res = await getMyModeratorProfile() as any;
            profileData = res.data;
        } else if (userInfo.role === UserRole.MEMBER) {
            const res = await getMyMemberProfile() as any;
            profileData = res.data;
        }
    } catch (error) {
        console.error("Error fetching role-specific profile:", error);
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            <ProfileModule userInfo={userInfo} profileData={profileData} />
        </div>
    );
};

export default MyProfilePage;