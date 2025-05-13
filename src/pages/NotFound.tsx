import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/">
            <Button leftIcon={<Home size={18} />}>
              Go to Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" leftIcon={<ArrowLeft size={18} />}>
              Go Back
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
}