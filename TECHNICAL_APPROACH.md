# 📄 Wishify — Technical Approach Document

## 1. Problem-Solving Approach

### 1.1 Image Overlay Logic

The core challenge of Wishify is merging a user's profile picture and name onto background template images dynamically, both for **preview** and for **high-quality export**.

**Solution: Fabric.js Canvas Rendering**

We use [Fabric.js](http://fabricjs.com/) — a powerful HTML5 Canvas library — to compose multiple layers on a single `<canvas>` element:

1. **Background Layer**: The template image (e.g., a birthday card) is loaded as a `FabricImage` and scaled to fill the canvas.
2. **Name Banner**: A semi-transparent dark `Rect` is drawn at the top of the card, with the user's name rendered as white `FabricText` centered inside it.
3. **Avatar Layer**: The user's profile picture is loaded as a `FabricImage`, clipped to a circle using Fabric.js's `clipPath` property (`Circle`), and placed at the top-left with a green circular border behind it.

**Preview vs Export**:
- **Preview** (TemplateCard grid): Renders at 200×250px (half resolution) for performance. Lazy-loaded via `IntersectionObserver` to avoid initializing Fabric canvases for off-screen cards.
- **Full Editor** (CardEditorClient): Renders at 400×500px for real-time preview.
- **Export** (ShareSheet): Renders at 800×1000px (2× resolution) for high-quality sharing on social media.

```
┌─────────────────────────────┐
│  ████ Name Banner ████████  │  ← Semi-transparent black rect + white text
│ ┌───┐                      │
│ │ 📷│  Template Background  │  ← Avatar with green circle border
│ └───┘                      │
│                             │
│     Template Content        │
│                             │
└─────────────────────────────┘
```

### 1.2 Authentication Strategy

We use [Better Auth](https://better-auth.com/) for authentication, supporting:
- **Google OAuth 2.0**: Primary login method with full profile data (name, email, avatar).
- **Anonymous (Guest)**: Allows users to try the app without creating an account. Better Auth's `anonymous()` plugin creates a temporary session.

Guest users are prompted with a `ProfileSetupSheet` bottom sheet to enter their name and upload a profile photo on first visit. This data is persisted via the `/api/auth/update-profile` endpoint and immediately reflected in all canvas renders.

### 1.3 Sharing Flow

The sharing pipeline follows these steps:

1. **Render**: Fabric.js composites all layers (background + name banner + avatar) into a single JPEG via `canvas.toDataURL()`.
2. **Export as Blob**: The data URL is converted to a `Blob` for file sharing.
3. **Platform Selection**: 
   - **Native Share API** (`navigator.share()`): Used when available (mobile browsers), allowing direct sharing to WhatsApp, Instagram, Email, etc.
   - **WhatsApp fallback**: Opens `wa.me` with a pre-filled message.
   - **Email fallback**: Opens `mailto:` link.
   - **Download fallback**: Triggers a file download for desktop browsers.
4. **Analytics**: Each share action records a `Share` entry in the database with the platform used.

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.2.6 | Server-side rendering, API routes, file-based routing |
| **UI Library** | React | 19.2.4 | Component-based UI |
| **Language** | TypeScript | 5.x | Type safety across the entire stack |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS with custom design tokens |
| **Canvas** | Fabric.js | 7.3.1 | Canvas composition for image overlay (name + avatar) |
| **Animation** | Motion (Framer Motion) | 12.38.0 | Page transitions, modal animations |
| **Animation** | Anime.js | 4.4.1 | Particle effects on share, card stagger animations |
| **Auth** | Better Auth | 1.6.10 | Google OAuth, anonymous sessions |
| **ORM** | Prisma | 7.8.0 | Type-safe database queries |
| **Database** | Neon (PostgreSQL) | — | Serverless PostgreSQL with connection pooling |
| **Storage** | Cloudinary | 2.10.0 | Image hosting for user avatars and rendered cards |
| **Icons** | Lucide React | 1.14.0 | Icon set |
| **Container** | Docker | — | Production deployment |

### Why these choices?

- **Fabric.js** over raw Canvas API: Provides object-based layering, easy clipping paths for circular avatars, and `toDataURL()` export — saving hundreds of lines of manual canvas code.
- **Better Auth** over NextAuth/Clerk: Lightweight, self-hosted, zero vendor lock-in. The anonymous login plugin is critical for guest access.
- **Neon** over local PostgreSQL: Serverless scaling, zero-config, free tier for development.
- **Cloudinary** over S3: Built-in image transformations, automatic format optimization, generous free tier.

---

## 3. Challenges & Solutions

### Challenge 1: Canvas Performance with Many Templates
**Problem**: Initializing a Fabric.js canvas for every template card in the grid was causing significant lag with 12+ cards.

**Solution**: Implemented lazy initialization using `IntersectionObserver`. Each `TemplateCard` only creates its Fabric canvas when it enters the viewport (with a 100px margin for preloading). Cards use a shimmer skeleton loader until the canvas is ready.

### Challenge 2: Cross-Origin Image Loading
**Problem**: Fabric.js requires `crossOrigin: "anonymous"` for all images to enable `toDataURL()` export. Google profile pictures and Cloudinary images have CORS restrictions.

**Solution**: Configured Next.js `remotePatterns` in `next.config.ts` to allow `res.cloudinary.com` and `lh3.googleusercontent.com`. All `FabricImage.fromURL` calls include `crossOrigin: "anonymous"`.

### Challenge 3: Share API Compatibility
**Problem**: The Web Share API (`navigator.share()`) is only available on mobile browsers and some desktop browsers. File sharing support is even more limited.

**Solution**: Implemented a progressive fallback chain:
1. Check `navigator.canShare({ files })` for native file sharing
2. Fall back to platform-specific deep links (WhatsApp `wa.me://`, Email `mailto:`)
3. Ultimate fallback: trigger a direct file download

### Challenge 4: Docker Build with Prisma + Neon
**Problem**: Prisma's serverless adapter for Neon requires OpenSSL at runtime, and the `prisma generate` step needs access to the schema during Docker build.

**Solution**: Multi-stage Dockerfile:
- **deps stage**: Installs dependencies and copies `prisma/` for schema access
- **builder stage**: Generates Prisma client, runs `next build` with all env vars as build args
- **runner stage**: Minimal Alpine image with OpenSSL, only copies the standalone output

### Challenge 5: Premium Content Gating
**Problem**: Need to show premium template previews (to entice users) while preventing access to the full editor.

**Solution**: Premium templates render normally in the grid with a translucent overlay + lock icon + "PRO" badge. Clicking triggers a `PremiumPopup` via React Context instead of navigating to the editor. The context pattern allows the popup to be triggered from any component without prop drilling.

---

## 4. Future Improvements

### 4.1 Scalability
- **CDN-hosted templates**: Move template images from `/public/templates/` to Cloudinary with automatic format/quality optimization.
- **Database indexing**: Add composite indexes on `(categoryId, sortOrder)` and `(userId, createdAt)` for faster queries at scale.
- **Edge caching**: Add `Cache-Control` headers to the templates API endpoint for CDN caching.
- **Image lazy loading**: Implement virtual scrolling for the template grid when the catalog grows beyond 100+ templates.

### 4.2 Features
- **Email/Password authentication**: Currently supports Google and Guest only. Adding email/password via Better Auth's email plugin.
- **Template customization**: Allow users to adjust text position, font, and color.
- **Payment integration**: Wire up the premium subscription flow with Razorpay or Stripe.
- **Template upload**: Allow administrators to upload new templates via a dashboard.
- **Share history**: Show users their past shared cards with re-share capability.
- **PWA support**: Add service worker and manifest for installable mobile experience.

### 4.3 Performance
- **Canvas rendering workers**: Offload Fabric.js rendering to Web Workers to avoid main thread blocking.
- **Progressive loading**: Load low-resolution thumbnails first, then swap to full-resolution when the card is tapped.
- **Bundle optimization**: Fabric.js is ~300KB — investigate tree-shaking or switching to a lighter canvas wrapper for preview-only cards.

### 4.4 Testing
- **E2E tests**: Playwright tests covering Login → Home → Premium → Share flow.
- **Unit tests**: Vitest for utility functions and API route handlers.
- **Visual regression**: Screenshot testing for canvas overlay positioning.

---

## 5. Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     Client (Browser)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Login   │→ │   Home   │→ │  Card    │→ │  Share   │ │
│  │  Page    │  │   Page   │  │  Editor  │  │  Sheet   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│        │             │              │             │       │
│   Better Auth    Templates API   Prisma DB     Share API │
│   (Google/Guest)     ↓              ↓             ↓      │
│        ↓        ┌────────────────────────────────────┐   │
│        ↓        │         Next.js API Routes         │   │
│        ↓        │  /api/auth  /api/templates         │   │
│        ↓        │  /api/upload  /api/shares          │   │
│        ↓        └────────────────────────────────────┘   │
│        ↓                       │                         │
└────────│───────────────────────│─────────────────────────┘
         │                       │
    ┌────▼────┐            ┌─────▼─────┐        ┌──────────┐
    │  Better │            │  Prisma   │────────│   Neon   │
    │  Auth   │            │   ORM     │        │ Postgres │
    └─────────┘            └───────────┘        └──────────┘
                                │
                          ┌─────▼─────┐
                          │Cloudinary │
                          │ (Images)  │
                          └───────────┘
```
