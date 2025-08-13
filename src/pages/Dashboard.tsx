import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, Clock, Check, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import RequisitionCard from '../components/requisition/RequisitionCard';
import RequisitionModal from '../components/requisition/RequisitionModal';
import Button from '../components/ui/Button';
import { Requisition } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axios.get('http://server:5000/requisitions');
        let filteredData = response.data;
        if (user?.role === 'user') {
          filteredData = response.data.filter(req => req.createdBy._id === user.id);
        }
        setRequisitions(filteredData);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
      }
    };

    fetchRequisitions();
  }, [user]);
  
  const handleRequisitionClick = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
  };
  
  const handleCloseModal = () => {
    setSelectedRequisition(null);
  };
  
  // Get statistics based on requisitions
  const stats = {
    pending: requisitions.filter(r => r.status === 'pending').length,
    approved: requisitions.filter(r => r.status === 'approved').length,
    completed: requisitions.filter(r => r.status === 'completed').length,
    rejected: requisitions.filter(r => r.status === 'rejected').length,
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
          <p className="text-neutral-600">Here's an overview of your asset requisitions</p>
        </div>
        
        <Link to="/requisitions/new">
          <Button className="mt-4 sm:mt-0" leftIcon={<PlusCircle size={16} />}>
            New Requisition
          </Button>
        </Link>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-warning-100 text-warning-700 rounded-lg mr-3">
              <Clock size={20} />
            </div>
            <span className="font-medium">Pending</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.pending}</span>
            <span className="text-sm text-neutral-500">Awaiting Approval</span>
          </div>
        </div>
        
        <div className="card p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-success-100 text-success-700 rounded-lg mr-3">
              <Check size={20} />
            </div>
            <span className="font-medium">Approved</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.approved}</span>
            <span className="text-sm text-neutral-500">Ready for Processing</span>
          </div>
        </div>
        
        <div className="card p-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-primary-100 text-primary-700 rounded-lg mr-3">
              <FileText size={20} />
            </div>
            <span className="font-medium">Completed</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.completed}</span>
            <span className="text-sm text-neutral-500">Processed Items</span>
          </div>
        </div>
        
        <div className="card p-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-error-100 text-error-700 rounded-lg mr-3">
              <AlertCircle size={20} />
            </div>
            <span className="font-medium">Rejected</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.rejected}</span>
            <span className="text-sm text-neutral-500">Declined Requests</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Requisitions</h2>
        <div className="space-y-4">
          {requisitions.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-neutral-500 mb-4">No requisitions found</p>
              <Link to="/requisitions/new">
                <Button leftIcon={<PlusCircle size={16} />}>
                  Create Your First Requisition
                </Button>
              </Link>
            </div>
          ) : (
            requisitions.slice(0, 5).map((requisition) => (
              <RequisitionCard
                key={requisition.id}
                requisition={requisition}
                onClick={() => handleRequisitionClick(requisition)}
              />
            ))
          )}
        </div>
        
        {requisitions.length > 0 && (
          <div className="mt-4 text-center">
            <Link to="/requisitions">
              <Button variant="outline">
                View All Requisitions
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {selectedRequisition && (
        <RequisitionModal
          requisition={selectedRequisition}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}