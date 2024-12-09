import React, { useEffect, useState } from "react";
import "../Layout/Login.css";
import axios from "axios";

const GitHubLoginButton = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState<number | null>(null);
  interface GitHubUser {
    name?: string;
    login: string;
    avatar_url: string;
  }

  const [user, setUser] = useState<GitHubUser | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const adminLogin = process.env.REACT_APP_ADMIN_LOGIN;

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      // Verwerk de GitHub OAuth-code
      fetch(`${backendUrl}/auth/github?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            setAccessToken(data.accessToken);

            // Haal gebruikersinformatie op
            fetch("https://api.github.com/user", {
              headers: {
                Authorization: `Bearer ${data.accessToken}`,
              },
            })
              .then((res) => res.json())
              .then(async (userData) => {
                setUser(userData);
                const users = await axios.get(`${backendUrl}/users`);
                if (users.data.length !== 0) {
                  console.log("users", users.data);
                  console.log("userData", userData);
                  const userExists = users.data.some(
                    (u: any) => u.username === userData.login
                  );
                  if (userExists) {
                    const existingUser = users.data.find(
                      (u: any) => u.username === userData.login
                    );
                    setUserId(existingUser.ID);
                    if (userData.login === adminLogin) {
                      await axios.put(
                        `${backendUrl}/users/${existingUser.ID}`,
                        {
                          role: "admin",
                        }
                      );
                    }

                    return;
                  }
                }
                const newUser = await axios.post(`${backendUrl}/users`, {
                  username: userData.login,
                  displayname: userData.name,
                  role: "student",
                });
                setUserId(newUser.data.ID);
              })
              .catch((error) =>
                console.error("Error tijdens ophalen van gebruiker:", error)
              );

            // Verwijder de 'code' uit de URL
            window.history.replaceState({}, document.title, "/");
          }
        })
        .catch((error) => console.error("Error tijdens login:", error));
    }
  }, [backendUrl]);

  const handleLogin = () => {
    const redirectUri = "http://localhost";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUri}`;
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <div className="flex">
          {user ? (
            <>
              <p>Welkom, {user.name || user.login}!</p>
              <img src={user.avatar_url} alt="Avatar" width={40} />
            </>
          ) : (
            <p>Gebruikersinformatie wordt geladen...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubLoginButton;
