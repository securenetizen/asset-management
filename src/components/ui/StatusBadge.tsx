import { getStatusColor } from '../../lib/utils';
import { RequisitionStatus } from '../../types';

interface StatusBadgeProps {
  status: RequisitionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  
  const getLabel = (status: RequisitionStatus) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <span className={`status-badge ${colorClass}`}>
      {getLabel(status)}
    </span>
  );
}