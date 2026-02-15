
import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { X, LogOut, Camera, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
  onLogout: () => void;
}

const Profile: React.FC<Props> = ({ user, onUpdate, onClose, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = React.useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ photo: reader.result as string });
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuyPremium = () => {
    setProcessing(true);
    setTimeout(() => {
      onUpdate({ isPremium: true });
      setProcessing(false);
      alert("Successfully upgraded to Premium! You can now add more members.");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 animate-slideUp overflow-y-auto no-scrollbar">
      {processing && <Loader />}
      
      <div className="p-6 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold">Profile</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-blue-600 overflow-hidden shadow-2xl p-1">
              {user.photo ? (
                <img src={user.photo} alt="profile" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white uppercase">
                  {user.fullName[0]}
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-slate-900 rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-all border-4 border-slate-900"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
          </div>
          <h3 className="mt-4 text-2xl font-bold">{user.fullName}</h3>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Age</p>
              <p className="text-lg font-bold">{user.age} Years</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Gender</p>
              <p className="text-lg font-bold">{user.gender}</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Registered Since</p>
            <p className="font-bold">{user.registrationDate} at {user.registrationTime}</p>
          </div>

          {!user.isPremium ? (
            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <ShieldCheck size={24} />
                <h4 className="font-bold text-lg">Premium Membership</h4>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Add up to 10 family members
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Unlimited AI report analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Priority ambulance fetching
                </li>
              </ul>
              <button 
                onClick={handleBuyPremium}
                className="w-full h-14 blue-gradient rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
              >
                <CreditCard size={20} /> Upgrade for ₹29
              </button>
            </div>
          ) : (
            <div className="p-6 blue-gradient rounded-3xl shadow-xl shadow-blue-900/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">Premium Active</h4>
                <p className="text-white/80 text-sm">Valid indefinitely</p>
              </div>
              <ShieldCheck size={32} className="text-white" />
            </div>
          )}

          <div className="h-4" />
          
          <button 
            onClick={onLogout}
            className="w-full h-14 bg-red-500/10 text-red-400 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-500/20 active:bg-red-500/20 transition-all mb-12"
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
