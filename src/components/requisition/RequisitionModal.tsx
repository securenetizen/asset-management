import { X, Download, CheckCircle, XCircle, Printer } from 'lucide-react';
import { Requisition } from '../../types';
import { formatDate, formatCurrency } from '../../lib/utils';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { useState, useRef } from 'react';

interface RequisitionModalProps {
  requisition: Requisition;
  onClose: () => void;
  onApprove?: (id: string, notes: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export default function RequisitionModal({ 
  requisition, 
  onClose,
  onApprove,
  onReject
}: RequisitionModalProps) {
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleApprove = () => {
    if (onApprove) {
      onApprove(requisition.id, notes);
    }
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject(requisition.id, reason);
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Generate PDF
  const handleExportPdf = () => {
    alert('Exporting as PDF...');
    // In a real application, this would use react-to-pdf to generate the PDF
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-in"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{requisition.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <StatusBadge status={requisition.status} />
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={handleExportPdf}
            >
              Export as PDF
            </Button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-2">Request Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-500">Submitted by</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Department</p>
                  <p className="font-medium">Marketing</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Date Submitted</p>
                  <p className="font-medium">{formatDate(requisition.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total Cost</p>
                  <p className="font-medium">{formatCurrency(requisition.totalCost)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Description</p>
                <p className="mt-1">{requisition.description}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-3">Requested Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Unit Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {requisition.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-neutral-500">{item.description}</p>
                            <p className="text-xs text-neutral-600 mt-1">
                              <span className="font-medium">Justification:</span> {item.justification}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(item.estimatedCost)}</td>
                        <td className="px-4 py-3 text-sm">
                          {formatCurrency(item.quantity * item.estimatedCost)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-neutral-50">
                      <td colSpan={3} className="px-4 py-2 text-right font-medium">Total</td>
                      <td className="px-4 py-2 font-semibold">{formatCurrency(requisition.totalCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {requisition.status === 'approved' && (
              <section className="bg-success-50 p-4 rounded-lg border border-success-200">
                <div className="flex items-start">
                  <CheckCircle className="text-success-600 mt-0.5 mr-2" size={20} />
                  <div>
                    <h4 className="font-medium text-success-800">Approved</h4>
                    <p className="text-sm text-success-700 mt-1">
                      This request was approved on {requisition.approvedAt ? formatDate(requisition.approvedAt) : 'N/A'} by Manager.
                    </p>
                    {requisition.processingNotes && (
                      <p className="text-sm mt-2 text-success-700">
                        <span className="font-medium">Notes:</span> {requisition.processingNotes}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {requisition.status === 'rejected' && (
              <section className="bg-error-50 p-4 rounded-lg border border-error-200">
                <div className="flex items-start">
                  <XCircle className="text-error-600 mt-0.5 mr-2" size={20} />
                  <div>
                    <h4 className="font-medium text-error-800">Rejected</h4>
                    <p className="text-sm text-error-700 mt-1">
                      This request was rejected on {requisition.rejectedAt ? formatDate(requisition.rejectedAt) : 'N/A'} by Manager.
                    </p>
                    {requisition.rejectionReason && (
                      <p className="text-sm mt-2 text-error-700">
                        <span className="font-medium">Reason:</span> {requisition.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Approval Actions - only shown for pending requisitions when approval functionality is available */}
            {requisition.status === 'pending' && onApprove && onReject && (
              <section className="border-t pt-4">
                <div className="flex justify-end space-x-3">
                  {!showApproveForm && !showRejectForm && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRejectForm(true)}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => setShowApproveForm(true)}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </div>

                {showApproveForm && (
                  <div className="mt-4 p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-medium mb-2">Approve Requisition</h4>
                    <textarea
                      className="form-input w-full h-24 mb-3"
                      placeholder="Add any notes or instructions for this approval (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowApproveForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        leftIcon={<CheckCircle size={16} />}
                        onClick={handleApprove}
                      >
                        Confirm Approval
                      </Button>
                    </div>
                  </div>
                )}

                {showRejectForm && (
                  <div className="mt-4 p-4 border rounded-lg animate-fade-in">
                    <h4 className="font-medium mb-2">Reject Requisition</h4>
                    <textarea
                      className="form-input w-full h-24 mb-3"
                      placeholder="Please provide a reason for rejection"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRejectForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        leftIcon={<XCircle size={16} />}
                        onClick={handleReject}
                        disabled={!reason.trim()}
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Print option */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                leftIcon={<Printer size={16} />}
                onClick={() => window.print()}
              >
                Print this document
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}