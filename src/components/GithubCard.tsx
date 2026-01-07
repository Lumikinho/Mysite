import React, { useEffect, useState } from "react";

type GitHubUser = {
  avatar_url: string;
  html_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  public_repos: number;
  followers: number;
};

interface GithubCardProps {
  username: string;
}

export default function GithubCard({ username }: GithubCardProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const url = `https://api.github.com/users/${encodeURIComponent(
          username,
        )}`; // endpoint público de perfil.[web:186][web:189]
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar GitHub");
        const data = (await res.json()) as GitHubUser;
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o perfil.");
      }
    }

    loadProfile();
  }, [username]);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-xl font-semibold">Github</h2>

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-zinc-800">
          {user && (
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.login}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold">
            {user ? user.name || user.login : "Meu GitHub"}
          </p>
          <p className="text-xs text-zinc-400">
            {user ? `@${user.login}` : "@username"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {error
              ? error
              : user
              ? user.bio || "Sem descrição no perfil."
              : "Carregando bio..."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <p>
          Repos:
          <span className="font-semibold text-zinc-100">
            {" "}
            {user ? user.public_repos : "--"}
          </span>
        </p>
        <p>
          Followers:
          <span className="font-semibold text-zinc-100">
            {" "}
            {user ? user.followers : "--"}
          </span>
        </p>
      </div>

      <div className="mt-2">
        <a
          href={user ? user.html_url : `https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
        >
          Github
          <span className="text-[10px]">↗</span>
        </a>
      </div>
    </article>
  );
}