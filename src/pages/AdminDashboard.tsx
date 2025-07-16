import { useState, useEffect } from 'react';
import axios from 'axios';
import { Requisition, User } from '../types';
import RequisitionCard from '../components/requisition/RequisitionCard';
import RequisitionModal from '../components/requisition/RequisitionModal';
import { Check, Package, CheckCircle, ClipboardList, UserPlus, Users } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import UserManagementModal from '../components/user/UserManagementModal';

export default function AdminDashboard() {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/requisitions');
        const approvedRequisitions = response.data.filter(
          req => req.status === 'approved'
        );
        setRequisitions(approvedRequisitions);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
      }
    };

    fetchRequisitions();
  }, []);
  
  const handleRequisitionClick = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
  };
  
  const handleCloseModal = () => {
    setSelectedRequisition(null);
  };
  
  const handleCompleteProcessing = (id: string) => {
    // In a real app, send to API
    setRequisitions(prevReqs => 
      prevReqs.filter(req => req.id !== id)
    );
  };
  
  // Calculate total value of approved requisitions
  const totalApprovedValue = requisitions.reduce((sum, req) => sum + req.totalCost, 0);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-neutral-600">Process approved requisitions and monitor procurements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-success-100 rounded-full mr-3">
              <Check size={20} className="text-success-700" />
            </div>
            <h2 className="text-lg font-semibold">Approved</h2>
          </div>
          <div className="text-3xl font-bold">{requisitions.length}</div>
          <p className="text-sm text-neutral-500 mt-1">Items awaiting processing</p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-primary-100 rounded-full mr-3">
              <Package size={20} className="text-primary-700" />
            </div>
            <h2 className="text-lg font-semibold">Processing</h2>
          </div>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-neutral-500 mt-1">Items being ordered</p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-secondary-100 rounded-full mr-3">
              <CheckCircle size={20} className="text-secondary-700" />
            </div>
            <h2 className="text-lg font-semibold">Completed</h2>
          </div>
          <div className="text-3xl font-bold">27</div>
          <p className="text-sm text-neutral-500 mt-1">Processed this quarter</p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-accent-100 rounded-full mr-3">
              <ClipboardList size={20} className="text-accent-700" />
            </div>
            <h2 className="text-lg font-semibold">Total Value</h2>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalApprovedValue)}</div>
          <p className="text-sm text-neutral-500 mt-1">Pending procurement</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Actions</h2>
        <div className="space-x-3">
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<UserPlus size={16} />}
            onClick={() => setShowUserModal(true)}
          >
            Manage Users
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<ClipboardList size={16} />}
          >
            Generate Reports
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {requisitions.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <Check size={48} className="text-success-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-neutral-500">
              There are no approved requisitions requiring processing at this time.
            </p>
          </div>
        ) : (
          requisitions.map((requisition) => (
            <RequisitionCard
              key={requisition.id}
              requisition={requisition}
              onClick={() => handleRequisitionClick(requisition)}
            />
          ))
        )}
      </div>
      
      {selectedRequisition && (
        <RequisitionModal
          requisition={selectedRequisition}
          onClose={handleCloseModal}
        />
      )}

      {showUserModal && (
        <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}
    </div>
  );
}