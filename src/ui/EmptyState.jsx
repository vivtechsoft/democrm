import React from "react";

export default function EmptyState({ title = "Nothing here", description = "" }) {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
