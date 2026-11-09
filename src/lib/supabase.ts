import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getNormalizedUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!raw) return null;

  let url = raw.trim().replace(/^["']|["']$/g, "").trim();
  if (!url) return null;

  // Auto-prepend https:// if user pasted domain without scheme (e.g. "abcdefgh.supabase.co")
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    console.warn(`[Supabase] Invalid URL provided in environment variable: "${raw}". Falling back to local storage.`);
  }

  return null;
}

function getNormalizedKey(): string | null {
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!raw) return null;

  const key = raw.trim().replace(/^["']|["']$/g, "").trim();
  return key.length > 5 ? key : null;
}

let supabaseInstance: SupabaseClient | null = null;
let hasLoggedInitError = false;

export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = getNormalizedUrl();
  const supabaseKey = getNormalizedKey();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
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
