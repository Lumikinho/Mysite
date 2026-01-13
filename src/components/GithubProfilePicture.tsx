import React from 'react';
import { useGithubProfile } from '../hooks/useGithubProfile';

type GithubProfilePictureProps = {
  username: string;
};

const GithubProfilePicture: React.FC<GithubProfilePictureProps> = ({ username }) => {
  const { user, loading, error } = useGithubProfile(username);

  if (loading) {
    return <div className="rounded-full bg-zinc-700 animate-pulse" style={{ width: 150, height: 150 }}></div>;
  }

  if (error) {
    console.error("Error loading GitHub profile picture:", error);
    // Fallback to a generic placeholder or the existing pravatar
    return (
      <img
        src="https://i.pravatar.cc/150"
        alt="Placeholder Avatar"
        width={150}
        height={150}
        className="rounded-full"
      />
    );
  }

  return (
    <img
      src={user?.avatar_url || "https://i.pravatar.cc/150"}
      alt={user?.name || user?.login || "GitHub Avatar"}
      width={150}
      height={150}
      className="rounded-full"
    />
  );
};

export default GithubProfilePicture;
