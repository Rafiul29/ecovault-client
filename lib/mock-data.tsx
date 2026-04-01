import {
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Users,
  Zap,
  Globe,
} from "lucide-react";
import type {
  User,
  Idea,
  Achievement,
  SubscriptionPlan,
  Category,
} from "../types/types";
import { UserRole } from "@/types/userRole";

// ── Users ──────────────────────────────────────────────────────────────────
export const mockCurrentUser: User = {
  id: "user_1",
  name: "Alex Rivera",
  email: "alex@ecovalut.io",
  image: "https://i.pravatar.cc/80?u=alex-rivera",
  role: UserRole.MEMBER,
  status: "ACTIVE",
  subscription: { tier: "PRO", isActive: true, endDate: "2026-04-30" },
  followersCount: 284,
  followingCount: 97,
  ideasCount: 12,
  bio: "Sustainability enthusiast & green-tech entrepreneur. Building the future one idea at a time.",
  createdAt: "2025-01-15T10:00:00Z",
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user_2",
    name: "Priya Nair",
    email: "priya@ecovalut.io",
    image: "https://i.pravatar.cc/80?u=priya-nair",
    role: "MEMBER",
    status: "ACTIVE",
    subscription: { tier: "FREE", isActive: true },
    followersCount: 142,
    followingCount: 55,
    ideasCount: 7,
    createdAt: "2025-02-20T08:00:00Z",
  },
  {
    id: "user_3",
    name: "Marco Chen",
    email: "marco@ecovalut.io",
    image: "https://i.pravatar.cc/80?u=marco-chen",
    role: "MODERATOR",
    status: "ACTIVE",
    subscription: { tier: "PREMIUM", isActive: true },
    followersCount: 521,
    followingCount: 210,
    ideasCount: 23,
    createdAt: "2024-11-10T12:00:00Z",
  },
  {
    id: "user_4",
    name: "Sara Okonkwo",
    email: "sara@ecovalut.io",
    image: "https://i.pravatar.cc/80?u=sara-okonkwo",
    role: "ADMIN",
    status: "ACTIVE",
    subscription: { tier: "PREMIUM", isActive: true },
    followersCount: 890,
    followingCount: 45,
    ideasCount: 31,
    createdAt: "2024-08-01T09:00:00Z",
  },
];

// ── Categories ─────────────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  {
    id: "cat_1",
    name: "Clean Energy",
    slug: "clean-energy",
    color: "#10b981",
    icon: "Zap",
  },
  {
    id: "cat_2",
    name: "Agriculture",
    slug: "agriculture",
    color: "#f59e0b",
    icon: "Leaf",
  },
  {
    id: "cat_3",
    name: "Waste Reduction",
    slug: "waste-reduction",
    color: "#3b82f6",
    icon: "Recycle",
  },
  {
    id: "cat_4",
    name: "Water",
    slug: "water",
    color: "#0ea5e9",
    icon: "Droplets",
  },
  {
    id: "cat_5",
    name: "Urban Planning",
    slug: "urban-planning",
    color: "#8b5cf6",
    icon: "Building2",
  },
  {
    id: "cat_6",
    name: "Biodiversity",
    slug: "biodiversity",
    color: "#ec4899",
    icon: "TreePine",
  },
];

