import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DailyQuest",
    short_name: "DailyQuest",
    description: "Gamified productivity app for daily quests and streaks.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#8b5cf6",
    orientation: "portrait",
    icons: [
      {
        src: "/6045432.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logres.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
