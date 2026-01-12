import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../ui/Loader";

const Login = lazy(() => import("../modules/auth/Login"));
const LeadList = lazy(() => import("../modules/leads/pages/LeadList"));
const LeadCreate = lazy(() => import("../modules/leads/pages/LeadCreate"));
const LeadEdit = lazy(() => import("../modules/leads/pages/LeadEdit"));
const LeadDetail = lazy(() => import("../modules/leads/pages/LeadDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const Users = lazy(() => import("../pages/Users"));
const Settings = lazy(() => import("../pages/Settings"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/leads" replace />} />
          <Route path="leads">
            <Route index element={<ProtectedRoute roles={["ADMIN","SALES"]}><LeadList /></ProtectedRoute>} />
            <Route path="create" element={<ProtectedRoute roles={["ADMIN","SALES"]}><LeadCreate /></ProtectedRoute>} />
            <Route path=":id" element={<ProtectedRoute roles={["ADMIN","SALES","VIEWER"]}><LeadDetail /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute roles={["ADMIN","SALES"]}><LeadEdit /></ProtectedRoute>} />
          </Route>
          <Route path="users" element={<ProtectedRoute roles={["ADMIN"]}><Users /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute roles={["ADMIN"]}><Settings /></ProtectedRoute>} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
