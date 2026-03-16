import type { APIRoute } from "astro";

type GitHubGraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get("username");
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return new Response(
      JSON.stringify({ error: "Parâmetro username é obrigatório." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        error: "Token do GitHub não configurado no servidor.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const payload = (await response.json()) as GitHubGraphQLResponse;

  if (!response.ok || payload.errors?.length) {
    return new Response(
      JSON.stringify({
        error: payload.errors?.[0]?.message ?? "Erro ao buscar contribuições.",
      }),
      {
        status: response.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const totalContributions =
    payload.data?.user?.contributionsCollection?.contributionCalendar
      ?.totalContributions ?? 0;

  return new Response(
    JSON.stringify({
      username,
      totalContributions,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
