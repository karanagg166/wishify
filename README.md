# ✨ Wishify - Custom Greetings & Wishes App

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Neon Postgres](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**Wishify** is a modern, responsive web application that allows users to create and share personalized greeting cards and wishes. Select beautiful background templates, automatically overlay your profile picture and name, and share your customized creations directly to social media!

![Wishify Preview](./public/favicon.ico) <!-- Placeholder for actual preview image -->

---

## 🌟 Key Features

*   **🔐 Seamless Authentication**: Login effortlessly with Google or continue as a Guest. Powered by [Better Auth](https://better-auth.com/).
*   **🎨 Dynamic Canvas Editor**: Real-time card customization using Fabric.js. Your name and profile picture are beautifully integrated into the template.
*   **📂 Categorized Templates**: Browse through curated collections (Birthdays, Anniversaries, Festivals, etc.) with a stunning masonry grid layout.
*   **🚀 One-Click Sharing**: Share your creations directly via native OS share sheets or download them directly. 
*   **💎 Premium Gating**: Exclusive "Pro" templates available via a seamless premium upgrade flow.
*   **✨ Micro-Interactions**: Smooth animations powered by Anime.js and Framer Motion for a premium feel.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Anime.js, Fabric.js
*   **Backend**: Next.js API Routes, Prisma 7 ORM
*   **Database**: Neon (Serverless PostgreSQL)
*   **Authentication**: Better Auth (Google OAuth & Anonymous)
*   **Storage**: Cloudinary (for user uploads and rendered cards)
*   **Language**: TypeScript (Strict Mode)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

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
*(Refer to `env_setup_guide.md` in the repository for detailed instructions on acquiring API keys for Neon, Google OAuth, and Cloudinary).*

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

## 🐳 Docker Deployment (Optional)

Wishify comes with a production-ready `Dockerfile` and `docker-compose.yml`.
```bash
docker compose up --build
```

---

## 🏗️ Project Structure

```text
src/
├── app/          # Next.js App Router (Pages & API Routes)
├── components/   # Reusable UI components & features (Canvas, Auth, etc.)
├── constants/    # App configurations, routes, and categories
├── context/      # React Contexts (Auth, Template, Premium)
├── lib/          # Utilities, Prisma client, Cloudinary, Anime.js effects
└── types/        # TypeScript interfaces and types
prisma/           # Database schema and seed scripts
```

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.
