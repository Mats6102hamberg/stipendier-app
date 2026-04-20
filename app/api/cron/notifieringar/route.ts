import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Anropas av Vercel Cron (sätt CRON_SECRET i env)
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const om7Dagar = new Date();
  om7Dagar.setDate(om7Dagar.getDate() + 7);
  const imorgon = new Date();
  imorgon.setDate(imorgon.getDate() + 1);

  // Hämta bevakningar för stipendier med deadline inom 7 dagar
  const bevakningar = await prisma.bevakning.findMany({
    where: {
      skickad: false,
      stipendium: {
        aktiv: true,
        deadline: { gte: imorgon, lte: om7Dagar },
      },
    },
    include: {
      stipendium: { select: { namn: true, organisation: true, deadline: true, url: true, id: true } },
    },
  });

  let skickade = 0;

  for (const b of bevakningar) {
    const s = b.stipendium;
    const dagKvar = Math.ceil(
      (new Date(s.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    // Skicka e-post via Resend (kräver RESEND_API_KEY i env)
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Stipendiesök <noreply@stipendier-app.vercel.app>",
          to: b.email,
          subject: `⚡ Påminnelse: ${s.namn} – ${dagKvar} dagar kvar`,
          html: `
            <h2>${s.namn}</h2>
            <p><strong>${s.organisation}</strong></p>
            <p>Deadline: <strong>${new Date(s.deadline!).toLocaleDateString("sv-SE")}</strong> (${dagKvar} dagar kvar)</p>
            ${s.url ? `<p><a href="${s.url}">Ansök här →</a></p>` : ""}
            <hr/>
            <p style="font-size:12px;color:#999">Du bevakar detta stipendium på Stipendiesök. <a href="https://stipendier-app.vercel.app/stipendier/${s.id}">Visa stipendium</a></p>
          `,
        }),
      });
    }

    await prisma.bevakning.update({ where: { id: b.id }, data: { skickad: true } });
    skickade++;
  }

  return NextResponse.json({ skickade, totalt: bevakningar.length });
}
