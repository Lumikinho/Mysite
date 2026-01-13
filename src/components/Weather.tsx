import React from "react";
import { useWeather, useCurrentTime } from "../hooks/useWeather";

interface WeatherCardProps {
  city: string;
  apiKey: string;
}

export default function WeatherCard({ city, apiKey }: WeatherCardProps) {
  const time = useCurrentTime();
  const { weather, icon, error, loading } = useWeather(city, apiKey);

  return (
    <article className="col-span-2 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 grayscale hover:grayscale-0 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Meu local</h2>
          <p className="text-xs text-zinc-400">Sumaré, São Paulo — Brasil</p>
          <p className="mt-2 text-xs text-zinc-300"></p>
        </div>

        <div className="text-right text-xs text-zinc-300">
          <p className="font-semibold">{time}</p>
          <p className="text-[11px] text-zinc-500">Hora local</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 text-sm">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">
            {loading ? "Carregando..." : weather ? `${weather.temp} °C` : "-- °C"}
          </p>
          <p className="text-xs text-zinc-400">
            {error
              ? error
              : loading
              ? "Carregando clima..."
              : weather
              ? weather.description.charAt(0).toUpperCase() +
                weather.description.slice(1)
              : "Clima não disponível"}
          </p>
        </div>
      </div>
    </article>
  );
}