// ── Ideas ──────────────────────────────────────────────────────────────────
export const mockIdeas: Idea[] = [
  {
    id: "idea_1",
    title: "Solar-Powered Community Microgrids",
    slug: "solar-powered-community-microgrids",
    description:
      "A decentralized solar microgrid solution for underserved urban communities to achieve energy independence and reduce carbon footprint.",
    problemStatement:
      "Millions of urban households lack access to affordable, clean energy. Centralized grids are costly to maintain and vulnerable to failures.",
    proposedSolution:
      "Deploy modular solar panels with shared battery storage across apartment complexes, managed via a mobile app with real-time monitoring.",
    images: ["https://picsum.photos/seed/solar/800/500"],
    status: "PUBLISHED",
    isPaid: false,
    isFeatured: true,
    viewCount: 3240,
    upvoteCount: 287,
    downvoteCount: 12,
    trendingScore: 94.5,
    author: {
      id: "user_2",
      name: "Priya Nair",
      image: "https://i.pravatar.cc/80?u=priya-nair",
    },
    categories: [mockCategories[0]],
    tags: [
      { id: "tag_1", name: "solar", slug: "solar" },
      { id: "tag_2", name: "microgrid", slug: "microgrid" },
    ],
    createdAt: "2026-02-10T10:00:00Z",
    publishedAt: "2026-02-12T14:00:00Z",
  },
  {
    id: "idea_2",
    title: "AI-Driven Precision Agriculture Platform",
    slug: "ai-precision-agriculture",
    description:
      "Machine learning models trained on satellite and IoT sensor data to optimize crop yields while minimizing water and fertilizer usage.",
    problemStatement:
      "Traditional farming uses 70% of global freshwater but wastes up to 30% through inefficient irrigation.",
    proposedSolution:
      "An affordable AI platform that integrates with existing farming equipment and provides real-time recommendations.",
    images: ["https://picsum.photos/seed/agri/800/500"],
    status: "PUBLISHED",
    isPaid: true,
    price: 29.99,
    isFeatured: true,
    viewCount: 2870,
    upvoteCount: 241,
    downvoteCount: 8,
    trendingScore: 88.2,
    author: {
      id: "user_3",
      name: "Marco Chen",
      image: "https://i.pravatar.cc/80?u=marco-chen",
    },
    categories: [mockCategories[1]],
    tags: [
      { id: "tag_3", name: "AI", slug: "ai" },
      { id: "tag_4", name: "farming", slug: "farming" },
    ],
    createdAt: "2026-02-15T08:00:00Z",
    publishedAt: "2026-02-17T11:00:00Z",
  },
  {
    id: "idea_3",
    title: "Biodegradable Urban Packaging Network",
    slug: "biodegradable-urban-packaging",
    description:
      "A city-wide B2B network for restaurants and retailers to switch to compostable packaging with subsidized collection logistics.",
    problemStatement:
      "Food packaging constitutes 40% of municipal plastic waste, yet most businesses lack affordable alternatives and collection infrastructure.",
    proposedSolution:
      "Partnership model connecting bioplastic manufacturers, local governments, and businesses through a SaaS logistics platform.",
    images: ["https://picsum.photos/seed/eco/800/500"],
    status: "PENDING",
    isPaid: false,
    isFeatured: false,
    viewCount: 540,
    upvoteCount: 63,
    downvoteCount: 3,
    trendingScore: 42.1,
    author: {
      id: "user_1",
      name: "Alex Rivera",
      image: "https://i.pravatar.cc/80?u=alex-rivera",
    },
    categories: [mockCategories[2]],
    tags: [
      { id: "tag_5", name: "packaging", slug: "packaging" },
      { id: "tag_6", name: "compost", slug: "compost" },
    ],
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "idea_4",
    title: "Smart Rainwater Harvesting for Slums",
    slug: "smart-rainwater-harvesting",
    description:
      "Low-cost IoT-enabled rainwater collection systems designed specifically for informal settlements with unreliable water supply.",
    problemStatement:
      "Over 1 billion people in informal settlements lack reliable water access, despite abundant rainfall in many regions.",
    proposedSolution:
      "Low-cost modular tanks with IoT sensors, automated filtration, and a community-managed distribution app.",
    images: ["https://picsum.photos/seed/water/800/500"],
    status: "APPROVED",
    isPaid: false,
    isFeatured: false,
    viewCount: 1120,
    upvoteCount: 145,
    downvoteCount: 5,
    trendingScore: 71.3,
    author: {
      id: "user_2",
      name: "Priya Nair",
      image: "https://i.pravatar.cc/80?u=priya-nair",
    },
    categories: [mockCategories[3]],
    tags: [
      { id: "tag_7", name: "water", slug: "water" },
      { id: "tag_8", name: "IoT", slug: "iot" },
    ],
    createdAt: "2026-02-25T14:00:00Z",
  },
  {
    id: "idea_5",
    title: "Green Roof Urban Biodiversity Initiative",
    slug: "green-roof-biodiversity",
    description:
      "A subscription-based program that converts flat rooftops in cities into thriving ecosystems with native plant species.",
    problemStatement:
      "Urbanization has reduced biodiversity in cities by up to 60%, affecting pollinator populations and mental health.",
    proposedSolution:
      "Partner with building owners, landscape architects, and municipalities to install and maintain green roofs affordably.",
    images: ["https://picsum.photos/seed/green/800/500"],
    status: "DRAFT",
    isPaid: false,
    isFeatured: false,
    viewCount: 0,
    upvoteCount: 0,
    downvoteCount: 0,
    trendingScore: 0,
    author: {
      id: "user_1",
      name: "Alex Rivera",
      image: "https://i.pravatar.cc/80?u=alex-rivera",
    },
    categories: [mockCategories[5]],
    tags: [{ id: "tag_9", name: "biodiversity", slug: "biodiversity" }],
    createdAt: "2026-03-20T16:00:00Z",
  },
  {
    id: "idea_6",
    title: "Carbon Credit Marketplace for SMEs",
    slug: "carbon-credit-marketplace-smes",
    description:
      "A blockchain-verified carbon credit marketplace enabling small businesses to offset emissions transparently and affordably.",
    problemStatement:
      "SMEs generate 60% of business carbon emissions but cannot access existing carbon markets due to high entry costs.",
    proposedSolution:
      "Tokenized micro carbon credits on a public blockchain with simplified verification and a marketplace for trading.",
    images: ["https://picsum.photos/seed/carbon/800/500"],
    status: "PUBLISHED",
    isPaid: true,
    price: 49.99,
    isFeatured: false,
    viewCount: 1980,
    upvoteCount: 198,
    downvoteCount: 22,
    trendingScore: 65.7,
    author: {
      id: "user_3",
      name: "Marco Chen",
      image: "https://i.pravatar.cc/80?u=marco-chen",
    },
    categories: [mockCategories[4]],
    tags: [
      { id: "tag_10", name: "blockchain", slug: "blockchain" },
      { id: "tag_11", name: "carbon", slug: "carbon" },
    ],
    createdAt: "2026-01-20T10:00:00Z",
    publishedAt: "2026-01-22T09:00:00Z",
  },
];

