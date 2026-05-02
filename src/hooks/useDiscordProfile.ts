import { useEffect, useState } from "react";

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

type DiscordProfile = {
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    avatar_url: string | null;
    banner: string | null;
    banner_url: string | null;
    accent_color: number | null;
  };
  status: DiscordStatus;
  statusSource?: "gateway" | "fallback";
};

export function useDiscordProfile(userId: string) {
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | null = null;

    async function load() {
      if (!userId) {
        setLoading(false);
        setProfile(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/discord-profile.json?userId=${encodeURIComponent(userId)}`
        );
        const data = (await res.json()) as DiscordProfile | { error: string };

        if (!res.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Erro ao buscar perfil.");
        }

        if (cancelled) return;
        setProfile(data);

        // If presence is still fallback, retry a few times (Gateway may still be warming up).
        if (data.statusSource === "fallback") {
          retryTimer = window.setTimeout(async () => {
            try {
              const res2 = await fetch(
                `/api/discord-profile.json?userId=${encodeURIComponent(userId)}`
              );
              const data2 = (await res2.json()) as
                | DiscordProfile
                | { error: string };
              if (!cancelled && res2.ok && !("error" in data2)) {
                setProfile(data2);
              }
            } catch {
              // ignore retry errors
            }
          }, 1500);
        }
      } catch (e) {
        const message =
          e instanceof Error && e.message ? e.message : "Erro desconhecido";
        console.error(e);
        setError(message);
        setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [userId]);

  return { profile, loading, error };
}
