import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

const navItems = [
  { to: "/vendors", label: "Vendors" },
  { to: "/team", label: "Team" },
  { to: "/documents", label: "Documents" },
  { to: "/upload", label: "Upload Docs" }
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">EBS</span>
          <div>
            <div className="brand-title">EBS Support</div>
            <div className="brand-subtitle">Documentation and vendor hub</div>
          </div>
        </div>
        <div className="header-actions">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "white", fontSize: "14px" }}>
              {user?.name || "User"}
            </span>
            <button
              className="ghost-button"
              onClick={logout}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="app-body">
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
