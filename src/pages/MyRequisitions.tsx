import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Requisition } from '../types';
import RequisitionCard from '../components/requisition/RequisitionCard';
import RequisitionModal from '../components/requisition/RequisitionModal';
import Button from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';

export default function MyRequisitions() {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequisitions = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://server:5000/requisitions?createdBy=${user._id}`);
        setRequisitions(response.data);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Requisitions</h1>
          <p className="text-neutral-600">A list of all your asset requisitions</p>
        </div>

        <Link to="/requisitions/new">
          <Button className="mt-4 sm:mt-0" leftIcon={<PlusCircle size={16} />}>
            New Requisition
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {requisitions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-500 mb-4">You haven't created any requisitions yet.</p>
            <Link to="/requisitions/new">
              <Button leftIcon={<PlusCircle size={16} />}>
                Create Your First Requisition
              </Button>
            </Link>
          </div>
        ) : (
          requisitions.map((requisition) => (
            <RequisitionCard
              key={requisition._id}
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
