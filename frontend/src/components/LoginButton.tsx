import React, { useState } from "react";
import "./login.css";

function LoginButton() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    resetForm();
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Wachtwoorden komen niet overeen.");
      return;
    }

    if (username.length < 4 || password.length < 6) {
      setErrorMessage(
        "Gebruikersnaam moet minimaal 4 tekens bevatten en wachtwoord minimaal 6 tekens."
      );
      return;
    }

    // Simuleer succesvolle registratie
    setSuccessMessage("Registratie succesvol! Je kunt nu inloggen.");
    setIsRegistering(false); // Ga terug naar login-formulier
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Dummy validatie voor login
    if (username === "admin" && password === "password") {
      alert("Login succesvol!");
      setIsPopupVisible(false); // Sluit popup na succesvolle login
    } else {
      setErrorMessage("Ongeldige gebruikersnaam of wachtwoord.");
    }
  };

  return (
    <div className="login-button-container">
      <button onClick={togglePopup}>Login</button>
      {isPopupVisible && (
        <div className="popup">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <button type="submit">
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          <button className="toggle-register" onClick={toggleRegister}>
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginButton;
