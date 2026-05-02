import React from "react";
import { useCurrentTime, useWeather } from "../hooks/useWeather";
import { useDiscordProfile } from "../hooks/useDiscordProfile";

type Props = {
  userId?: string;
  city: string;
  apiKey: string;
  locationLabel?: string;
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

const DiscordHeroBar: React.FC<Props> = ({
  userId = "",
  city,
  apiKey,
  locationLabel = "Meu local",
  className = "",
}) => {
  const time = useCurrentTime();
  const { weather, icon, loading: weatherLoading } = useWeather(city, apiKey);
  const { profile, loading: discordLoading } = useDiscordProfile(userId);

  const displayName =
    profile?.user.global_name || profile?.user.username || "Discord";
  const username = profile?.user.username || "";
  const avatar = profile?.user.avatar_url || "";
  const status = profile?.status || "offline";

  return (
    <div
      className={`mt-6 w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={`${displayName} avatar`}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full"
              />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-200">
                DC
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-zinc-950 ${statusColor(
                status
              )}`}
              aria-hidden="true"
            />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-100">
              {discordLoading ? "Carregando..." : displayName}
            </div>
            <div className="text-xs text-zinc-400">
              {username ? `@${username}` : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <div className="text-right">
            <div className="text-xs font-semibold text-zinc-200">{locationLabel}</div>
            <div className="text-[11px] text-zinc-500">{time}</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{icon}</span>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-zinc-200">
                {weatherLoading ? "-- °C" : weather ? `${weather.temp} °C` : "-- °C"}
              </div>
              <div className="text-[11px] text-zinc-500">
                {weatherLoading ? "Carregando..." : weather?.description ?? "Clima"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordHeroBar;

