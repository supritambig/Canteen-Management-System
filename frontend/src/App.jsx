import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MenuDashboard from './components/MenuDashboard';
import AdminDashboard from './components/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" />;
  return children;
};

const DashboardRouter = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" />;
  const user = JSON.parse(userStr);
  return user.role === 'ADMIN' ? <AdminDashboard /> : <MenuDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
