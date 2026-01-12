import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 40 }}>
      <h2>404 — Not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
