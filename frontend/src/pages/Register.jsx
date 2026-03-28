import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLogin } from "../api/authApi";
import { GoogleLogin } from "@react-oauth/google";

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //  Normal register
  const handleRegister = async () => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    if (!payload.name || !payload.email || !payload.password) {
      alert("All fields are required");
      return;
    }

    if (payload.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await registerUser(payload);

      alert("Registered successfully ✅");
      navigate("/login");
    } catch (err) {
      const apiError = err.response?.data;
      const firstValidationError = apiError?.errors?.[0]?.msg;
      alert(firstValidationError || apiError?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //  Google register/login
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    setLoading(true);

    const res = await googleLogin(credentialResponse.credential);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user); //  IMPORTANT

    navigate("/dashboard");
  } catch (err) {
    alert("Google signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page-shell auth-shell register-shell">
      <div className="auth-card" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <br /><br />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <br /><br />

        {/*  Google Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Google Signup Failed")}
        />

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}