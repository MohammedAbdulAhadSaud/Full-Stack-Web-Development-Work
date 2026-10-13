import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign up. Is the server running?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create your account</h2>
      <p className="muted">It takes less than a minute.</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Full name
          <input name="name" value={form.name} onChange={onChange} required autoComplete="name" />
        </label>
        <label>Email
          <input type="email" name="email" value={form.email} onChange={onChange} required autoComplete="email" />
        </label>
        <label>Password <small className="muted">(min. 6 characters)</small>
          <input type="password" name="password" value={form.password} onChange={onChange} required minLength={6} autoComplete="new-password" />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="muted center">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}
