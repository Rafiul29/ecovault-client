import { SubscriptionTier, PaymentStatus } from "./enums";

export interface ISubscriptionPlan {
    id: string;
    name: string;
    description: string | null;
    tier: SubscriptionTier;
    price: number;
    durationDays: number;
    isActive: boolean;
    features: string[];
    order: number;
    isPopular: boolean;
    buttonText: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ISubscription {
    id: string;
    tier: SubscriptionTier;
    userId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    autoRenew: boolean;
    subscriptionPlanId: string;
    paymentId: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
    subscriptionPlan: ISubscriptionPlan;
    payment: {
        id: string;
        amount: number;
        status: PaymentStatus;
        transactionId: string | null;
        paymentMethod: string | null;
        userId: string;
        paymentGatewayData: any;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ICreateSubscriptionPlanPayload {
    name: string;
    description?: string;
    tier: SubscriptionTier;
    price: number;
    durationDays?: number;
    features?: string[];
    order?: number;
    isPopular?: boolean;
    buttonText?: string;
}

export interface IUpdateSubscriptionPlanPayload {
    name?: string;
    description?: string;
    tier?: SubscriptionTier;
    price?: number;
    durationDays?: number;
    isActive?: boolean;
    features?: string[];
    order?: number;
    isPopular?: boolean;
    buttonText?: string;
}
