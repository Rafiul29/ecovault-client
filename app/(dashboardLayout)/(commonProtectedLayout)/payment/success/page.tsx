import { getUserInfo } from "@/services/auth.service"
import SuccessContent from "./SuccessContent";

export default async function PaymentSuccessPage() {
    const user = await getUserInfo();

    const redirectUrl =
        user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
            ? "/admin/dashboard/idea-management"
            : user?.role === "MODERATOR"
                ? "/dashboard/my-ideas"
                : "/dashboard/my-purchased-ideas";

    return (
        <SuccessContent redirectUrl={redirectUrl} />
    );
}