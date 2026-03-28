import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, googleLogin, getMe } from "../api/authApi";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //  Normal login
  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await loginUser({ email, password });

    localStorage.setItem("token", res.data.token);

    const userRes = await getMe();

    localStorage.setItem("user", JSON.stringify(userRes.data.user));

    setUser(userRes.data.user); //  IMPORTANT

    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    setLoading(true);

    const res = await googleLogin(credentialResponse.credential);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user); //  IMPORTANT

    navigate("/dashboard");
  } catch (err) {
    alert("Google login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page-shell auth-shell login-shell">
      <div className="auth-card" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <br /><br />

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Google Login Failed")}
        />

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}