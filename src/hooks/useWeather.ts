import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  description: string;
  main: string;
};

const weatherIcons: { [key: string]: string } = {
  Clear: "☀️",
  Rain: "🌧️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Drizzle: "🌦️",
  Clouds: "☁️",
  Default: "☁️",
};

export function useWeather(city: string, apiKey: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [icon, setIcon] = useState<string>(weatherIcons.Default);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadWeather() {
      if (!city || !apiKey) {
        setError("Cidade ou chave de API não informadas.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=pt_br`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Erro ao buscar clima");
        }

        const data = await res.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description as string;
        const main = data.weather[0].main as string;

        setWeather({ temp, description, main });
        setIcon(weatherIcons[main] || weatherIcons.Default);
      } catch (err) {
        console.error("Erro ao carregar clima", err);
        setError("Não foi possível carregar o clima");
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [city, apiKey]);

  return { weather, icon, error, loading };
}

export function useCurrentTime() {
    const [time, setTime] = useState<string>("--:--:--");

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

    return time;
}
