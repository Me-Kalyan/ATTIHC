import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ATTIHC",
    short_name: "ATTIHC",
    description: "Daily focus tracker: Remember, Complete, Avoid, and Scratchpad.",
    start_url: "/today",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAF9F7",
    theme_color: "#FAF9F7",
    categories: ["productivity", "lifestyle"],
    icons: [
      {
        src: "/icons/maskable-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
