import React from "react";
import { useDiscordProfile } from "../hooks/useDiscordProfile";

type Props = {
  userId?: string;
  className?: string;
};

function statusColor(status: string) {
  switch (status) {
    case "online":
      return "bg-emerald-400";
    case "idle":
      return "bg-amber-400";
    case "dnd":
      return "bg-rose-500";
    default:
      return "bg-zinc-500";
  }
}

function avatarUrl(userId: string, avatarHash?: string | null) {
  if (!avatarHash) return "";
  const isAnimated = avatarHash.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=128`;
}

const DiscordProfile: React.FC<Props> = ({ userId = "", className = "" }) => {
  const { profile, loading, error } = useDiscordProfile(userId);

  if (!userId) return null;

  if (loading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="h-10 w-10 rounded-full bg-zinc-700 animate-pulse" />
        <div className="h-4 w-36 rounded bg-zinc-700 animate-pulse" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <a
        href="https://discord.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-400 backdrop-blur-md hover:border-zinc-700 ${className}`}
        title={error || "Discord indisponível"}
      >
        <span className="h-2 w-2 rounded-full bg-zinc-500" aria-hidden="true" />
        <span>Discord indisponível</span>
      </a>
    );
  }

  const name = profile.user.global_name || profile.user.username || "Discord";

  return (
    <a
      href={`https://discord.com/users/${profile.user.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-2 backdrop-blur-md ${className}`}
    >
      <div className="relative">
        {profile.user.avatar_url ? (
          <img
            src={profile.user.avatar_url}
            alt={`${name} avatar`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-200">
            DC
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-zinc-950 ${statusColor(
            profile.status
          )}`}
          aria-hidden="true"
        />
      </div>

      <div className="leading-tight">
        <div className="text-sm font-semibold text-zinc-100">{name}</div>
        <div className="text-xs text-zinc-400">@{profile.user.username}</div>
      </div>
    </a>
  );
};

export default DiscordProfile;
