import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Unauthorized</h2>
      <p>You don’t have permission to view this page.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
