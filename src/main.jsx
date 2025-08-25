import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./login.jsx";

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <StrictMode>
      {isLoggedIn ? <App /> : <Login onLogin={handleLogin} />}
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
