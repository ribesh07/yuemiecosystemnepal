export const runtime = "nodejs";

import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { CONNECTIPS_DEBUG_FILE } from "@/lib/connectipsDebug";

function isAllowed(req: NextRequest) {
  const key = process.env.CONNECTIPS_DEBUG_KEY;
  if (process.env.NODE_ENV !== "production") return true;
  if (!key) return false;
  return req.headers.get("x-connectips-debug-key") === key;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAllowed(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sp = req.nextUrl.searchParams;
    const referenceId = (sp.get("referenceId") || "").trim();
    const txnId = (sp.get("txnId") || "").trim();
    const limit = Math.max(1, Math.min(500, Number(sp.get("limit") || 200)));

    const raw = await fs.readFile(CONNECTIPS_DEBUG_FILE, "utf8").catch(() => "");
    const lines = raw
      .split("\n")
      .filter(Boolean)
      .slice(-Math.max(limit * 5, 500))
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const filtered = lines.filter((entry: any) => {
      if (referenceId && String(entry?.referenceId || "") !== referenceId) {
        return false;
      }
      if (txnId && String(entry?.txnId || "") !== txnId) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      file: CONNECTIPS_DEBUG_FILE,
      count: filtered.length,
      data: filtered.slice(-limit),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to read logs",
      },
      { status: 500 }
    );
  }
}
