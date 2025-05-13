import { useState } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';
import Button from '../ui/Button';

interface UserManagementModalProps {
  onClose: () => void;
}

export default function UserManagementModal({ onClose }: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    department: ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user', department: '' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    // In a real app, this would be an API call
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">User Management</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowAddForm(true)}
              leftIcon={<UserPlus size={16} />}
            >
              Add New User
            </Button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input w-full"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <select
                      className="form-input w-full"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                      required
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add User
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error-600 hover:text-error-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}