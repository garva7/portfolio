/* Single source of truth for all visible copy.
   Honesty rule: only metrics and facts from the brief. Anything unverified is
   marked as a placeholder, never invented. */

export const profile = {
  name: "Garv Arora",
  role: "Full-stack & AI Developer",
  bio: "CS student and developer who ships production AI and web apps, and builds sites for small premium service businesses.",
  email: "garvarora426@gmail.com",
  github: "https://github.com/garva7",
  linkedin: "https://linkedin.com/in/garvarora7",
};

/* Opens a Gmail compose window in a new tab, prefilled. More reliable in-browser
   than a raw mailto: (which needs a configured desktop mail client). */
export function gmailCompose(subject: string, body = "") {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: profile.email,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export type Project = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  stack: string[];
  highlights: string[];
  metric?: { value: string; label: string };
  live?: string;
  image: string;
  /* "cover" = full-bleed art (banners); "contain" = centered asset (logos) on
     `imageBg`, which avoids cropping and gives the tile its own brand color. */
  imageFit: "cover" | "contain";
  imageBg?: string;
};

export const projects: Project[] = [
  {
    id: "moodify",
    name: "Moodify",
    tag: "AI music recommender",
    blurb:
      "Describe a mood in plain language and get a tailored playlist back, with shareable links. Primary technical proof of the AI work.",
    stack: ["Groq LLaMA 3", "Flask", "React / Vite", "Spotify Web API"],
    highlights: [
      "Token-bucket rate limiter",
      "UUID-based playlist sharing",
      "LLM query expansion",
      "JSON audio-feature caching",
    ],
    metric: { value: "83%", label: "lower response latency (30s+ to 4-6s)" },
    live: "https://moodify-pbl.netlify.app/",
    image: "/moodify-logo.webp",
    imageFit: "contain",
    imageBg: "radial-gradient(circle at 50% 38%, #ffffff, #efe7f7 72%)",
  },
  {
    id: "deadpixel",
    name: "DeadPixel",
    tag: "Real-time API health dashboard",
    blurb:
      "A real-time dashboard to monitor API health and auto-suggest fixes for broken endpoints using GPT-4.",
    stack: ["React", "GPT-4", "Real-time data", "Vercel"],
    highlights: [
      "Auto-refreshing interface for live system monitoring with minimal latency",
      "GPT-4 fix suggestions for broken endpoints",
      "Continuous endpoint health checks",
    ],
    live: "https://deadpixelpro.vercel.app",
    image: "/deadpixel-thumb.webp",
    imageFit: "cover",
  },
];

/* Freelance / hire-me. Lives in its own section, not the products gallery. */
export const freelance = {
  eyebrow: "Work with me",
  headline: "Need a site that looks the part?",
  blurb:
    "I design and build fast, modern websites for small premium service businesses, then ship them live. Recent build: Waitomo Caves Lodge, New Zealand.",
  offers: [
    "Custom design, no templates",
    "Built and deployed end to end",
    "Fast, responsive, and easy to update",
  ],
  proof: {
    label: "Live build",
    name: "Waitomo Caves Lodge",
    url: "https://waitomo-lodge.netlify.app/",
  },
  cta: "Enquire now",
  enquirySubject: "Website enquiry",
  enquiryBody:
    "Hi Garv,\n\nI'd like a website for my business. Here's a bit about it:\n\n",
  seed: "premium-lodge-landscape",
};

export const stackGroups = [
  { label: "Languages", items: ["Python", "JavaScript", "C / C++"] },
  { label: "Frontend", items: ["React", "Vite", "HTML / CSS"] },
  { label: "Backend / APIs", items: ["Flask", "REST API design"] },
  {
    label: "AI / ML",
    items: ["Groq LLaMA 3", "LLM query expansion", "Prompt engineering"],
  },
  { label: "Tools / Infra", items: ["Spotify Web API", "Postman", "JIRA", "Git"] },
  { label: "Deployment", items: ["Netlify", "Vercel", "Railway"] },
] as const;

export const experience = [
  {
    role: "AI/ML & Web Development Intern",
    org: "World IT Dimensional Solutions (WITDS)",
    detail:
      "Built and shipped AI-powered features and full-stack web work end to end.",
  },
  {
    role: "QA / Testing",
    org: "Khosla Tech Services",
    detail:
      "Identified ~15 defects through Postman and JIRA regression testing.",
  },
] as const;

export const education = {
  degree: "B.Tech, Computer Science",
  school: "Manipal University Jaipur",
  year: "2nd year, 4th semester",
  coursework: [
    "Operating Systems",
    "Design & Analysis of Algorithms",
    "Automata Theory",
    "Cryptography",
    "C / C++",
  ],
};
