import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123", 12);

  await prisma.user.upsert({
    where: { email: "admin@krakenfall.com" },
    update: {},
    create: {
      name: "Harbor Master",
      email: "admin@krakenfall.com",
      role: "SUPER_ADMIN",
      passwordHash: password,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const crew = [
    { name: "Captain Sable Voss", title: "Keeper of the Broken Compass", bio: "Lost her shadow to a storm-fruit and gained the sea's memory in exchange.", order: 1 },
    { name: "Old Tallow", title: "Quartermaster & Cartographer", bio: "Draws maps of places that haven't been discovered yet — and is usually right.", order: 2 },
    { name: "Ren Iska", title: "First Mate", bio: "Speaks to the ship's timbers and swears they answer back before every storm.", order: 3 },
    { name: "The Cinder Twins", title: "Powder & Fire", bio: "Two gunners who've never been seen apart, or seen to miss a shot.", order: 4 },
  ];
  for (const c of crew) {
    const existing = await prisma.crewMember.findFirst({ where: { name: c.name } });
    if (!existing) await prisma.crewMember.create({ data: c });
  }

  const fruits = [
    { name: "The Tideglass Fruit", category: "Element", description: "Turns the eater's blood to seawater — deadly on land, nearly invincible below the waves.", powerLevel: 4, order: 1 },
    { name: "The Hollow Lantern Fruit", category: "Mind", description: "Lets the eater borrow a stranger's last memory, for a price only the fruit decides.", powerLevel: 3, order: 2 },
    { name: "The Anchorbone Fruit", category: "Body", description: "Grants unbreakable bones — and a permanent, bone-deep fear of open water.", powerLevel: 2, order: 3 },
  ];
  for (const f of fruits) {
    const existing = await prisma.devilFruit.findFirst({ where: { name: f.name } });
    if (!existing) await prisma.devilFruit.create({ data: f });
  }

  const chapters = [
    { title: "The Wake of Saltmere", location: "Saltmere Reach", summary: "Where the crew first crossed the reef that swallows ships whole — and found one that hadn't quite finished sinking.", order: 1 },
    { title: "The Ashwind Ledger", location: "Ashwind Isles", summary: "A trade of secrets with a merchant who remembers everything and forgets nothing, for a price.", order: 2 },
    { title: "The Fall Itself", location: "The Krakenfall Trench", summary: "The edge of the charted sea, where the water falls into dark no lantern has ever lit.", order: 3 },
  ];
  for (const c of chapters) {
    const existing = await prisma.journeyChapter.findFirst({ where: { title: c.title } });
    if (!existing) await prisma.journeyChapter.create({ data: c });
  }

  const treasures = [
    { name: "The Drowned King's Signet", description: "A ring that hums faintly near deep water.", rarity: "legendary", order: 1 },
    { name: "Tallow's Uncharted Map", description: "Shows three routes that don't exist yet.", rarity: "rare", order: 2 },
    { name: "A Jar of Bottled Squall", description: "Contains one very small, very angry storm.", rarity: "rare", order: 3 },
    { name: "Ordinary Ship's Biscuit", description: "Somehow still edible after eleven years.", rarity: "common", order: 4 },
  ];
  for (const t of treasures) {
    const existing = await prisma.treasureItem.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.treasureItem.create({ data: t });
  }

  const timeline = [
    { year: "Year 1", title: "The Ship is Won, Not Bought", description: "Sable Voss claims the Fallen Tide in a wager she still won't explain.", order: 1 },
    { year: "Year 3", title: "First Sight of the Trench", description: "The crew glimpses the Krakenfall Trench from a safe, sane distance.", order: 2 },
    { year: "Year 7", title: "The Ledger is Signed", description: "A pact is struck at Ashwind that will matter far more than anyone realizes yet.", order: 3 },
  ];
  for (const t of timeline) {
    const existing = await prisma.timelineEvent.findFirst({ where: { title: t.title } });
    if (!existing) await prisma.timelineEvent.create({ data: t });
  }

  const seo = await prisma.seoMeta.findUnique({ where: { path: "/" } });
  if (!seo) {
    await prisma.seoMeta.create({
      data: {
        path: "/",
        title: "Krakenfall — An Original Pirate Fantasy",
        description: "An original fictional pirate-fantasy universe of storm-bound seas and forbidden fruits.",
        keywords: ["pirate fantasy", "original fiction", "krakenfall"],
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Admin login: admin@krakenfall.com / Password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
