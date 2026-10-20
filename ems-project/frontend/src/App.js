import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import Departments from './pages/Departments';
import LeaveRequests from './pages/LeaveRequests';
import Showcase from './pages/Showcase';

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Showcase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/employees" element={<Protected><EmployeeList /></Protected>} />
            <Route path="/employees/new" element={<Protected><EmployeeForm /></Protected>} />
            <Route path="/employees/:id/edit" element={<Protected><EmployeeForm /></Protected>} />
            <Route path="/departments" element={<Protected><Departments /></Protected>} />
            <Route path="/leave-requests" element={<Protected><LeaveRequests /></Protected>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
