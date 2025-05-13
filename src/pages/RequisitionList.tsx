import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { mockRequisitions } from '../data/mockData';
import { Requisition, RequisitionStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RequisitionCard from '../components/requisition/RequisitionCard';
import RequisitionModal from '../components/requisition/RequisitionModal';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

interface LocationState {
  success?: boolean;
  message?: string;
}

export default function RequisitionList() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [filteredRequisitions, setFilteredRequisitions] = useState<Requisition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | 'all'>('all');
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [successMessage, setSuccessMessage] = useState(state?.success ? state.message : '');
  
  useEffect(() => {
    // In a real app, fetch data from API
    let filtered = [];
    
    if (user?.role === 'user') {
      // Users see their own requisitions
      filtered = mockRequisitions.filter(req => req.createdBy === user.id);
    } else {
      // Managers and admins see all requisitions
      filtered = [...mockRequisitions];
    }
    
    setRequisitions(filtered);
    setFilteredRequisitions(filtered);
  }, [user]);
  
  useEffect(() => {
    // Apply filters when search query or status filter changes
    let filtered = [...requisitions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        req => req.title.toLowerCase().includes(query) || 
               req.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    setFilteredRequisitions(filtered);
  }, [requisitions, searchQuery, statusFilter]);
  
  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  const handleRequisitionClick = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
  };
  
  const handleCloseModal = () => {
    setSelectedRequisition(null);
  };
  
  const statusOptions: { value: RequisitionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
  ];
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Requisitions</h1>
          <p className="text-neutral-600">View and manage your asset requisitions</p>
        </div>
        
        <Link to="/requisitions/new">
          <Button className="mt-4 sm:mt-0" leftIcon={<Plus size={16} />}>
            New Requisition
          </Button>
        </Link>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start animate-fade-in">
          <CheckCircle size={20} className="text-success-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-success-800">{successMessage}</p>
          </div>
        </div>
      )}
      
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search requisitions..."
              className="form-input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter size={18} className="text-neutral-500 mr-2" />
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'all')}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredRequisitions.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No requisitions found</h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? "No requisitions match your current filters. Try adjusting your search criteria."
                : "You haven't created any requisitions yet. Start by creating your first one!"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to="/requisitions/new">
                <Button leftIcon={<Plus size={16} />}>
                  Create Your First Requisition
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredRequisitions.map((requisition) => (
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
    </div>
  );
}