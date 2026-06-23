import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  try {
    const store = getStore("visitors");
    const raw = await store.get("count");
    const prev = raw ? parseInt(raw, 10) : 0;
    const next = prev + 1;
    await store.set("count", String(next));
    return Response.json({ count: next });
  } catch {
    return Response.json({ count: null }, { status: 500 });
  }
}

export const config = {
  path: "/api/visitor-count",
};
