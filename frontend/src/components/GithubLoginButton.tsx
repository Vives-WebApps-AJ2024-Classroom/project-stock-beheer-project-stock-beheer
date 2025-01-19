import React, { useEffect, useState } from "react";
import "../Layout/Login.css";
import axios from "axios";
import { useUser } from "../context/UserContext";

const GitHubLoginButton = () => {
  const { user, setUser } = useUser();
  const backendPort = process.env.REACT_APP_BACKEND_PORT;
  const backendUrl = process.env.REACT_APP_BACKEND_URL + ":" + backendPort;
  const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const adminLogin = process.env.REACT_APP_ADMIN_LOGIN;
  const redirectUrl = process.env.REACT_APP_GITHUB_REDIRECT_URL;
  console.log("client_id", client_id);

  const getUserEmail = async (username: string) => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username.replace(
          /^.*com[/]([^/]*).*$/,
          "$1"
        )}/events/public`
      );
      const email = response.data
        .filter((event: any) => event.type === "PushEvent")
        .map((event: any) => event.payload.commits)
        .flat()
        .find((commit: any) => commit.author.email)?.author.email;

      if (email) {
        return email;
      } else {
        console.log("User email not found");
        return "";
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("githubAccessToken");
    if (accessToken) {
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .catch((error) => {
          localStorage.removeItem("githubAccessToken");
        })
        .then((res) => {
          if (!res || !res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then(async (userData) => {
          try {
            if (userData.login) {
              const email = await getUserEmail(userData.login);

              const response = await axios.post(`${backendUrl}/users`, {
                username: userData.login,
                displayname: userData.name || userData.login,
                role: "student",
                email: email,
              });

              const userWithId = {
                ...userData,
                login: response.data.username,
                name: response.data.displayname,
                role: response.data.role,
                id: response.data.id,
                projects: response.data.projects,
                email: response.data.email,
              };

              setUser(userWithId); // Stel gebruiker in

              if (userData.login === adminLogin) {
                await axios.put(`${backendUrl}/users/${response.data.id}`, {
                  role: "admin",
                });
              }
            }
          } catch (error) {
            localStorage.removeItem("githubAccessToken");
            console.error(
              "Error tijdens ophalen of creëren van gebruiker:",
              error
            );
          }
        })
        .catch((error) => {
          localStorage.removeItem("githubAccessToken");
          console.error("Error tijdens ophalen van GitHub-gebruiker:", error);
        });
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
                      const email = await getUserEmail(userData.login);

                      const response = await axios.post(`${backendUrl}/users`, {
                        username: userData.login,
                        displayname: userData.name || userData.login,
                        role: "student",
                        email: email,
                      });

                      const userWithId = {
                        ...userData,
                        login: response.data.username,
                        name: response.data.displayname,
                        role: response.data.role,
                        id: response.data.id,
                        projects: response.data.projects,
                        email: response.data.email,
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
  }, [backendUrl, adminLogin, setUser, user]);

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUrl}`;
  };

  return (
    <div>
      <button className="login" onClick={handleLogin}>
        Inloggen
      </button>
    </div>
  );
};

export default GitHubLoginButton;
