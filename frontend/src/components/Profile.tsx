import React from "react";
import GitHubLoginButton from "./GithubLoginButton";
import { useUser } from "../context/UserContext";

const Profile: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="profile-button profile">
      {user ? (
        <div>
          Welkom, {user.name ? user.name : user.login}!
          <img src={user.avatar_url} alt="Avatar" />
        </div>
      ) : (
        //<MicrosoftLoginButton />
        <GitHubLoginButton />
      )}
    </div>
  );
};

export default Profile;
