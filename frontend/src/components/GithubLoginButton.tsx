import React, { useEffect, useState } from "react";
import "../Layout/Login.css";
import axios from "axios";
import { useUser } from "../context/UserContext";

const GitHubLoginButton = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true); // Voeg een laadstatus toe
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const client_id =
    process.env.REACT_APP_GITHUB_CLIENT_ID || "Ov23li5gezrPiarupgQe";
  const adminLogin = process.env.REACT_APP_ADMIN_LOGIN || "sw4kk3";
  const redirectUrl =
    process.env.REACT_APP_GITHUB_REDIRECT_URL || "http://localhost:3000";

  useEffect(() => {
    const accessToken = localStorage.getItem("githubAccessToken");
    if (accessToken) {
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(async (userData) => {
          try {
            if (userData.login) {
              const response = await axios.post(`${backendUrl}/users`, {
                username: userData.login,
                displayname: userData.name || userData.login,
                role: "student",
              });

              const userWithId = {
                ...userData,
                login: response.data.username,
                name: response.data.displayname,
                role: response.data.role,
                id: response.data.id,
                projects: response.data.projects,
              };

              setUser(userWithId); // Stel gebruiker in

              if (userData.login === adminLogin) {
                await axios.put(`${backendUrl}/users/${response.data.id}`, {
                  role: "admin",
                });
              }
            }
          } catch (error) {
            console.error(
              "Error tijdens ophalen of creëren van gebruiker:",
              error
            );
          }
        })
        .catch((error) =>
          console.error("Error tijdens ophalen van GitHub-gebruiker:", error)
        );
    } else {
      // Als er geen token is, ga verder met de normale flow
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        fetch(`${backendUrl}/auth/github?code=${code}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.accessToken) {
              localStorage.setItem("githubAccessToken", data.accessToken); // Sla het token op
              fetch("https://api.github.com/user", {
                headers: {
                  Authorization: `Bearer ${data.accessToken}`,
                },
              })
                .then((res) => res.json())
                .then(async (userData) => {
                  try {
                    if (userData.login) {
                      const response = await axios.post(`${backendUrl}/users`, {
                        username: userData.login,
                        displayname: userData.name || userData.login,
                        role: "student",
                      });

                      const userWithId = {
                        ...userData,
                        login: response.data.username,
                        name: response.data.displayname,
                        role: response.data.role,
                        id: response.data.id,
                        projects: response.data.projects,
                      };

                      setUser(userWithId); // Stel gebruiker in

                      if (userData.login === adminLogin) {
                        await axios.put(
                          `${backendUrl}/users/${response.data.id}`,
                          {
                            role: "admin",
                          }
                        );
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Error tijdens ophalen of creëren van gebruiker:",
                      error
                    );
                  }
                })
                .catch((error) =>
                  console.error(
                    "Error tijdens ophalen van GitHub-gebruiker:",
                    error
                  )
                );
              window.history.replaceState({}, document.title, "/");
            }
          })
          .catch((error) => console.error("Error tijdens login:", error));
      }
    }
  }, [backendUrl, adminLogin, setUser]);

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUrl}`;
  };

  return (
    <div>
      <button className="login" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default GitHubLoginButton;
