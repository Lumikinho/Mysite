import React, { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  description: string;
  main: string;
};

const BIRTHDATE = "2009-04-15"; // tua data de nascimento

function getAge(birthDateString: string): number {
  const today = new Date();
  const birthDate = new Date(birthDateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
} // lógica padrão para idade inteira.[web:165][web:170]

export default function WeatherCard() {
  const [time, setTime] = useState<string>("--:--:--");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [icon, setIcon] = useState<string>("☁️");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function loadWeather() {
      try {
        const apiKey = import.meta.env.PUBLIC_OPENWEATHER_KEY as string;
        const city = "Sumare,BR";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=pt_br`;

        const res = await fetch(url);
        console.log("OpenWeather status:", res.status); // <--- ADD
        if (!res.ok) {
          const text = await res.text();
          console.error("OpenWeather response:", text);
          throw new Error("Erro ao buscar clima");
        }

        const data = await res.json();
        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description as string;
        const main = data.weather[0].main as string;

        setWeather({ temp, description: desc, main });

        let ic = "☁️";
        if (main === "Clear") ic = "☀️";
        else if (main === "Rain") ic = "🌧️";
        else if (main === "Thunderstorm") ic = "⛈️";
        else if (main === "Snow") ic = "❄️";
        else if (main === "Drizzle") ic = "🌦️";
        else if (main === "Clouds") ic = "☁️";

        setIcon(ic);
      } catch (err) {
        console.error("Erro ao carregar clima", err);
        setError("Não foi possível carregar o clima");
      }
    }

    loadWeather();
  }, []);

  const age = getAge(BIRTHDATE);

  return (
    <article className="col-span-2 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Meu local</h2>
          <p className="text-xs text-zinc-400">Sumaré, São Paulo — Brasil</p>
          <p className="mt-2 text-xs text-zinc-300">
            Tenho <span className="font-semibold">{age}</span> anos.
          </p>
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
            {weather ? `${weather.temp} °C` : "-- °C"}
          </p>
          <p className="text-xs text-zinc-400">
            {error
              ? error
              : weather
              ? weather.description.charAt(0).toUpperCase() +
                weather.description.slice(1)
              : "Carregando clima..."}
          </p>
        </div>
      </div>
    </article>
  );
}
