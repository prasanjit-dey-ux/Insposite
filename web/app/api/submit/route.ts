import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Max 3 submissions per IP per 10 minutes (resets on server restart — fine for this scale)
const rateLimitStore = new Map<string, { count: number; firstSubmit: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryInMin: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.firstSubmit > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, firstSubmit: now });
    return { allowed: true, retryInMin: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryInMin = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.firstSubmit)) / 60000);
    return { allowed: false, retryInMin };
  }

  entry.count++;
  return { allowed: true, retryInMin: 0 };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Honeypot: bots fill this hidden field, humans never see it ──
    if (body.website) {
      // Silently succeed — bot doesn't know it was blocked
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // ── Rate limit by IP ──
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryInMin } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Try again in ${retryInMin} minute${retryInMin > 1 ? "s" : ""}.`,
        },
        { status: 429 }
      );
    }

    // ── Basic validation ──
    const { siteUrl, title, tag, creatorUrl, notes } = body;
    if (!siteUrl || !title || !tag) {
      return NextResponse.json(
        { error: "siteUrl, title, and tag are required." },
        { status: 400 }
      );
    }

    // ── Send to Discord ──
    if (DISCORD_WEBHOOK) {
      const embed = {
        title: "📬 New Site Submission",
        color: 0x1d4ed8,
        fields: [
          { name: "🌐 Site", value: `[${title}](${siteUrl})`, inline: true },
          { name: "🏷️ Category", value: tag, inline: true },
          ...(creatorUrl
            ? [{ name: "🔗 Social", value: creatorUrl, inline: false }]
            : []),
          ...(notes
            ? [{ name: "💬 Note", value: notes, inline: false }]
            : []),
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "INSPOSITE submission" },
      };

      const discordRes = await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (!discordRes.ok) {
        const text = await discordRes.text().catch(() => "(unreadable)");
        console.error(
          `[/api/submit] Discord webhook failed — status: ${discordRes.status}, body: ${text}`
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/submit] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
