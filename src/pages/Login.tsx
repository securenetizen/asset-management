import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/dashboard';
  
  // If already logged in, redirect
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo credentials helper
  const loginAsSampleUser = (role: 'user' | 'manager' | 'admin') => {
    let email = '';
    
    switch (role) {
      case 'user':
        email = 'user@example.com';
        break;
      case 'manager':
        email = 'manager@example.com';
        break;
      case 'admin':
        email = 'admin@example.com';
        break;
    }
    
    setEmail(email);
    setPassword('password');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
            <Lock className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Office Asset Management</h1>
          <p className="mt-2 text-neutral-600">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-error-50 text-error-800 p-3 rounded-md text-sm border border-error-200">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-neutral-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10 w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-neutral-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 w-full"
                  placeholder="********"
                />
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign in
          </Button>
          
          <div className="mt-6">
            <p className="text-sm text-center text-neutral-600 mb-3">
              Demo Accounts (Password: "password")
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsSampleUser('user')}
                className="text-xs flex flex-col items-center p-2 rounded-md border hover:bg-neutral-50"
              >
                <User size={16} className="mb-1" />
                Staff
              </button>
              <button
                type="button"
                onClick={() => loginAsSampleUser('manager')}
                className="text-xs flex flex-col items-center p-2 rounded-md border hover:bg-neutral-50"
              >
                <User size={16} className="mb-1" />
                Manager
              </button>
              <button
                type="button"
                onClick={() => loginAsSampleUser('admin')}
                className="text-xs flex flex-col items-center p-2 rounded-md border hover:bg-neutral-50"
              >
                <User size={16} className="mb-1" />
                Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}