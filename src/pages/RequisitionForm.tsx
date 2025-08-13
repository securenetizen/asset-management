import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2, Save, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { RequisitionFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Define validation schema
const requisitionItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  estimatedCost: z.number().min(0, 'Cost cannot be negative'),
  justification: z.string().min(1, 'Justification is required'),
});

const requisitionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  items: z.array(requisitionItemSchema).min(1, 'At least one item is required'),
});

export default function RequisitionForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<RequisitionFormData>({
    resolver: zodResolver(requisitionSchema),
    defaultValues: {
      title: '',
      description: '',
      items: [{ name: '', description: '', quantity: 1, estimatedCost: 0, justification: '' }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  
  const onSubmit = async (data: RequisitionFormData) => {
    setIsSubmitting(true);
    
    try {
      const totalCost = data.items.reduce((acc, item) => acc + item.quantity * item.estimatedCost, 0);
      const requisitionData = {
        ...data,
        totalCost,
        createdBy: user?._id,
      };

      await axios.post('http://server:5000/requisitions/add', requisitionData);
      
      navigate('/requisitions', { state: { success: true, message: 'Requisition submitted successfully!' } });
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };
  
  const addItem = () => {
    append({ name: '', description: '', quantity: 1, estimatedCost: 0, justification: '' });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-neutral-600 hover:text-primary-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold mt-2">New Requisition</h1>
        <p className="text-neutral-600">Fill out the form to request new assets</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Request Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="form-label">Request Title</label>
              <input
                id="title"
                type="text"
                className="form-input w-full"
                placeholder="e.g., New Laptop for Design Team"
                {...register('title')}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                rows={3}
                className="form-input w-full"
                placeholder="Provide a detailed description of what you're requesting and why"
                {...register('description')}
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Requested Items</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle size={16} />}
              onClick={addItem}
            >
              Add Item
            </Button>
          </div>
          
          {errors.items?.message && (
            <p className="form-error mb-4">{errors.items.message}</p>
          )}
          
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg mb-4 animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Item {index + 1}</h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-error-600 hover:text-error-800"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="e.g., Laptop, Monitor, etc."
                      {...register(`items.${index}.name`)}
                    />
                    {errors.items?.[index]?.name && (
                      <p className="form-error">{errors.items[index]?.name?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Model, specifications, etc."
                      {...register(`items.${index}.description`)}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="form-error">{errors.items[index]?.description?.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input w-full"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="form-error">{errors.items[index]?.quantity?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Estimated Cost Per Unit ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input w-full"
                      {...register(`items.${index}.estimatedCost`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.estimatedCost && (
                      <p className="form-error">{errors.items[index]?.estimatedCost?.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Justification</label>
                  <textarea
                    rows={2}
                    className="form-input w-full"
                    placeholder="Why is this item needed?"
                    {...register(`items.${index}.justification`)}
                  />
                  {errors.items?.[index]?.justification && (
                    <p className="form-error">{errors.items[index]?.justification?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              variant="outline"
              leftIcon={<PlusCircle size={16} />}
              onClick={addItem}
            >
              Add Another Item
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftIcon={<Save size={16} />}
            isLoading={isSubmitting}
          >
            Submit Requisition
          </Button>
        </div>
      </form>
    </div>
  );
}