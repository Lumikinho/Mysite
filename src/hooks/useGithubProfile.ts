import { useEffect, useState } from "react";

type GitHubUser = {
  avatar_url: string;
  html_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  public_repos: number;
  followers: number;
};

type ContributionStats = {
  totalContributions: number;
};

export function useGithubProfile(username: string) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [contributions, setContributions] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfile() {
      if (!username) {
        setError("Nome de usuário do GitHub não informado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const profileUrl = `https://api.github.com/users/${encodeURIComponent(
          username
        )}`;

        const [profileRes, contributionsRes] = await Promise.all([
          fetch(profileUrl),
          fetch(
            `/api/github-contributions.json?username=${encodeURIComponent(
              username
            )}`
          ),
        ]);

        if (!profileRes.ok) {
          throw new Error("Erro ao buscar GitHub");
        }

        const profileData = (await profileRes.json()) as GitHubUser;
        setUser(profileData);

        if (contributionsRes.ok) {
          const contributionData =
            (await contributionsRes.json()) as ContributionStats;
          setContributions(contributionData.totalContributions);
        } else {
          setContributions(null);
        }
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  return { user, contributions, error, loading };
}
