import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { title, description, type, rarity, xp, completed } = await req.json();

    const quest = await db.quest.findUnique({
      where: { id: id },
    });

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // If marking as completed, create a log and update user XP
    if (completed && !quest.completed) {
      console.log("Processing quest completion for ID:", id);
      
      const isDaily = quest.type === "Daily Quest" || quest.type?.toLowerCase() === "daily";
      let newStreak = user.streak || 0;
      let newHighestStreak = user.highestStreak || 0;
      let isStreakIncremented = false;
      
      if (isDaily) {
        // Fetch all daily quests for this user to check if this is the last one
        const allDailyQuests = await db.quest.findMany({
          where: {
            userId: user.id,
            OR: [
              { type: "Daily Quest" },
              { type: "daily" }
            ]
          }
        });

        const otherDailyQuests = allDailyQuests.filter(q => q.id !== id);
        const allOthersCompleted = otherDailyQuests.length === 0 || otherDailyQuests.every(q => q.completed);

        if (allOthersCompleted) {
          newStreak += 1;
          if (newStreak > newHighestStreak) {
            newHighestStreak = newStreak;
          }
          isStreakIncremented = true;
        }
      }

      await db.$transaction([
        db.quest.update({
          where: { id: id },
          data: { completed: true },
        }),
        db.questLog.create({
          data: {
            questId: quest.id,
            userId: user.id,
            xpEarned: quest.xp,
            status: "completed",
          },
        }),
        db.user.update({
          where: { id: user.id },
          data: {
            xp: { increment: quest.xp },
            ...(isStreakIncremented && {
              streak: newStreak,
              highestStreak: newHighestStreak,
            }),
          },
        }),
      ]);
      console.log("Transaction completed successfully");
    } else {
      await db.quest.update({
        where: { id: id },
        data: {
          title: title ?? quest.title,
          description: description ?? quest.description,
          type: type ?? quest.type,
          rarity: rarity ?? quest.rarity,
          xp: xp ?? quest.xp,
          completed: completed ?? quest.completed,
        },
      });
    }

    return NextResponse.json({ message: "Quest updated successfully" });
  } catch (error: any) {
    console.error("API ERROR [PATCH /api/quests/id]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const quest = await db.quest.findUnique({
    where: { id: id },
  });

  if (!quest || quest.userId !== user.id) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  await db.quest.delete({
    where: { id: id },
  });

  return NextResponse.json({ message: "Quest deleted successfully" });
}
