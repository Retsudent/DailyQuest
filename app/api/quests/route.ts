import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("GET /api/quests - Fetching session...");
    const session = await auth();
    console.log("Session:", session ? "Authenticated" : "Not Authenticated");

    if (!session?.user?.email) {
      console.log("Unauthorized access to /api/quests");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching user from DB for email:", session.user.email);
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Fetching quests for user ID:", user.id);
    
    // Logic to refresh Daily Quests
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch quests including logs from today to check completion status
    const quests = await db.quest.findMany({
      where: { userId: user.id },
      include: {
        logs: {
          where: {
            createdAt: { gte: startOfToday },
            status: "completed"
          },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Identify daily quests that were marked as completed but have no logs for today
    // This means they were completed on a previous day and need to be refreshed
    const dailyQuestsToRefresh = quests.filter(q => 
      q.type === "Daily Quest" && 
      q.completed && 
      q.logs.length === 0
    );

    if (dailyQuestsToRefresh.length > 0) {
      console.log(`Refreshing ${dailyQuestsToRefresh.length} daily quests for user ${user.id}`);
      const idsToReset = dailyQuestsToRefresh.map(q => q.id);
      
      await db.quest.updateMany({
        where: { id: { in: idsToReset } },
        data: { completed: false }
      });
      
      // Update the objects in memory to reflect the reset state in the response
      quests.forEach(q => {
        if (idsToReset.includes(q.id)) {
          q.completed = false;
        }
      });
    }

    // Remove logs from the response to keep it clean and match the expected format
    const cleanedQuests = quests.map(({ logs, ...q }) => q);

    console.log(`Found ${cleanedQuests.length} quests`);
    return NextResponse.json(cleanedQuests);
  } catch (error: any) {
    console.error("CRITICAL API ERROR [GET /api/quests]:", error.message);
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { title, description, type, rarity, xp } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const quest = await db.quest.create({
    data: {
      title,
      description,
      type,
      rarity,
      xp,
      userId: user.id,
    },
  });

  return NextResponse.json(quest);
}
