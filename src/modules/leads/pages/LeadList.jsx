import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, deleteLead } from "../../../store/leadSlice";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";

export default function LeadList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const handleEdit = (l) => navigate(`/leads/${l.id}/edit`);
  const handleDelete = (l) => dispatch(deleteLead(l.id));

  return (
    <div>
      <h2>Leads</h2>
      <button onClick={() => navigate("/leads/create")}>Create Lead</button>
      {loading ? <div>Loading...</div> : <LeadTable leads={items} onEdit={handleEdit} onDelete={handleDelete} />}
    </div>
  );
}
