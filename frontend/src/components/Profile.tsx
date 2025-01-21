import React from "react";
import GitHubLoginButton from "./GithubLoginButton";
import { useUser } from "../context/UserContext";

const Profile: React.FC = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    // Verwijder token uit localStorage
    localStorage.removeItem("githubAccessToken");

    // Reset de gebruiker in de context
    setUser(null);
  };

  return (
    <div className="profile-button profile">
      {user ? (
        <div className="flex">
          <p>Welkom, {user.name ? user.name : user.login}!</p>
          <img src={user.avatar_url} alt="Avatar" />
          <button onClick={handleLogout}>Uitloggen</button>
        </div>
      ) : (
        <GitHubLoginButton />
      )}
    </div>
  );
};

export default Profile;
