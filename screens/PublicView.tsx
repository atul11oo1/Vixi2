
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, FileText, Download, ArrowLeft, Lock } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  token: string;
  onBack: () => void;
}

const PublicView: React.FC<Props> = ({ token, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    try {
      const decoded = atob(token).split(':');
      const expiryTime = parseInt(decoded[2]);
      const now = Date.now();
      
      if (now > expiryTime) {
        setLoading(false);
        alert("This sharing session has expired.");
        onBack();
        return;
      }

      setTimeLeft(Math.floor((expiryTime - now) / 1000));
      
      const saved = localStorage.getItem('vixi_health_data');
      if (saved) {
        const appData = JSON.parse(saved);
        const member = appData.members.find((m: any) => m.id === decoded[0]);
        const disease = member?.diseases.find((d: any) => d.id === decoded[1]);
        if (member && disease) {
          setData({ member, disease });
        }
      }
    } catch (e) {
      console.error("Token error", e);
    }
    setLoading(false);
  }, [token, onBack]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onBack]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <Loader />;
  if (!data) return (
    <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
        <Lock size={40} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
      <p className="text-slate-500 mb-8">This medical record link is invalid or has reached its time limit.</p>
      <button onClick={onBack} className="w-full h-14 bg-slate-800 rounded-2xl font-bold">Go to Dashboard</button>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 text-slate-900 flex flex-col animate-fadeIn overflow-y-auto no-scrollbar pb-12">
      <div className="blue-gradient p-10 text-white rounded-b-[3.5rem] shadow-[0_20px_50px_rgba(30,64,175,0.3)] relative overflow-hidden">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <button onClick={onBack} className="absolute top-10 left-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all border border-white/20">
          <ArrowLeft size={22} />
        </button>

        <div className="flex flex-col items-center text-center mt-12 relative z-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/30 shadow-2xl">
            <ShieldCheck size={48} className="text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter">VIXI SECURE</h2>
          <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mt-2">Authenticated Access</p>
        </div>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-16 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 border border-blue-50">
          <Clock className="text-blue-600 animate-pulse" size={24} />
          <span className="text-blue-900 font-black font-mono text-2xl tracking-tighter">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="px-6 pt-20 space-y-8">
        <div className="p-8 bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">
            {data.member.name[0]}
          </div>
          <div>
            <h4 className="font-black text-xl text-slate-900">{data.member.name}</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{data.member.relation}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{data.disease.name} Records</h3>
            <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">{data.disease.reports.length} Items</span>
          </div>
          
          <div className="space-y-4">
            {data.disease.reports.map((r: any) => (
              <div key={r.id} className="p-6 bg-white rounded-[2rem] shadow-[0_10px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-5 group active:bg-blue-50 transition-colors">
                <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 group-active:bg-white group-active:text-blue-500 transition-all">
                  <FileText size={28} />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800">{r.type}</h5>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">{r.date}</p>
                </div>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = r.fileData;
                    link.download = `VIXI_Report_${r.type}.png`;
                    link.click();
                  }}
                  className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <Download size={20} />
                </button>
              </div>
            ))}
            
            {data.disease.reports.length === 0 && (
              <div className="text-center py-16 bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No digital files attached to this record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-12 mb-8 flex flex-col items-center">
        <div className="w-12 h-1 bg-slate-200 rounded-full mb-6" />
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Blockchain Verified Security</p>
        <p className="text-slate-200 text-[9px] font-medium tracking-tight">E2E Encrypted Medical Data Portal</p>
      </div>
    </div>
  );
};

export default PublicView;
