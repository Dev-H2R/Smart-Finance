import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Ledger</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Transactions
          </NavLink>
          <NavLink
            to="/budgets"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Budgets
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Goals
          </NavLink>
          <NavLink
            to="/recurring"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Recurring
          </NavLink>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <h1 className="page-title">{title}</h1>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}