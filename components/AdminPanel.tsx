
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, SubscriptionTier } from '../types';

const AdminPanel: React.FC<{setView: (view: string) => void}> = ({setView}) => {
    const { users, updateSubscription } = useAuth();
    
    return (
        <div className="space-y-8 text-white">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-bold text-shadow">Admin Panel</h2>
                <button onClick={() => setView('browse')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-semibold">
                    Back to Browse
                </button>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <h3 className="text-2xl font-semibold mb-4">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/20">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Subscription</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <UserRow key={user.id} user={user} onUpdateSubscription={updateSubscription} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Placeholder for future admin features like content management */}
        </div>
    );
};

const UserRow: React.FC<{user: User, onUpdateSubscription: (userId: number, tier: SubscriptionTier) => void}> = ({ user, onUpdateSubscription }) => {
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(user.subscription);

    const handleUpdate = () => {
        onUpdateSubscription(user.id, selectedTier);
        alert(`User ${user.name}'s subscription updated to ${selectedTier}.`);
    };

    return (
        <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
            <td className="p-3">{user.id}</td>
            <td className="p-3 font-semibold">{user.name}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3 capitalize">{user.subscription}</td>
            <td className="p-3">
                {!user.isAdmin && (
                <div className="flex items-center justify-end space-x-2">
                    <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value as SubscriptionTier)}
                        className="bg-white/10 border border-white/20 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {Object.values(SubscriptionTier).map(tier => (
                            <option key={tier} value={tier} className="bg-gray-800">{tier}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleUpdate}
                        disabled={selectedTier === user.subscription}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md transition font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Update
                    </button>
                </div>
                )}
            </td>
        </tr>
    );
};


export default AdminPanel;
