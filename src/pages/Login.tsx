import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

const Login = () => {
  const [email, setEmail] = useState("admin@ebs-support.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/vendors");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="card" style={{ maxWidth: "440px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              color: "white",
              fontWeight: 700,
              letterSpacing: "1px",
              fontSize: "24px",
              marginBottom: "16px",
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)"
            }}
          >
            EBS
          </div>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome back</h1>
          <p className="muted">Sign in to access vendor documentation</p>
        </div>
        <form className="stack" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "#fee2e2",
                color: "#991b1b",
                fontSize: "14px"
              }}
            >
              {error}
            </div>
          )}
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </label>
          <button
            className="primary-button"
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="muted small" style={{ marginTop: "24px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
          >
            Create one
          </Link>
        </p>
        <p className="muted small" style={{ marginTop: "12px", textAlign: "center", fontSize: "12px" }}>
          Demo: admin@ebs-support.local / admin123
        </p>
      </div>
    </div>
  );
};

export default Login;
