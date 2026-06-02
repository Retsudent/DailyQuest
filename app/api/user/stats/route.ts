import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("GET /api/user/stats - Fetching session...");
    const session = await auth();
    console.log("Session:", session ? "Authenticated" : "Not Authenticated");

    if (!session?.user?.email) {
      console.log("Unauthorized access to /api/user/stats");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching stats for user:", session.user.email);
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        xp: true,
        level: true,
        streak: true,
        highestStreak: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      console.log("User not found for stats");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("API Error [GET /api/user/stats]:", error.message);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
