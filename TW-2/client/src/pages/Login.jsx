import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in. Is the server running?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <p className="muted">Log in to see your shelf.</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Email
          <input type="email" name="email" value={form.email} onChange={onChange} required autoComplete="email" />
        </label>
        <label>Password
          <input type="password" name="password" value={form.password} onChange={onChange} required autoComplete="current-password" />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
