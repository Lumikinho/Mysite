import React from "react";
import { useGithubProfile } from "../hooks/useGithubProfile";

interface GithubCardProps {
  username: string;
}

export default function GithubCard({ username }: GithubCardProps) {
  const { user, error, loading } = useGithubProfile(username);

  const profileName = user ? user.name || user.login : "Meu GitHub";
  const profileUsername = user ? `@${user.login}` : "@username";
  const profileBio = error
    ? error
    : loading
    ? "Carregando bio..."
    : user
    ? user.bio || "Sem descrição no perfil."
    : "Carregando bio...";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 grayscale hover:grayscale-0 transition-all duration-300">
      <h2 className="text-lg sm:text-xl font-semibold">Github</h2>

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-zinc-800">
          {user && (
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.login}`}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold">{profileName}</p>
          <p className="text-xs text-zinc-400">{profileUsername}</p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {profileBio}
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
          View my Github
          <span className="text-[10px]">↗</span>
        </a>
      </div>
    </article>
  );
}
