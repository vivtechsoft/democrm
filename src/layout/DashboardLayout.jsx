import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 16, background: "#f6f8fa" }}>
        <h3>Demo CRM</h3>
        <nav>
          <ul>
            <li><Link to="/leads">Leads</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout} style={{ marginTop: 20 }}>Logout</button>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
