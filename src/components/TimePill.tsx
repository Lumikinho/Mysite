import React from "react";
import { useCurrentTime } from "../hooks/useWeather";

type Props = {
  label?: string;
  className?: string;
};

const TimePill: React.FC<Props> = ({ label = "Hora local", className = "" }) => {
  const time = useCurrentTime();

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-2 backdrop-blur-md ${className}`}
    >
      <div className="relative grid h-11 w-11 place-items-center rounded-full bg-zinc-900/60">
        <span className="text-lg leading-none text-zinc-200">🕒</span>
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-zinc-500 ring-2 ring-zinc-950"
          aria-hidden="true"
        />
      </div>

      <div className="leading-tight">
        <div className="text-sm font-semibold text-zinc-100">{label}</div>
        <div className="text-xs text-zinc-400">{time}</div>
      </div>
    </div>
  );
};

export default TimePill;

