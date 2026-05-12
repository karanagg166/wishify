import "dotenv/config";
import { PrismaClient, Tier } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ──────────────────────────────────────────────────────────
  const birthday = await prisma.category.upsert({
    where: { slug: "birthday" },
    update: {},
    create: { slug: "birthday", label: "Birthday", icon: "🎂", sortOrder: 1 },
  });

  const anniversary = await prisma.category.upsert({
    where: { slug: "anniversary" },
    update: {},
    create: { slug: "anniversary", label: "Anniversary", icon: "💍", sortOrder: 2 },
  });

  const festival = await prisma.category.upsert({
    where: { slug: "festival" },
    update: {},
    create: { slug: "festival", label: "Festival", icon: "🎉", sortOrder: 3 },
  });

  const shayari = await prisma.category.upsert({
    where: { slug: "shayari" },
    update: {},
    create: { slug: "shayari", label: "Shayari", icon: "✍️", sortOrder: 4 },
  });

  const joke = await prisma.category.upsert({
    where: { slug: "joke" },
    update: {},
    create: { slug: "joke", label: "Joke", icon: "😂", sortOrder: 5 },
  });

  const love = await prisma.category.upsert({
    where: { slug: "love" },
    update: {},
    create: { slug: "love", label: "Love", icon: "❤️", sortOrder: 6 },
  });

  // ── Templates ───────────────────────────────────────────────────────────
  const templates = [
    // Birthday
    {
      title: "Sunset Birthday",
      imageUrl: "/templates/birthday-1.png",
      thumbUrl: "/templates/birthday-1.png",
      tier: Tier.FREE,
      categoryId: birthday.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 400, nameAnchor: "center",
        avatarX: 155, avatarY: 20, avatarSize: 80,
        fontSize: 22, textColor: "#ffffff", fontFamily: "Inter, sans-serif",
      },
    },
    {
      title: "Balloon Party",
      imageUrl: "/templates/birthday-2.png",
      thumbUrl: "/templates/birthday-2.png",
      tier: Tier.PREMIUM,
      categoryId: birthday.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 420, nameAnchor: "center",
        avatarX: 155, avatarY: 30, avatarSize: 90,
        fontSize: 20, textColor: "#1a1a1a", fontFamily: "Inter, sans-serif",
      },
    },
    // Anniversary
    {
      title: "Rose Gold",
      imageUrl: "/templates/anniversary-1.png",
      thumbUrl: "/templates/anniversary-1.png",
      tier: Tier.FREE,
      categoryId: anniversary.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 430, nameAnchor: "center",
        avatarX: 155, avatarY: 25, avatarSize: 85,
        fontSize: 18, textColor: "#ffffff", fontFamily: "Georgia, serif",
      },
    },
    {
      title: "Forever Yours",
      imageUrl: "/templates/anniversary-2.png",
      thumbUrl: "/templates/anniversary-2.png",
      tier: Tier.PREMIUM,
      categoryId: anniversary.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 410, nameAnchor: "center",
        avatarX: 160, avatarY: 20, avatarSize: 80,
        fontSize: 20, textColor: "#2d1810", fontFamily: "Georgia, serif",
      },
    },
    // Festival
    {
      title: "Diwali Glow",
      imageUrl: "/templates/festival-diwali.png",
      thumbUrl: "/templates/festival-diwali.png",
      tier: Tier.FREE,
      categoryId: festival.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 440, nameAnchor: "center",
        avatarX: 155, avatarY: 15, avatarSize: 75,
        fontSize: 18, textColor: "#ffd700", fontFamily: "Inter, sans-serif",
      },
    },
    {
      title: "Holi Splash",
      imageUrl: "/templates/festival-holi.png",
      thumbUrl: "/templates/festival-holi.png",
      tier: Tier.FREE,
      categoryId: festival.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 430, nameAnchor: "center",
        avatarX: 155, avatarY: 25, avatarSize: 80,
        fontSize: 20, textColor: "#ffffff", fontFamily: "Inter, sans-serif",
      },
    },
    // Shayari
    {
      title: "Moonlit Words",
      imageUrl: "/templates/shayari-1.png",
      thumbUrl: "/templates/shayari-1.png",
      tier: Tier.FREE,
      categoryId: shayari.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 450, nameAnchor: "center",
        avatarX: 155, avatarY: 10, avatarSize: 70,
        fontSize: 16, textColor: "#d4af37", fontFamily: "Georgia, serif",
      },
    },
    {
      title: "Ink & Roses",
      imageUrl: "/templates/shayari-2.png",
      thumbUrl: "/templates/shayari-2.png",
      tier: Tier.PREMIUM,
      categoryId: shayari.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 440, nameAnchor: "center",
        avatarX: 155, avatarY: 20, avatarSize: 80,
        fontSize: 18, textColor: "#ffffff", fontFamily: "Georgia, serif",
      },
    },
    // Joke
    {
      title: "Laugh Out Loud",
      imageUrl: "/templates/joke-1.png",
      thumbUrl: "/templates/joke-1.png",
      tier: Tier.FREE,
      categoryId: joke.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 440, nameAnchor: "center",
        avatarX: 155, avatarY: 25, avatarSize: 80,
        fontSize: 20, textColor: "#1a1a1a", fontFamily: "Inter, sans-serif",
      },
    },
    {
      title: "Meme Magic",
      imageUrl: "/templates/joke-2.png",
      thumbUrl: "/templates/joke-2.png",
      tier: Tier.PREMIUM,
      categoryId: joke.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 430, nameAnchor: "center",
        avatarX: 155, avatarY: 20, avatarSize: 80,
        fontSize: 18, textColor: "#2d3748", fontFamily: "Inter, sans-serif",
      },
    },
    // Love
    {
      title: "Red Hearts",
      imageUrl: "/templates/love-1.png",
      thumbUrl: "/templates/love-1.png",
      tier: Tier.FREE,
      categoryId: love.id,
      sortOrder: 1,
      overlayConfig: {
        nameX: 200, nameY: 440, nameAnchor: "center",
        avatarX: 155, avatarY: 20, avatarSize: 85,
        fontSize: 20, textColor: "#ffffff", fontFamily: "Georgia, serif",
      },
    },
    {
      title: "Valentine Dream",
      imageUrl: "/templates/love-2.png",
      thumbUrl: "/templates/love-2.png",
      tier: Tier.PREMIUM,
      categoryId: love.id,
      sortOrder: 2,
      overlayConfig: {
        nameX: 200, nameY: 430, nameAnchor: "center",
        avatarX: 160, avatarY: 15, avatarSize: 80,
        fontSize: 18, textColor: "#5b2333", fontFamily: "Georgia, serif",
      },
    },
  ];

  for (const t of templates) {
    const seedId = `seed-${t.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    await prisma.template.upsert({
      where: { id: seedId },
      update: {
        imageUrl: t.imageUrl,
        thumbUrl: t.thumbUrl,
        overlayConfig: t.overlayConfig,
      },
      create: {
        id: seedId,
        title: t.title,
        imageUrl: t.imageUrl,
        thumbUrl: t.thumbUrl,
        tier: t.tier,
        categoryId: t.categoryId,
        sortOrder: t.sortOrder,
        overlayConfig: t.overlayConfig,
      },
    });
  }

  console.log(`✅ Seeded ${templates.length} templates across 6 categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
