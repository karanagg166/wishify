# ✨ Wishify - Custom Greetings & Wishes App

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Neon Postgres](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Wishify** is a modern, responsive web application that allows users to create and share personalized greeting cards and wishes. Select beautiful background templates, automatically overlay your profile picture and name, and share your customized creations directly to social media!

---

## 🌟 Key Features

*   **🔐 Seamless Authentication**: Login effortlessly with Google or continue as a Guest. Powered by [Better Auth](https://better-auth.com/).
*   **🎨 Dynamic Canvas Editor**: Real-time card customization using Fabric.js. Your name and profile picture are beautifully integrated into the template.
*   **📂 Categorized Templates**: Browse through curated collections (Birthdays, Anniversaries, Festivals, Shayari, Jokes, Love) with a "More" dropdown for overflow.
*   **🔥 Trending Section**: "Trending for Today" section highlights popular templates.
*   **🖼️ Live Preview**: Every template card in the grid shows your name and photo overlaid — see personalization before selecting.
*   **🚀 One-Click Sharing**: Share your creations via WhatsApp, Instagram, Email, or download directly.
*   **💎 Premium Gating**: Exclusive "Pro" templates available via a seamless premium upgrade flow.
*   **✨ Micro-Interactions**: Smooth animations powered by Anime.js and Motion for a premium feel.
*   **👤 Profile Setup**: Capture user name and profile picture on first visit for automatic personalization.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server-side rendering, API routes |
| **UI** | React 19, Tailwind CSS v4 | Component UI & styling |
| **Canvas** | Fabric.js 7 | Image overlay composition |
| **Animation** | Motion 12 (Framer Motion), Anime.js 4 | Page transitions, particle effects |
| **Auth** | Better Auth 1.6 | Google OAuth & anonymous sessions |
| **ORM** | Prisma 7 | Type-safe database access |
| **Database** | Neon (PostgreSQL) | Serverless PostgreSQL |
| **Storage** | Cloudinary | Image hosting (avatars, shares) |
| **Language** | TypeScript (Strict) | End-to-end type safety |
| **Deploy** | Docker | Containerized deployment |

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- **Node.js** 22+ 
- **pnpm** 10+ (`corepack enable`)
- A **Neon** database (free tier)
- **Google Cloud** OAuth 2.0 credentials
- A **Cloudinary** account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/karanagg166/wishify.git
cd wishify
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up Environment Variables
Copy the `.env.example` file to `.env` and fill in the required credentials:
```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret for session encryption |
| `BETTER_AUTH_URL` | Auth endpoint URL (e.g., `http://localhost:3000/api/auth`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g., `http://localhost:3000`) |

### 4. Database Setup
Push the schema to your Neon database and seed the initial templates:
```bash
pnpm db:push
pnpm db:seed
```

### 5. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

Wishify comes with a production-ready `Dockerfile` and `docker-compose.yml`.

```bash
# Build and run
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📱 App Flow

```
Login Page  →  Home Page  →  Card Editor  →  Share Sheet
    │              │              │              │
    ├─ Google      ├─ Categories  ├─ Canvas      ├─ WhatsApp
    ├─ Guest       ├─ Grid View   ├─ Preview     ├─ Instagram
    └─ Profile     ├─ Trending    ├─ Name+Photo  ├─ Email
       Setup       └─ Premium     └─ PRO Badge   ├─ Download
                      Popup                      └─ Copy Link
```

---

## 🏗️ Project Structure

```text
src/
├── app/              # Next.js App Router
│   ├── (app)/        # Authenticated routes (home, card editor)
│   ├── (auth)/       # Auth routes (login)
│   └── api/          # API routes (auth, templates, shares, upload)
├── components/       # Reusable UI components
│   ├── features/     # Auth, Canvas, Premium components
│   ├── home/         # Home page components (CategoryBar, TemplateCard, etc.)
│   └── share/        # ShareSheet component
├── constants/        # App configurations, routes, categories
├── context/          # React Contexts (Auth, Template, Premium)
├── lib/              # Utilities, Prisma client, Cloudinary, animations
└── types/            # TypeScript interfaces and types
prisma/               # Database schema and seed scripts
```

---

## 📄 Documentation

- **[TECHNICAL_APPROACH.md](./TECHNICAL_APPROACH.md)** — Detailed technical document covering image overlay logic, challenges, and architecture.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.
