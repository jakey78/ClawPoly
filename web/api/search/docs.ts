import type { VercelRequest, VercelResponse } from "@vercel/node";
import { enforceRateLimit } from "../_lib/rateLimit";
import * as fs from "fs";
import * as path from "path";

interface DocEntry {
  id: number;
  title: string;
  body: string;
  category: string;
  url: string;
}

let docsIndex: DocEntry[] | null = null;

function loadDocsIndex(): DocEntry[] {
  if (docsIndex) return docsIndex;

  try {
    // In Vercel, public files are accessible from the build output
    const indexPath = path.join(process.cwd(), "public", "docs-index.json");
    const raw = fs.readFileSync(indexPath, "utf-8");
    docsIndex = JSON.parse(raw);
    return docsIndex!;
  } catch (error) {
    console.warn("Failed to load docs-index.json, using empty index");
    docsIndex = [];
    return docsIndex;
  }
}

function searchDocs(query: string, limit = 10): Array<{ title: string; category: string; url: string; excerpt: string; score: number }> {
  const docs = loadDocsIndex();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return [];

  const results = docs
    .map((doc) => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const bodyLower = doc.body.toLowerCase();
      const categoryLower = doc.category.toLowerCase();

      for (const term of terms) {
        if (titleLower.includes(term)) score += 10;
        if (categoryLower.includes(term)) score += 5;
        if (bodyLower.includes(term)) score += 1;

        // Exact match bonus
        if (titleLower === term) score += 20;
      }

      // Generate excerpt
      let excerpt = doc.body.slice(0, 200);
      for (const term of terms) {
        const idx = bodyLower.indexOf(term);
        if (idx > 0) {
          const start = Math.max(0, idx - 50);
          const end = Math.min(doc.body.length, idx + term.length + 150);
          excerpt = (start > 0 ? "..." : "") + doc.body.slice(start, end) + (end < doc.body.length ? "..." : "");
          break;
        }
      }

      return {
        title: doc.title,
        category: doc.category,
        url: doc.url,
        excerpt,
        score,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Free endpoint — no x402, but rate limited
  if (!enforceRateLimit(req, res, 60, 60_000)) return;

  const { q, limit } = req.query;

  if (!q || typeof q !== "string" || q.trim().length === 0) {
    return res.status(400).json({ error: "Provide ?q=search+terms" });
  }

  try {
    const maxResults = limit ? Math.min(Number(limit), 50) : 10;
    const results = searchDocs(q.trim(), maxResults);

    return res.status(200).json({
      success: true,
      query: q.trim(),
      resultCount: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Docs search error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to search docs",
    });
  }
}
