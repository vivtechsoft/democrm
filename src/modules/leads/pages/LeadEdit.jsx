import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import leadsService from "../leads.service";
import { useDispatch } from "react-redux";
import { updateLead } from "../../../store/leadSlice";
import LeadForm from "../components/LeadForm";

export default function LeadEdit() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function load() {
      const resp = await leadsService.getById(id);
      setInitial(resp.data);
    }
    load();
  }, [id]);

  const handleSubmit = async (payload) => {
    const res = await dispatch(updateLead({ id, payload }));
    if (res?.payload) navigate(`/leads/${id}`);
  };

  if (!initial) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Lead</h2>
      <LeadForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
