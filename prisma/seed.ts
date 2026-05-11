import { PrismaClient, Tier } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_OVERLAY = {
  nameX: 200,
  nameY: 420,
  nameAnchor: "center",
  avatarX: 155,
  avatarY: 30,
  avatarSize: 90,
  fontSize: 20,
  textColor: "#1a1a1a",
  fontFamily: "Inter, sans-serif",
};

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
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

  // Templates (using placeholder images from /public)
  const templates = [
    // Birthday
    { title: "Sunset Birthday", imageUrl: "/images/templates/birthday-1.jpg", thumbUrl: "/images/templates/birthday-1.jpg", tier: Tier.FREE, categoryId: birthday.id, sortOrder: 1 },
    { title: "Balloon Party", imageUrl: "/images/templates/birthday-2.jpg", thumbUrl: "/images/templates/birthday-2.jpg", tier: Tier.FREE, categoryId: birthday.id, sortOrder: 2 },
    { title: "Golden Wishes", imageUrl: "/images/templates/birthday-3.jpg", thumbUrl: "/images/templates/birthday-3.jpg", tier: Tier.PREMIUM, categoryId: birthday.id, sortOrder: 3 },
    // Anniversary
    { title: "Rose Gold", imageUrl: "/images/templates/anniversary-1.jpg", thumbUrl: "/images/templates/anniversary-1.jpg", tier: Tier.FREE, categoryId: anniversary.id, sortOrder: 1 },
    { title: "Forever Yours", imageUrl: "/images/templates/anniversary-2.jpg", thumbUrl: "/images/templates/anniversary-2.jpg", tier: Tier.PREMIUM, categoryId: anniversary.id, sortOrder: 2 },
    // Festival
    { title: "Diwali Glow", imageUrl: "/images/templates/festival-1.jpg", thumbUrl: "/images/templates/festival-1.jpg", tier: Tier.FREE, categoryId: festival.id, sortOrder: 1 },
    { title: "Holi Splash", imageUrl: "/images/templates/festival-2.jpg", thumbUrl: "/images/templates/festival-2.jpg", tier: Tier.FREE, categoryId: festival.id, sortOrder: 2 },
    { title: "Eid Mubarak", imageUrl: "/images/templates/festival-3.jpg", thumbUrl: "/images/templates/festival-3.jpg", tier: Tier.PREMIUM, categoryId: festival.id, sortOrder: 3 },
    // Shayari
    { title: "Moonlit Words", imageUrl: "/images/templates/shayari-1.jpg", thumbUrl: "/images/templates/shayari-1.jpg", tier: Tier.FREE, categoryId: shayari.id, sortOrder: 1 },
    { title: "Ink & Roses", imageUrl: "/images/templates/shayari-2.jpg", thumbUrl: "/images/templates/shayari-2.jpg", tier: Tier.PREMIUM, categoryId: shayari.id, sortOrder: 2 },
    // Joke
    { title: "Laugh Out Loud", imageUrl: "/images/templates/joke-1.jpg", thumbUrl: "/images/templates/joke-1.jpg", tier: Tier.FREE, categoryId: joke.id, sortOrder: 1 },
    { title: "Meme Magic", imageUrl: "/images/templates/joke-2.jpg", thumbUrl: "/images/templates/joke-2.jpg", tier: Tier.PREMIUM, categoryId: joke.id, sortOrder: 2 },
    // Love
    { title: "Red Hearts", imageUrl: "/images/templates/love-1.jpg", thumbUrl: "/images/templates/love-1.jpg", tier: Tier.FREE, categoryId: love.id, sortOrder: 1 },
    { title: "Valentine Dream", imageUrl: "/images/templates/love-2.jpg", thumbUrl: "/images/templates/love-2.jpg", tier: Tier.PREMIUM, categoryId: love.id, sortOrder: 2 },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: `seed-${t.title.toLowerCase().replace(/\s/g, "-")}` },
      update: {},
      create: { ...t, id: `seed-${t.title.toLowerCase().replace(/\s/g, "-")}`, overlayConfig: DEFAULT_OVERLAY },
    });
  }

  console.log(`✅ Seeded ${templates.length} templates across 6 categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
