import { FileText, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { Requisition } from '../../types';
import { formatDate, formatCurrency } from '../../lib/utils';
import StatusBadge from '../ui/StatusBadge';

interface RequisitionCardProps {
  requisition: Requisition;
  onClick?: () => void;
}

export default function RequisitionCard({ requisition, onClick }: RequisitionCardProps) {
  return (
    <div 
      className="card p-4 cursor-pointer hover:shadow-md transition duration-200 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-medium text-base">{requisition.title}</h3>
            <p className="text-sm text-neutral-600 line-clamp-1 mt-0.5">
              {requisition.description}
            </p>
          </div>
        </div>
        <StatusBadge status={requisition.status} />
      </div>
      
      <div className="mt-4 flex items-center text-sm text-neutral-600 space-x-4">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(requisition.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <DollarSign size={14} className="mr-1" />
          <span>{formatCurrency(requisition.totalCost)}</span>
        </div>
        <div className="flex items-center text-primary-600 ml-auto">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
}