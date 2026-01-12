import React from "react";
import { useDispatch } from "react-redux";
import { createLead } from "../../../store/leadSlice";
import LeadForm from "../components/LeadForm";
import { useNavigate } from "react-router-dom";

export default function LeadCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const result = await dispatch(createLead(payload));
    if (result?.payload?.id) {
      navigate(`/leads/${result.payload.id}`);
    } else {
      navigate("/leads");
    }
  };

  return (
    <div>
      <h2>Create Lead</h2>
      <LeadForm onSubmit={handleSubmit} />
    </div>
  );
}
