import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Loading from './components/ui/Loading';

// Lazy-loaded components
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RequisitionForm = lazy(() => import('./pages/RequisitionForm'));
const RequisitionList = lazy(() => import('./pages/RequisitionList'));
const ApprovalDashboard = lazy(() => import('./pages/ApprovalDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requisitions/new" element={<RequisitionForm />} />
            <Route path="/requisitions" element={<RequisitionList />} />
            
            {/* Manager routes */}
            <Route 
              path="/approvals" 
              element={
                <RoleBasedRoute roles={['manager', 'admin']}>
                  <ApprovalDashboard />
                </RoleBasedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <RoleBasedRoute roles={['admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;