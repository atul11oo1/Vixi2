
import React, { useState } from 'react';
import { Member, UserProfile } from '../types';
import { ArrowLeft, Plus, User, ShieldAlert, ChevronRight } from 'lucide-react';

interface Props {
  members: Member[];
  user: UserProfile;
  onAddMember: (member: Member) => void;
  onSelectMember: (id: string) => void;
  onBack: () => void;
  onBuyPremium: () => void;
}

const Members: React.FC<Props> = ({ members, user, onAddMember, onSelectMember, onBack, onBuyPremium }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: 'Self' });

  const freeLimit = 2;
  const canAddMore = user.isPremium || members.length < freeLimit;

  const handleAdd = () => {
    if (!newMember.name) return;
    onAddMember({
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      relation: newMember.relation,
      diseases: []
    });
    setNewMember({ name: '', relation: 'Self' });
    setShowAddForm(false);
  };

  return (
    <div className="h-full bg-slate-900 p-6 flex flex-col overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">My Members</h2>
      </div>

      <div className="space-y-4 mb-8">
        {members.map(member => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member.id)}
            className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <User size={24} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-lg">{member.name}</h4>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{member.relation}</p>
            </div>
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        ))}

        {members.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-700">
              <User size={40} />
            </div>
            <p className="text-slate-500 font-medium">No members added yet</p>
          </div>
        )}
      </div>

      {showAddForm ? (
        <div className="p-6 bg-slate-800 rounded-3xl border border-blue-500/30 animate-scaleIn">
          <h3 className="font-bold text-xl mb-4">Add Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Member Name</label>
              <input 
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full h-12 bg-slate-700 border-none rounded-xl px-4 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Relation</label>
              <select 
                value={newMember.relation}
                onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                className="w-full h-12 bg-slate-700 border-none rounded-xl px-4 text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
              >
                <option value="Self">Self</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 h-12 bg-slate-700 rounded-xl font-bold text-slate-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 h-12 bg-blue-600 rounded-xl font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : (
        canAddMore ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-6 border-2 border-dashed border-slate-700 text-slate-400 font-bold rounded-3xl flex flex-col items-center justify-center gap-2 active:border-blue-500 active:text-blue-500 transition-all mb-8"
          >
            <Plus size={32} />
            Add New Member
          </button>
        ) : (
          <div 
            onClick={onBuyPremium}
            className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3 text-amber-500 mb-2">
              <ShieldAlert size={20} />
              <h4 className="font-bold">Member Limit Reached</h4>
            </div>
            <p className="text-slate-400 text-sm">Free accounts are limited to {freeLimit} members. Upgrade to Premium to add up to 10 family members.</p>
            <button className="mt-4 text-amber-500 font-bold text-sm flex items-center gap-1 uppercase tracking-wider">
              Upgrade Now <ChevronRight size={14} />
            </button>
          </div>
        )
      )}
      <div className="h-10" />
    </div>
  );
};

export default Members;
