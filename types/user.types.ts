import { Role, UserStatus } from "./enums";
import { UserRole } from "./userRole";


export interface UserInfo {
    id: string;
    name: string,
    email: string,
    role: Role,
    status?: UserStatus,
    image?: string,
}