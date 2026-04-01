import { Role, SubscriptionTier, UserStatus } from "./enums";
import { UserRole } from "./userRole";


export interface UserInfo {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    status: UserStatus;
    subscription?: {
        tier: SubscriptionTier;
        isActive: boolean;
        endDate?: string;
    };
    followersCount: number;
    followingCount: number;
    ideasCount: number;
    bio?: string;
    createdAt: string;
}