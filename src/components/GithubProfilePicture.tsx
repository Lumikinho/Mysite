import React from 'react';
import { useGithubProfile } from '../hooks/useGithubProfile';

type GithubProfilePictureProps = {
  username: string;
};

const GithubProfilePicture: React.FC<GithubProfilePictureProps> = ({ username }) => {
  const { user, loading, error } = useGithubProfile(username);

  if (loading) {
    return (
      <div
        className="rounded-full bg-zinc-700 animate-pulse"
        style={{ width: 220, height: 220 }}
      ></div>
    );
  }

  if (error) {
    console.error("Error loading GitHub profile picture:", error);
    return (
      <img
        src="https://github.com/identicons/guest.png"
        alt="Placeholder Avatar"
        width={220}
        height={220}
        className="rounded-full bg-zinc-800"
      />
    );
  }

  return (
    <img
      src={user?.avatar_url ? `${user.avatar_url}&s=440` : "https://github.com/identicons/guest.png"}
      alt={user?.name || user?.login || "GitHub Avatar"}
      width={220}
      height={220}
      className="rounded-full bg-zinc-800"
      loading="eager"
    />
  );
};

export default GithubProfilePicture;
