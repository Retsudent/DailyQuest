import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET() {
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

  const logs = await db.questLog.findMany({
    where: { userId: user.id },
    include: {
      quest: {
        select: {
          title: true,
          type: true,
          rarity: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}
