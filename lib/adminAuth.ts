import { createHmac, timingSafeEqual } from "crypto";

const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function sign(ts: string, secret: string): string {
  return createHmac("sha256", secret).update(ts).digest("hex");
}

export function createAdminCookie(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET saknas");
  const ts = Date.now().toString();
  return `${ts}.${sign(ts, secret)}`;
}

export function verifyAdminCookie(value: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !value) return false;

  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const ts = value.slice(0, dot);
  const mac = value.slice(dot + 1);

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum) || Date.now() - tsNum > MAX_AGE_MS) return false;

  const expected = sign(ts, secret);
  if (mac.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
