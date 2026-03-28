import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
  localStorage.clear();
  setUser(null); //  IMPORTANT
  navigate("/");
};

  return (
    <div className="navbar">

      <h3>Task Manager</h3>

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>{" "}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}