import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        xp: true,
        level: true,
        streak: true,
        highestStreak: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all completed quest logs for this user
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
      orderBy: { createdAt: "asc" },
    });

    // 1. Overview Calculations
    const totalExp = user.xp;
    const missionsCleared = logs.length;
    const highestStreak = user.highestStreak;

    // Active Days: unique calendar days with completed logs
    const activeDaysSet = new Set(
      logs.map((log) => new Date(log.createdAt).toDateString())
    );
    const activeDays = activeDaysSet.size;

    // Rank formula based on level and active days
    let rank = "Novice Tracker";
    if (user.level >= 20) rank = "Grandmaster Rank";
    else if (user.level >= 15) rank = "Legendary Rank";
    else if (user.level >= 10) rank = "Master Rank";
    else if (user.level >= 5) rank = "Elite Tracker";
    else if (user.level >= 2) rank = "Adept Adventurer";

    // Current week trend calculations (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const logsThisWeek = logs.filter(
      (log) => new Date(log.createdAt) >= monday
    );
    const expThisWeek = logsThisWeek.reduce((sum, log) => sum + log.xpEarned, 0);
    const missionsThisWeek = logsThisWeek.length;

    // 2. Quest Insights
    // Top Completed Quests (grouped by title)
    const questCounts: Record<
      string,
      { count: number; rarity: string; type: string }
    > = {};
    logs.forEach((log) => {
      const title = log.quest.title;
      if (!questCounts[title]) {
        questCounts[title] = {
          count: 0,
          rarity: log.quest.rarity || "common",
          type: log.quest.type || "Daily Quest",
        };
      }
      questCounts[title].count++;
    });

    const topCompleted = Object.entries(questCounts)
      .map(([name, info]) => {
        let color = "text-blue-400";
        let bg = "bg-blue-400/20";
        let icon = "🏃‍♂️";

        if (info.type === "Daily Quest") icon = "📅";
        else if (info.type === "Side Quest") icon = "⚔️";
        else if (info.type === "Boss Quest") icon = "💀";

        if (info.rarity === "common") {
          color = "text-slate-400";
          bg = "bg-slate-500/20";
        } else if (info.rarity === "rare") {
          color = "text-blue-400";
          bg = "bg-blue-400/20";
        } else if (info.rarity === "epic") {
          color = "text-purple-400";
          bg = "bg-purple-500/20";
        } else if (info.rarity === "legendary") {
          color = "text-amber-400";
          bg = "bg-amber-500/20";
        }

        return { name, count: info.count, icon, color, bg };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Most Productive Day of Week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayCounts = Array(7).fill(0);
    logs.forEach((log) => {
      const d = new Date(log.createdAt);
      dayCounts[d.getDay()]++;
    });

    let maxDayIdx = 2; // Default to Tuesday/Wednesday if no logs
    let maxDayCount = 0;
    dayCounts.forEach((count, idx) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        maxDayIdx = idx;
      }
    });
    const mostProductiveDayName =
      maxDayCount > 0 ? daysOfWeek[maxDayIdx] : "Wednesday";

    // Average completed quests per active day
    const avgQuests =
      activeDays > 0 ? parseFloat((missionsCleared / activeDays).toFixed(1)) : 0;

    // Best Time range of completion
    const timeRanges = [
      { label: "Morning (06:00 - 12:00)", count: 0, hours: [6, 7, 8, 9, 10, 11] },
      { label: "Afternoon (12:00 - 17:00)", count: 0, hours: [12, 13, 14, 15, 16] },
      { label: "Evening (17:00 - 22:00)", count: 0, hours: [17, 18, 19, 20, 21] },
      { label: "Night (22:00 - 06:00)", count: 0, hours: [22, 23, 0, 1, 2, 3, 4, 5] },
    ];
    logs.forEach((log) => {
      const hour = new Date(log.createdAt).getHours();
      const range = timeRanges.find((r) => r.hours.includes(hour));
      if (range) range.count++;
    });

    let bestTime = "Morning (07:00 - 10:00)";
    let maxTimeCount = 0;
    timeRanges.forEach((r) => {
      if (r.count > maxTimeCount) {
        maxTimeCount = r.count;
        bestTime = r.label;
      }
    });

    // 3. Weekly / Monthly / Yearly Chart Aggregations
    // EXP and Missions Cleared
    // A. Weekly: Mon-Sun of current week
    const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyExp = Array(7).fill(0);
    const weeklyMissions = Array(7).fill(0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toDateString();

      const dayLogs = logs.filter(
        (log) => new Date(log.createdAt).toDateString() === dateStr
      );
      weeklyExp[i] = dayLogs.reduce((sum, log) => sum + log.xpEarned, 0);
      weeklyMissions[i] = dayLogs.length;
    }

    // B. Monthly: 4 weeks of the current month
    const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const monthlyExp = Array(4).fill(0);
    const monthlyMissions = Array(4).fill(0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const monthLogs = logs.filter((log) => {
      const d = new Date(log.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    monthLogs.forEach((log) => {
      const dayOfMonth = new Date(log.createdAt).getDate();
      let wIdx = 0;
      if (dayOfMonth <= 7) wIdx = 0;
      else if (dayOfMonth <= 14) wIdx = 1;
      else if (dayOfMonth <= 21) wIdx = 2;
      else wIdx = 3;

      monthlyExp[wIdx] += log.xpEarned;
      monthlyMissions[wIdx]++;
    });

    // C. Yearly: 12 months of the current year
    const yearlyLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const yearlyExp = Array(12).fill(0);
    const yearlyMissions = Array(12).fill(0);

    const yearLogs = logs.filter(
      (log) => new Date(log.createdAt).getFullYear() === currentYear
    );

    yearLogs.forEach((log) => {
      const mIdx = new Date(log.createdAt).getMonth();
      yearlyExp[mIdx] += log.xpEarned;
      yearlyMissions[mIdx]++;
    });

    // 4. Heatmap Data (Last 84 days)
    const heatmapData = [];
    const heatmapMidnight = new Date(today);
    heatmapMidnight.setHours(0, 0, 0, 0);

    const logsByDateString: Record<string, number> = {};
    logs.forEach((log) => {
      const d = new Date(log.createdAt);
      d.setHours(0, 0, 0, 0);
      const str = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      logsByDateString[str] = (logsByDateString[str] || 0) + 1;
    });

    for (let i = 83; i >= 0; i--) {
      const d = new Date(heatmapMidnight);
      d.setDate(heatmapMidnight.getDate() - i);
      const str = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      heatmapData.push({
        date: str,
        count: logsByDateString[str] || 0,
      });
    }

    // Combine everything into a nice clean structure
    const statistics = {
      overview: {
        totalExp,
        missionsCleared,
        highestStreak,
        activeDays,
        streak: user.streak,
        rank,
        expThisWeek,
        missionsThisWeek,
      },
      insights: {
        topCompleted,
        topFailed: [], // No failed logs, front-end will render clean Flawless badge!
        mostProductiveDay: {
          day: mostProductiveDayName,
          avgQuests,
          bestTime,
        },
      },
      charts: {
        exp: {
          weekly: weeklyLabels.map((label, idx) => ({
            label,
            value: weeklyExp[idx],
          })),
          monthly: monthlyLabels.map((label, idx) => ({
            label,
            value: monthlyExp[idx],
          })),
          yearly: yearlyLabels.map((label, idx) => ({
            label,
            value: yearlyExp[idx],
          })),
        },
        missions: {
          weekly: weeklyLabels.map((label, idx) => ({
            label,
            value: weeklyMissions[idx],
          })),
          monthly: monthlyLabels.map((label, idx) => ({
            label,
            value: monthlyMissions[idx],
          })),
          yearly: yearlyLabels.map((label, idx) => ({
            label,
            value: yearlyMissions[idx],
          })),
        },
      },
      heatmap: heatmapData,
    };

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error("API ERROR [GET /api/user/statistics]:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