// ── Page Content ───────────────────────────────────────────────────

export const features = [
  {
    icon: Lightbulb,
    title: "Submit Your Ideas",
    description:
      "Share your eco-innovation with a global community of change-makers and investors. Our guided submission flow makes it simple to articulate your vision and reach the right audience.",
    accent:
      "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
    wide: true,
  },
  {
    icon: TrendingUp,
    title: "Track Traction",
    description:
      "Real-time analytics show how your ideas perform — views, votes, and reach.",
    accent:
      "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white",
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    description:
      "Every idea passes expert moderator review before publication.",
    accent:
      "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    wide: false,
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Follow creators, comment, vote, and collaborate with people who care.",
    accent:
      "bg-violet-50 text-violet-700 group-hover:bg-violet-600 group-hover:text-white",
    wide: false,
  },
  {
    icon: Zap,
    title: "Monetize Ideas",
    description:
      "Sell detailed plans to businesses and investors seeking the next big thing.",
    accent:
      "bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
    wide: false,
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "Urban planning to renewable energy — every category of sustainability covered.",
    accent:
      "bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
    wide: false,
  },
];

export const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Create & Submit",
    description:
      "Fill in your idea with problem statement, proposed solution, and supporting materials. Takes less than 10 minutes.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Expert Review",
    description:
      "Our trained moderators assess your idea for quality, originality, and sustainability impact within 48 hours.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Earn Impact",
    description:
      "Once published, your idea reaches thousands of investors, collaborators, and eco-entrepreneurs worldwide.",
  },
];

