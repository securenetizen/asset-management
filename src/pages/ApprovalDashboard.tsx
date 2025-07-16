import { useState, useEffect } from 'react';
import axios from 'axios';
import { Requisition } from '../types';
import { Clock, Check, X } from 'lucide-react';
import RequisitionCard from '../components/requisition/RequisitionCard';
import RequisitionModal from '../components/requisition/RequisitionModal';
import { useAuth } from '../contexts/AuthContext';
import { generateId } from '../lib/utils';

export default function ApprovalDashboard() {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/requisitions');
        const pendingRequisitions = response.data.filter(
          req => req.status === 'pending'
        );
        setRequisitions(pendingRequisitions);
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
  
  const handleApprove = async (id: string, notes: string) => {
    try {
      await axios.post(`http://localhost:5000/requisitions/update/${id}`, {
        status: 'approved',
        approvedBy: user?._id,
        processingNotes: notes,
      });
      setRequisitions(prevReqs => prevReqs.filter(req => req._id !== id));
      setSuccessMessage('Requisition has been approved successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error approving requisition:', error);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await axios.post(`http://localhost:5000/requisitions/update/${id}`, {
        status: 'rejected',
        rejectedBy: user?._id,
        rejectionReason: reason,
      });
      setRequisitions(prevReqs => prevReqs.filter(req => req._id !== id));
      setSuccessMessage('Requisition has been rejected.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error rejecting requisition:', error);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Approval Dashboard</h1>
        <p className="text-neutral-600">Review and approve requisition requests</p>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-success-800">{successMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-warning-100 rounded-full mr-3">
              <Clock size={20} className="text-warning-700" />
            </div>
            <h2 className="text-lg font-semibold">Pending</h2>
          </div>
          <div className="text-3xl font-bold">{requisitions.length}</div>
          <p className="text-sm text-neutral-500 mt-1">Requests awaiting your review</p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-success-100 rounded-full mr-3">
              <Check size={20} className="text-success-700" />
            </div>
            <h2 className="text-lg font-semibold">Approved</h2>
          </div>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-neutral-500 mt-1">Requests you've approved this month</p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-error-100 rounded-full mr-3">
              <X size={20} className="text-error-700" />
            </div>
            <h2 className="text-lg font-semibold">Rejected</h2>
          </div>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-neutral-500 mt-1">Requests you've rejected this month</p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Requisitions Pending Approval</h2>
      
      <div className="space-y-4">
        {requisitions.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <Check size={48} className="text-success-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-neutral-500">
              There are no pending requisitions requiring your approval at this time.
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
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}