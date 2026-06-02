const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = "postgresql://neondb_owner:npg_Jv0LuEenOjz1@ep-wispy-credit-aoqkmld3.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log("No users found. Please register a user first.");
    return;
  }

  for (const user of users) {
    console.log(`Seeding quests for user: ${user.email}`);
    
    // Clear existing quests for a fresh start
    await prisma.quest.deleteMany({ where: { userId: user.id } });

    await prisma.quest.createMany({
      data: [
        {
          title: "Morning Cyber-Workout",
          description: "High intensity training to boost physical stats.",
          type: "Daily Quest",
          rarity: "rare",
          xp: 75,
          userId: user.id,
          completed: false,
        },
        {
          title: "Advanced Neural Coding",
          description: "Focus on complex algorithm implementation.",
          type: "Side Quest",
          rarity: "epic",
          xp: 150,
          userId: user.id,
          completed: false,
        },
        {
          title: "Hydration Protocol",
          description: "Consume 2L of water to maintain peak performance.",
          type: "Daily Quest",
          rarity: "common",
          xp: 20,
          userId: user.id,
          completed: true,
        },
        {
          title: "System Documentation",
          description: "Write clear technical docs for the new module.",
          type: "Side Quest",
          rarity: "common",
          xp: 50,
          userId: user.id,
          completed: false,
        },
        {
          title: "Deep Meditation",
          description: "Calm the mind to restore mental energy.",
          type: "Daily Quest",
          rarity: "rare",
          xp: 40,
          userId: user.id,
          completed: false,
        }
      ]
    });
  }
  
  console.log("Seed completed!");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
