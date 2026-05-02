import type { APIRoute } from "astro";
import { getDiscordGateway } from "../../lib/discordGateway";

type DiscordUser = {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  banner?: string | null;
  accent_color?: number | null;
};

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

const DISCORD_API = "https://discord.com/api/v10";

function avatarUrl(user: DiscordUser) {
  if (!user.avatar) return null;
  const isAnimated = user.avatar.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
}

function bannerUrl(user: DiscordUser) {
  if (!user.banner) return null;
  const isAnimated = user.banner.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600`;
}

export const GET: APIRoute = async ({ url }) => {
  const userId =
    url.searchParams.get("userId") ??
    import.meta.env.PUBLIC_DISCORD_USER_ID ??
    import.meta.env.DISCORD_USER_ID ??
    process.env.PUBLIC_DISCORD_USER_ID ??
    process.env.DISCORD_USER_ID ??
    "";

  const botToken =
    import.meta.env.DISCORD_BOT_TOKEN ?? process.env.DISCORD_BOT_TOKEN ?? "";
  const guildId =
    import.meta.env.DISCORD_GUILD_ID ?? process.env.DISCORD_GUILD_ID ?? "";

  if (!userId) {
    return new Response(JSON.stringify({ error: "Parâmetro userId é obrigatório." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!botToken) {
    return new Response(JSON.stringify({ error: "DISCORD_BOT_TOKEN não configurado." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch user public profile via official REST API (Bot token).
  const userRes = await fetch(`${DISCORD_API}/users/${encodeURIComponent(userId)}`, {
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!userRes.ok) {
    const text = await userRes.text().catch(() => "");
    return new Response(
      JSON.stringify({
        error: `Erro ao buscar usuário no Discord (status ${userRes.status}).`,
        details: text ? text.slice(0, 500) : undefined,
      }),
      { status: userRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = (await userRes.json()) as DiscordUser;

  let status: DiscordStatus = "offline";
  let statusSource: "gateway" | "fallback" = "fallback";

  // Status/presence requires Gateway connection + privileged intent enabled.
  if (guildId) {
    try {
      const gateway = getDiscordGateway(botToken);
      // Don't block the HTTP response for too long waiting on the Gateway.
      // We'll return cached status when available; client can re-fetch.
      const connectPromise = gateway.connect();
      await Promise.race([
        connectPromise,
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (gateway.isReady()) {
        gateway.requestMemberPresence(guildId, userId);
        const cached = gateway.getStatus(userId);
        if (cached) {
          status = cached;
          statusSource = "gateway";
        }
      }
    } catch {
      // keep fallback offline
    }
  }

  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        avatar: user.avatar,
        avatar_url: avatarUrl(user),
        banner: user.banner ?? null,
        banner_url: bannerUrl(user),
        accent_color: user.accent_color ?? null,
      },
      status,
      statusSource,
      note:
        statusSource === "fallback" && !guildId
          ? "Configure DISCORD_GUILD_ID para tentar buscar presença via Gateway."
          : undefined,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