export const statsData = [
  { label: "Ideas Published", value: "2,300+" },
  { label: "Active Members", value: "4,800+" },
  { label: "Countries Reached", value: "62" },
  { label: "Ideas Purchased", value: "890+" },
];

export const testimonials = [
  {
    quote:
      "EcoValut connected me with investors who turned my solar microgrid concept into a pilot project now serving 200 families. The platform genuinely changes lives.",
    author: "Priya Nair",
    role: "Clean Energy Advocate",
    avatar: "https://i.pravatar.cc/80?u=priya-nair",
    stars: 5,
  },
  {
    quote:
      "The moderation process is thorough and fast. My idea was live in 36 hours, and I had my first serious inquiry within a week.",
    author: "Marco Chen",
    role: "Sustainability Engineer",
    avatar: "https://i.pravatar.cc/80?u=marco-chen",
    stars: 5,
  },
  {
    quote:
      "As an investor, EcoValut is my go-to source for verified, quality-checked eco-innovation. The signal-to-noise ratio is exceptional.",
    author: "Sara Okonkwo",
    role: "Impact Investor",
    avatar: "https://i.pravatar.cc/80?u=sara-okonkwo",
    stars: 5,
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: "ach_1",
    name: "First Idea",
    description: "Submit your first idea to EcoValut",
    icon: "Lightbulb",
    earnedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "ach_2",
    name: "Trending Innovator",
    description: "Have an idea reach top trending score",
    icon: "TrendingUp",
    earnedAt: "2026-02-14T10:00:00Z",
  },
  {
    id: "ach_3",
    name: "Community Builder",
    description: "Gain 100 followers on your profile",
    icon: "Users",
    earnedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "ach_4",
    name: "Eco Champion",
    description: "Get 200 total upvotes across all ideas",
    icon: "Award",
    earnedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "ach_5",
    name: "Prolific Creator",
    description: "Submit 10 ideas to the platform",
    icon: "Star",
    isLocked: true,
  },
  {
    id: "ach_6",
    name: "Top Contributor",
    description: "Be featured in the weekly newsletter",
    icon: "Crown",
    isLocked: true,
  },
  {
    id: "ach_7",
    name: "Visionary",
    description: "Have 3 ideas approved in a month",
    icon: "Eye",
    isLocked: true,
  },
  {
    id: "ach_8",
    name: "Collaborator",
    description: "Receive comments from 50 unique users",
    icon: "MessageSquare",
    isLocked: true,
  },
];

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    tier: "FREE",
    price: 0,
    durationDays: 0,
    description: "For individuals just starting out",
    features: [
      "Browse all public ideas",
      "Submit up to 2 ideas/month",
      "Basic analytics",
      "Community access",
      "Email support",
    ],
  },
  {
    id: "plan_pro",
    name: "Pro",
    tier: "PRO",
    price: 19.99,
    durationDays: 30,
    description: "For serious eco-innovators",
    isPopular: true,
    features: [
      "Everything in Free",
      "Unlimited idea submissions",
      "Access to paid ideas (up to 5/month)",
      "Advanced analytics dashboard",
      "Priority review queue",
      "Featured placement eligibility",
      "Priority support",
    ],
  },
  {
    id: "plan_premium",
    name: "Premium",
    tier: "PREMIUM",
    price: 49.99,
    durationDays: 30,
    description: "For organizations and power users",
    features: [
      "Everything in Pro",
      "Unlimited paid idea access",
      "API access",
      "White-label reports",
      "Dedicated account manager",
      "Custom integrations",
      "SLA support",
    ],
  },
];
