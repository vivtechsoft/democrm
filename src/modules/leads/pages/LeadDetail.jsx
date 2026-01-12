import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import leadsService from "../leads.service";

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    async function load() {
      const resp = await leadsService.getById(id);
      setLead(resp.data);
    }
    load();
  }, [id]);

  if (!lead) return <div>Loading...</div>;

  return (
    <div>
      <h2>Lead: {lead.name}</h2>
      <div><strong>Email:</strong> {lead.email}</div>
      <div><strong>Status:</strong> {lead.status}</div>
      <div><strong>Owner:</strong> {lead.owner}</div>
      <Link to={`/leads/${id}/edit`}>Edit</Link>
    </div>
  );
}
