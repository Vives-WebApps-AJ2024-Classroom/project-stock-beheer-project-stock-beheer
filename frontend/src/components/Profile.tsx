import React from "react";
import GitHubLoginButton from "./GithubLoginButton";
import { useUser } from "../context/UserContext";

const Profile: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="profile">
      {user ? (
        <div>
          Welkom, {user.name ? user.name : user.login} {user.id} {user.role}{" "}
          {user.projects}!
        </div>
      ) : (
        //<MicrosoftLoginButton />
        <GitHubLoginButton />
      )}
    </div>
  );
};

export default Profile;
