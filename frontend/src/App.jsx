import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function AppRoutes({ user, setUser }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="app-shell">
      {!isLanding && <Navbar user={user} setUser={setUser} />}

      <div className={isLanding ? "" : "route-shell"}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <UserDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  // Initialize from localStorage on first render to prevent refresh redirect.
  const [user, setUser] = useState(getStoredUser);

  // sync with localStorage
  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;