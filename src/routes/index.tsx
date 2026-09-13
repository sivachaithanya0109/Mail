import { createFileRoute } from "@tanstack/react-router";
import { MailApp } from "@/components/mail-app";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inbox — vmail" },
      { name: "description", content: "vmail inbox — read, search, and manage your mail." },
      { property: "og:title", content: "Inbox — vmail" },
      { property: "og:description", content: "vmail inbox — read, search, and manage your mail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <MailApp />;
}
