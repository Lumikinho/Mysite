import React, { useEffect, useMemo, useState } from "react";

type GithubContributionGraphProps = {
  username: string;
  days?: number;
};

type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

type ContributionApiResponse = {
  username: string;
  from: string;
  to: string;
  days: ContributionDay[];
};

const ROWS = 7;

function intensityClass(contributionCount: number) {
  if (contributionCount >= 6) return "bg-emerald-400/90";
  if (contributionCount >= 3) return "bg-emerald-500/70";
  if (contributionCount >= 1) return "bg-emerald-600/60";
  return "bg-zinc-800";
}

export default function GithubContributionGraph({
  username,
  days = 365,
}: GithubContributionGraphProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContributionApiResponse | null>(null);

  useEffect(() => {
    let active = true;

    async function loadContributions() {
      if (!username) {
        setError("Não foi possível carregar contribuições.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github-contributions.json?username=${encodeURIComponent(
            username
          )}&days=${days}`
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar contribuições");
        }

        const responseData = (await response.json()) as ContributionApiResponse;

        if (active) {
          setData(responseData);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (active) {
          setError("Não foi possível carregar contribuições.");
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadContributions();

    return () => {
      active = false;
    };
  }, [username, days]);

  const weekColumns = useMemo(() => {
    const start = data ? new Date(data.from) : new Date();
    const dateMap = new Map(
      (data?.days ?? []).map((day) => [day.date, day.contributionCount])
    );

    const totalDays = data?.days.length ?? days;
    const paddedStart = new Date(start);
    const weekday = paddedStart.getUTCDay();
    paddedStart.setUTCDate(paddedStart.getUTCDate() - weekday);

    const cells = Array.from({ length: totalDays + weekday }).map((_, index) => {
      const current = new Date(paddedStart);
      current.setUTCDate(paddedStart.getUTCDate() + index);
      const isoDate = current.toISOString().slice(0, 10);
      return {
        date: isoDate,
        count: dateMap.get(isoDate) ?? 0,
        inRange: isoDate >= start.toISOString().slice(0, 10),
      };
    });

    const columns: Array<typeof cells> = [];
    for (let i = 0; i < cells.length; i += ROWS) {
      columns.push(cells.slice(i, i + ROWS));
    }

    return columns;
  }, [data, days]);

  const hasContributions = (data?.days ?? []).some(
    (day) => day.contributionCount > 0
  );

  return (
    <section className="mt-3">
      <p className="mb-2 text-xs text-zinc-400">Contribuições ({username})</p>

      {error && <p className="text-xs text-rose-300">{error}</p>}

      {!error && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/80 p-2">
          <div className="flex gap-1 min-w-max">
            {(loading ? Array.from({ length: Math.ceil(days / 7) }) : weekColumns).map(
              (week, weekIndex) => (
                <div className="grid grid-rows-7 gap-1" key={weekIndex}>
                  {(loading ? Array.from({ length: ROWS }) : week).map(
                    (day, dayIndex) => {
                      const isOutOfRange = !loading && day && !day.inRange;
                      const colorClass = loading
                        ? "bg-zinc-800/70 animate-pulse"
                        : day
                        ? intensityClass(day.count)
                        : "bg-zinc-900";

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`h-3 w-3 rounded-[2px] ${colorClass} ${
                            isOutOfRange ? "opacity-40" : ""
                          }`}
                          title={
                            loading || !day
                              ? "Carregando..."
                              : `${day.date}: ${day.count} contribuições`
                          }
                        />
                      );
                    }
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {!loading && !error && !hasContributions && (
        <p className="mt-2 text-xs text-zinc-500">Sem contribuições no período.</p>
      )}

      <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
        <span>Menos</span>
        <span className="h-2 w-2 rounded-[2px] bg-zinc-800" />
        <span className="h-2 w-2 rounded-[2px] bg-emerald-600/60" />
        <span className="h-2 w-2 rounded-[2px] bg-emerald-500/70" />
        <span className="h-2 w-2 rounded-[2px] bg-emerald-400/90" />
        <span>Mais</span>
      </div>
    </section>
  );
}
