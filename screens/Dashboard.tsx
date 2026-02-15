
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Users, FileSearch, QrCode, Truck, Heart, ChevronRight } from 'lucide-react';

interface Props {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onOpenProfile: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onNavigate, onOpenProfile }) => {
  const cards = [
    {
      id: Screen.MEMBERS,
      title: "My Members",
      subtitle: "Family & Self",
      icon: <Users className="text-blue-400" size={28} />,
      color: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      id: Screen.AI_ANALYZER,
      title: "AI Analysis",
      subtitle: "Smart Report",
      icon: <FileSearch className="text-purple-400" size={28} />,
      color: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      id: Screen.QR_SHARE,
      title: "QR Share",
      subtitle: "Secure Access",
      icon: <QrCode className="text-emerald-400" size={28} />,
      color: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      id: Screen.AMBULANCE,
      title: "Ambulance",
      subtitle: "SOS Services",
      icon: <Truck className="text-rose-400" size={28} />,
      color: "bg-rose-500/10",
      border: "border-rose-500/20"
    }
  ];

  return (
    <div className="h-full bg-slate-900 flex flex-col p-6 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic tracking-tighter text-white shadow-lg shadow-blue-600/30">
            V
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">VIXI Health</p>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">Hi, {user.fullName.split(' ')[0]}</h2>
          </div>
        </div>
        <button 
          onClick={onOpenProfile}
          className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 p-0.5 shadow-xl active:scale-95 transition-all"
        >
          {user.photo ? (
            <img src={user.photo} alt="profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-full">
              {user.fullName[0]}
            </div>
          )}
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Medical Hub</h3>
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className={`flex flex-col items-start p-5 bg-slate-800/40 backdrop-blur-md border ${card.border} rounded-[2rem] text-left active:scale-[0.97] transition-all shadow-xl hover:bg-slate-800`}
            >
              <div className={`p-3.5 rounded-2xl mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <h4 className="font-bold text-base leading-tight mb-1">{card.title}</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{card.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Care section */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Nearby Support</h3>
        <div 
          onClick={() => onNavigate(Screen.AMBULANCE)}
          className="group p-5 bg-slate-800/40 border border-slate-700/30 rounded-[2rem] flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <Heart size={28} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-100 text-lg">Hospital Finder</h4>
            <p className="text-slate-500 text-xs">Find 4.5+ rated health centers</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
