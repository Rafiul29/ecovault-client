# EcoVault
An online community portal for sharing and discovering sustainable environmental ideas.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Installation & Setup](#installation--setup)
- [Folder Structure](#folder-structure)
- [License](#license)
- [Contact](#contact)

---

## About the Project 
EcoVault is an online community portal where members can share sustainably-oriented ideas (reducing plastic consumption or launching a solar power project) to help the environment. The platform allows users to submit, discuss, and vote on ideas, while admins review submissions to highlight the best high-impact projects.

---

## Project Overview  
EcoVault is an online community portal designed to foster environmental action. The platform is structured around three core roles: **Admins** who oversee users and moderate content, **Moderators** who subscribe to a plan to create and share sustainability ideas, and **Members** who explore ideas, engage in discussions, and purchase premium content. To enhance the user experience, the platform integrates an AI-powered assistant (RAG) that allows users to ask basic or detailed questions and get intelligent answers about shared ideas and platform features.

---

## Key Features  
- **AI-Powered Assistant (RAG)** — An intelligent chatbot assistant built using Retrieval-Augmented Generation (RAG) and pgvector embeddings. It allows users to ask basic-to-detailed questions about specific sustainability ideas, platform features, and community guidelines.
- **Admin Dashboard & Management** — Full control over member accounts (activate/deactivate, role management) and idea listings. Admins review submissions (Under Review, Approved, Rejected) and can provide feedback on rejected ideas.
- **Moderator Dashboard & Idea Creation** — Moderators must subscribe to a plan to share sustainability ideas. They can draft ideas, submit them for review, and edit/delete unpublished submissions.
- **Member Access & Engagement** — Members can browse free ideas, purchase access to premium paid ideas, and engage with the community.
- **Voting & Community Discussion** — Reddit-style voting system (upvote/downvote) and nested commenting for discussions.
- **Authentication & Security** — JWT-based secure authentication with distinct, personalized dashboards for Admins, Moderators, and Members.

---

## Tech Stack  
**Frontend:** Next.js · React.js · Tailwind CSS · TypeScript  
**Backend:** Node.js · Express.js · Prisma  
**Database:** PostgreSQL (with pgvector for AI Embeddings)  
**Tools:** Git · Vercel · JWT · RAG Architecture

---

## Dependencies  
List of required major dependencies for the client:

```json
{
  "next": "16.2.1",
  "react": "19.2.4",
  "tailwindcss": "^4",
  "@tanstack/react-query": "^5.95.2",
  "framer-motion": "^12.38.0",
  "zod": "^4.3.6",
  "lucide-react": "^1.7.0"
}
```

---

## Installation & Setup
1. Clone the repo and install dependencies:

```bash
git clone https://github.com/Rafiul29/ecovault-client.git
cd ecovault-client
npm install
```

2. Set up environment variables by creating a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
# Production URL
# NEXT_PUBLIC_API_BASE_URL=https://ecovault-server.vercel.app/api/v1

JWT_ACCESS_SECRET=accesssecret
```

3. Run the application:

```bash
npm run dev
```

---

## Folder Structure

```plaintext
ecovault-client/
│
├── app/                  # Next.js App Router
│   ├── (commonLayout)/   # Public-facing routes and layouts
│   ├── (dashboardLayout)/# Authenticated dashboard routes
│   └── _actions/         # Server Actions for data mutation
│
├── components/           # Reusable React components
│   ├── ideas/            # Idea-specific components (cards, lists)
│   ├── landing/          # Landing page sections (hero, features)
│   ├── modules/          # Complex feature-based modules
│   ├── search/           # Search and filter components
│   ├── shared/           # Global shared UI (Navbar, Footer, Sidebar)
│   └── ui/               # Base UI components (e.g., Shadcn UI)
│
├── hooks/                # Custom React hooks for data/state management
│
├── lib/                  # Utility functions and configurations
│   ├── axios/            # Axios instance and interceptors
│   └── ...               # Auth, JWT, cookie, and generic utilities
│
├── providers/            # React context providers (Theme, QueryClient)
│
├── public/               # Static assets (images, fonts, icons)
│
├── services/             # API service layer for backend communication
│   ├── auth.service.ts   # Authentication APIs
│   ├── idea.service.ts   # Idea-related APIs
│   └── ...               # Other modular API calls (payment, comments, etc.)
│
├── types/                # Global TypeScript interfaces and definitions
│
├── zod/                  # Zod validation schemas for forms and APIs
│
└── package.json          # Project metadata, scripts, and dependencies
```

---

## License
Distributed under the MIT License.

---

## Contact

- Live Frontend URL:** [EcoVault Client](https://ecovault-client.vercel.app)
- Live Backend API URL:** [EcoVault Server API](https://ecovault-server.vercel.app/api/v1)
- Frontend Repository:** [GitHub - ecovault-client](https://github.com/Rafiul29/ecovault-client)
- Backend Repository:** [GitHub - ecovault-server](https://github.com/Rafiul29/ecovault-server)