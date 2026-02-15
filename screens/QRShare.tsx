
import React, { useState } from 'react';
import { Member, Disease } from '../types';
import { ArrowLeft, QrCode, Clock, ShieldCheck, Share2, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  members: Member[];
  onBack: () => void;
  onShowPublicView: (token: string) => void;
}

const QRShare: React.FC<Props> = ({ members, onBack, onShowPublicView }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [expiry, setExpiry] = useState(10); // minutes
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: member, 2: details, 3: finalize

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Generate a mock token: memberId:diseaseId:expiryTimestamp
      const token = btoa(`${selectedMember?.id}:${selectedDisease?.id}:${Date.now() + expiry * 60000}`);
      onShowPublicView(token);
    }, 2000);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-6 overflow-y-auto no-scrollbar">
      {loading && <Loader />}
      
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : onBack()} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Secure Share</h2>
      </div>

      <div className="flex justify-between items-center mb-10 px-8 relative">
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-800 -z-0" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : 'bg-slate-800 text-slate-600'}`}>
              {i}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? 'text-blue-500' : 'text-slate-600'}`}>
              {i === 1 ? 'Select' : i === 2 ? 'Details' : 'Finish'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-slideIn">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Family Members</h3>
          {members.map(m => (
            <button 
              key={m.id}
              onClick={() => { setSelectedMember(m); setStep(2); }}
              className={`w-full p-5 rounded-[2rem] border text-left flex items-center gap-4 transition-all active:scale-[0.98] ${selectedMember?.id === m.id ? 'bg-blue-600/10 border-blue-500/50 shadow-xl' : 'bg-slate-800/40 border-slate-700/50 shadow-md'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedMember?.id === m.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                <div className="text-xl font-black uppercase">{m.name[0]}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-white">{m.name}</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{m.relation}</p>
              </div>
              <ChevronRight size={18} className="text-slate-700" />
            </button>
          ))}
          {members.length === 0 && (
             <div className="text-center py-16 bg-slate-800/30 rounded-[2.5rem] border border-slate-700/30 border-dashed">
               <QrCode size={40} className="mx-auto text-slate-700 mb-4" />
               <p className="text-slate-500 font-bold px-8">No members found. Add family members to share their reports.</p>
             </div>
          )}
        </div>
      )}

      {step === 2 && selectedMember && (
        <div className="space-y-8 animate-slideIn">
          <div>
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Select Condition</h3>
            <div className="space-y-3">
              {selectedMember.diseases.map(d => (
                <button 
                  key={d.id}
                  onClick={() => setSelectedDisease(d)}
                  className={`w-full p-5 rounded-3xl border text-left flex items-center gap-4 transition-all active:scale-[0.98] ${selectedDisease?.id === d.id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl' : 'bg-slate-800/40 border-slate-700/50 shadow-md'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedDisease?.id === d.id ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-bold text-white">{d.name}</h4>
                </button>
              ))}
              {selectedMember.diseases.length === 0 && (
                <div className="text-center p-8 bg-slate-800/20 rounded-3xl border border-slate-700/30">
                  <p className="text-slate-500 font-bold">No conditions found for {selectedMember.name}.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Access Duration</h3>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 60].map(t => (
                <button
                  key={t}
                  onClick={() => setExpiry(t)}
                  className={`py-5 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg ${expiry === t ? 'bg-blue-600 text-white shadow-blue-900/40 scale-105' : 'bg-slate-800 text-slate-500 border border-slate-700/50'}`}
                >
                  {t} MINS
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!selectedDisease}
            onClick={() => setStep(3)}
            className="w-full h-16 blue-gradient rounded-3xl font-black text-white shadow-2xl shadow-blue-900/50 disabled:opacity-20 active:scale-95 transition-all"
          >
            CONFIRM SELECTION
          </button>
        </div>
      )}

      {step === 3 && selectedMember && selectedDisease && (
        <div className="flex-1 flex flex-col justify-center animate-slideUp">
          <div className="p-8 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Share2 size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Generate Code</h3>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">
              Providing <span className="text-blue-400 font-black">{expiry} mins</span> access to <span className="text-white font-black">{selectedMember.name}'s</span> records for <span className="text-indigo-400 font-black">{selectedDisease.name}</span>.
            </p>
            
            <div className="flex items-center justify-center gap-3 bg-slate-900/80 p-5 rounded-3xl mb-10 border border-slate-700/30 shadow-inner">
              <Clock className="text-amber-500 animate-pulse" size={20} />
              <span className="text-slate-200 font-black font-mono tracking-widest uppercase">Safe & Secure</span>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full h-16 blue-gradient rounded-3xl font-black text-lg shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <QrCode size={26} /> GENERATE QR
            </button>
          </div>
        </div>
      )}
      <div className="h-10" />
    </div>
  );
};

export default QRShare;
