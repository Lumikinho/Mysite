import type { APIRoute } from "astro";

type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: Array<{
            contributionDays?: ContributionDay[];
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get("username")?.trim();
  const daysParam = Number(url.searchParams.get("days") ?? "365");
  const days = Number.isFinite(daysParam)
    ? Math.min(Math.max(Math.floor(daysParam), 1), 365)
    : 365;

  if (!username) {
    return new Response(
      JSON.stringify({ error: "Nome de usuário não informado." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const token = import.meta.env.GITHUB_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Token do GitHub não configurado no servidor." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - (days - 1));

  const query = `
    query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  let graphqlResponse: Response;

  try {
    graphqlResponse = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
        "User-Agent": "mysite-astro-github-contributions",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Falha de conexão com o GitHub." }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!graphqlResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Falha ao consultar contribuições do GitHub." }),
      {
        status: graphqlResponse.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const body = (await graphqlResponse.json()) as GraphQLResponse;

  if (body.errors?.length) {
    return new Response(
      JSON.stringify({ error: body.errors[0]?.message ?? "Erro no GraphQL." }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const daysList =
    body.data?.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.flatMap((week) => week.contributionDays ?? [])
      .filter((day) => day.date >= from.toISOString().slice(0, 10)) ?? [];

  return new Response(
    JSON.stringify({
      username,
      from: from.toISOString(),
      to: to.toISOString(),
      days: daysList,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    }
  );
};
