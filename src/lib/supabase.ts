import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getNormalizedUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!raw) return null;

  // Strip quotes, spaces, zero-width characters, newlines
  let url = raw
    .replace(/[\u200B-\u200D\uFEFF\r\n]/g, "")
    .trim()
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .trim();

  if (!url) return null;

  // 1. Detect Postgres Connection String (e.g. postgres://postgres:pw@db.xxxx.supabase.co:5432/postgres)
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    const dbMatch =
      url.match(/db\.([a-z0-9_-]+)\.supabase\.co/i) ||
      url.match(/postgres\.([a-z0-9_-]+):/i) ||
      url.match(/@([a-z0-9_-]+)\.supabase\.co/i);
    if (dbMatch && dbMatch[1]) {
      return `https://${dbMatch[1]}.supabase.co`;
    }
  }

  // 2. Fix duplicated https:// or http://
  url = url.replace(/^(https?:\/\/)+/i, "https://");

  // 3. Auto-prepend https:// if scheme is missing (e.g. abcdefgh.supabase.co)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);

    // 4. Detect Supabase Dashboard URL (e.g. https://supabase.com/dashboard/project/abcdefghijklmnop)
    if (parsed.hostname === "supabase.com" || parsed.hostname === "app.supabase.com") {
      const projectMatch = parsed.pathname.match(/\/project\/([a-z0-9_-]+)/i);
      if (projectMatch && projectMatch[1]) {
        return `https://${projectMatch[1]}.supabase.co`;
      }
    }

    // 5. If hostname has no dot (user entered only Project ID, e.g. "ejhikwwiqetnnqnjiuop")
    if (!parsed.hostname.includes(".")) {
      return `https://${parsed.hostname}.supabase.co`;
    }

    // 6. Always use parsed.origin to strip trailing slashes, paths (/rest/v1), queries
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.origin;
    }
  } catch (err) {
    console.warn(`[Supabase] Invalid URL provided: "${raw}". Error:`, err);
  }

  return null;
}

export function getNormalizedKey(): string | null {
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!raw) return null;

  const key = raw
    .replace(/[\u200B-\u200D\uFEFF\r\n]/g, "")
    .trim()
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .trim();

  return key.length > 5 ? key : null;
}

export function getSupabaseDiagnostics() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const normalized = getNormalizedUrl();
  const key = getNormalizedKey();

  let hostname = "";
  try {
    if (normalized) {
      hostname = new URL(normalized).hostname;
    }
  } catch {}

  return {
    hasRawUrl: Boolean(raw),
    rawUrlSample: raw
      ? raw.length > 35
        ? `${raw.substring(0, 18)}...${raw.substring(raw.length - 8)}`
        : raw
      : "(tidak disetel)",
    normalizedUrl: normalized,
    hostname,
    hasKey: Boolean(key),
    keyPrefix: key ? `${key.substring(0, 12)}...` : "(tidak disetel)",
  };
}

let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl: string | null = null;
let hasLoggedInitError = false;

export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = getNormalizedUrl();
  const supabaseKey = getNormalizedKey();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // If URL changed or instance not initialized yet
  if (!supabaseInstance || lastUsedUrl !== supabaseUrl) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      lastUsedUrl = supabaseUrl;
    } catch (err) {
      if (!hasLoggedInitError) {
        console.error("[Supabase] Failed to initialize client. Using local file fallback:", err);
        hasLoggedInitError = true;
      }
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getNormalizedUrl() && getNormalizedKey());
}
