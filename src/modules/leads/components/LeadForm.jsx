import React, { useState, useEffect } from "react";

export default function LeadForm({ initial = {}, onSubmit }) {
  const [name, setName] = useState(initial.name || "");
  const [email, setEmail] = useState(initial.email || "");
  const [status, setStatus] = useState(initial.status || "NEW");

  useEffect(() => {
    setName(initial.name || "");
    setEmail(initial.email || "");
    setStatus(initial.status || "NEW");
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, status });
  };

  return (
    <form onSubmit={submit}>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
        </select>
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
