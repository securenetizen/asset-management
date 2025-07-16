const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requisitionItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  estimatedCost: { type: Number, required: true },
  justification: { type: String, required: true },
});

const requisitionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  items: [requisitionItemSchema],
  totalCost: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'pending', 'approved', 'rejected', 'processing', 'completed'],
    default: 'draft'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  processingNotes: { type: String },
}, {
  timestamps: true,
});

const Requisition = mongoose.model('Requisition', requisitionSchema);

module.exports = Requisition;
