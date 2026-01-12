import React, { useEffect, useState } from "react";
import userService from "../services/user.service";

export default function Users() {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    userService.list().then((r) => setUsers(r.data));
  }, []);
  if (!users) return <div>Loading...</div>;
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} — {u.email} — {u.roles.join(", ")}</li>
        ))}
      </ul>
    </div>
  );
}
