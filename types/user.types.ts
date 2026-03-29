import { UserRole } from "./userRole";

export interface UserInfo {
    id: string;
    name: string,
    email: string,
    role: UserRole
}