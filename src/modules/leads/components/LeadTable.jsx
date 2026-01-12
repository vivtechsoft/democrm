import React from "react";
import { Link } from "react-router-dom";

export default function LeadTable({ leads = [], onEdit, onDelete }) {
  if (!leads || leads.length === 0) return <div>No leads</div>;

  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((l) => (
          <tr key={l.id}>
            <td><Link to={`/leads/${l.id}`}>{l.name}</Link></td>
            <td>{l.email}</td>
            <td>{l.status}</td>
            <td>{l.owner}</td>
            <td>
              <button onClick={() => onEdit(l)}>Edit</button>
              <button onClick={() => onDelete(l)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
