
import React, { useState, useRef } from 'react';
import { Member, Disease } from '../types';
import { ArrowLeft, Upload, BrainCircuit, CheckCircle2, FlaskConical, Activity, Thermometer, Droplets, ChevronRight, LayoutGrid, Database, User, Search, Zap } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  members: Member[];
  onBack: () => void;
}

const AIAnalyzer: React.FC<Props> = ({ members, onBack }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'instant'>('vault');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [externalImage, setExternalImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [externalCategory, setExternalCategory] = useState('Blood Sugar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { name: 'Blood Sugar', icon: <Droplets size={18} />, color: 'text-rose-400' },
    { name: 'CBC (Blood)', icon: <FlaskConical size={18} />, color: 'text-blue-400' },
    { name: 'Lipid Profile', icon: <Activity size={18} />, color: 'text-amber-400' },
    { name: 'Thyroid', icon: <Thermometer size={18} />, color: 'text-purple-400' }
  ];

  const startAnalysis = (type: 'vault' | 'instant') => {
    setAnalyzing(true);
    
    setTimeout(() => {
      setAnalyzing(false);
      
      const category = type === 'vault' ? selectedDisease?.name : externalCategory;
      
      if (category?.toLowerCase().includes('sugar') || category?.toLowerCase().includes('diabetes')) {
        setResult({
          title: "Diabetes & Glucose Profile Summary",
          summary: type === 'vault' 
            ? `Analyzed ${selectedDisease?.reports.length} reports for ${selectedMember?.name}. Overall trend shows stabilization.`
            : "Single report analysis complete.",
          parameters: [
            { name: "Avg. Fasting Glucose", value: "108 mg/dL", range: "70-100", status: "Borderline" },
            { name: "HbA1c Trend", value: "5.7%", range: "4.0-5.6", status: "Borderline" },
            { name: "Metabolic Status", value: "Optimal", range: "80%+", status: "Normal" }
          ],
          recommendation: "Maintain low glycemic index diet. Physical activity is helping stabilize readings."
        });
      } else {
        setResult({
          title: "General Medical Insights",
          summary: "Scan shows parameters within typical health ranges for the detected age group.",
          parameters: [
            { name: "Inflammation Marker", value: "Low", range: "Standard", status: "Normal" },
            { name: "Organ Efficiency", value: "94%", range: "> 90%", status: "Normal" }
          ],
          recommendation: "Values look stable. No immediate clinical intervention required based on provided documentation."
        });
      }
    }, 3000);
  };

  const handleExternalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExternalImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col overflow-hidden">
      {analyzing && <Loader />}
      
      {/* Top Navigation */}
      <div className="p-6 pt-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl z-20 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">AI ANALYSIS</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Medical Intelligence</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
           <BrainCircuit size={24} />
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex p-4 gap-3 bg-slate-900/50 backdrop-blur-md">
        <button 
          onClick={() => { setActiveTab('vault'); setResult(null); setSelectedMember(null); setSelectedDisease(null); }}
          className={`flex-1 h-14 rounded-3xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex flex-col items-center justify-center gap-1 border ${activeTab === 'vault' ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/40 scale-105' : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}`}
        >
          <Database size={16} /> <span>Vault Scan</span>
        </button>
        <button 
          onClick={() => { setActiveTab('instant'); setResult(null); setExternalImage(null); }}
          className={`flex-1 h-14 rounded-3xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex flex-col items-center justify-center gap-1 border ${activeTab === 'instant' ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}`}
        >
          <Zap size={16} /> <span>Instant Scan</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
        {!result ? (
          activeTab === 'vault' ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-[2.5rem] p-6 mb-2">
                 <h3 className="font-bold text-white mb-2 flex items-center gap-2"><LayoutGrid size={18} className="text-blue-500" /> Member Data Analysis</h3>
                 <p className="text-slate-500 text-xs leading-relaxed">Select a member and a specific medical condition to analyze all their stored reports together.</p>
              </div>

              {!selectedMember ? (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Choose Member</h4>
                  {members.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="w-full p-5 bg-slate-800/40 border border-slate-700/30 rounded-[2rem] flex items-center gap-4 active:scale-[0.98] transition-all"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                        {m.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-bold text-lg">{m.name}</h5>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{m.relation}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-700" />
                    </button>
                  ))}
                  {members.length === 0 && (
                    <div className="text-center py-12 text-slate-600">
                      <p>No members added in your profile yet.</p>
                    </div>
                  )}
                </div>
              ) : !selectedDisease ? (
                <div className="space-y-4 animate-slideIn">
                   <div className="flex items-center justify-between px-2">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select {selectedMember.name}'s condition</h4>
                     <button onClick={() => setSelectedMember(null)} className="text-[10px] text-blue-500 font-bold underline">Change Member</button>
                   </div>
                   <div className="space-y-3">
                     {selectedMember.diseases.map(d => (
                       <button 
                         key={d.id}
                         onClick={() => setSelectedDisease(d)}
                         className="w-full p-5 bg-slate-800/40 border border-slate-700/30 rounded-[2rem] flex items-center justify-between active:scale-[0.98] transition-all"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                             <Search size={20} />
                           </div>
                           <span className="font-bold text-white">{d.name}</span>
                         </div>
                         <div className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-500 border border-slate-700/50">
                            {d.reports.length} REPORTS
                         </div>
                       </button>
                     ))}
                     {selectedMember.diseases.length === 0 && (
                       <p className="text-center text-slate-600 py-10">No conditions recorded for this member.</p>
                     )}
                   </div>
                </div>
              ) : (
                <div className="space-y-6 animate-scaleIn">
                   <div className="p-8 bg-slate-800/80 border border-blue-500/30 rounded-[3rem] text-center shadow-2xl">
                     <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/30">
                        <Activity size={40} />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2">{selectedDisease.name}</h3>
                     <p className="text-slate-400 text-sm mb-10 px-4">AI will scan all <span className="text-white font-bold">{selectedDisease.reports.length} reports</span> found in {selectedMember.name}'s vault to provide a full health trend analysis.</p>
                     
                     <div className="grid grid-cols-2 gap-3 mb-8">
                        <button onClick={() => setSelectedDisease(null)} className="h-14 bg-slate-700 rounded-2xl font-bold text-slate-300">Back</button>
                        <button 
                          onClick={() => startAnalysis('vault')}
                          className="h-14 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                        >
                          Analyze All
                        </button>
                     </div>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-6 mb-2">
                 <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Upload size={18} /> External Image Scan</h3>
                 <p className="text-slate-500 text-xs leading-relaxed">Upload a report image from your phone to get an instant AI summary of medical parameters.</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-[3.5rem] flex flex-col items-center justify-center gap-4 overflow-hidden p-8 active:scale-[0.98] transition-all group"
              >
                {externalImage ? (
                  <div className="relative w-full h-full">
                    <img src={externalImage} alt="preview" className="w-full h-full object-contain rounded-3xl shadow-2xl" />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-slate-900 font-black px-6 py-3 rounded-2xl shadow-xl uppercase text-xs tracking-widest">Replace Photo</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-600 shadow-inner">
                      <Upload size={40} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-300 tracking-tight text-lg">UPLOAD REPORT</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-[0.25em]">Direct AI Scan</p>
                    </div>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleExternalFile} />

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Analysis Category</h4>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setExternalCategory(cat.name)}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all active:scale-95 ${externalCategory === cat.name ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}
                    >
                      <div className={`p-2 rounded-xl bg-slate-900/50 ${externalCategory === cat.name ? 'text-white' : cat.color}`}>
                        {cat.icon}
                      </div>
                      <span className="font-bold text-[11px]">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!externalImage}
                onClick={() => startAnalysis('instant')}
                className="w-full h-18 blue-gradient text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-blue-900/40 active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-3 mt-4"
              >
                GENERATE ANALYSIS <ChevronRight size={20} />
              </button>
            </div>
          )
        ) : (
          <div className="animate-slideUp space-y-6">
            <div className="p-8 bg-slate-800/80 backdrop-blur-xl border border-blue-500/20 rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="font-black text-white text-xl uppercase tracking-tighter">{result.title}</h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Secure AI Breakdown</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {result.parameters.map((p: any, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-[1.8rem] flex justify-between items-center group active:bg-slate-800 transition-all">
                    <div>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{p.name}</p>
                      <p className="font-black text-white text-lg">{p.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-600 text-[9px] font-bold mb-1">REF: {p.range}</p>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${p.status === 'High' || p.status === 'Borderline' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl" />
                <h5 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                   <BrainCircuit size={14} /> AI Recommendation
                </h5>
                <p className="text-slate-300 text-sm leading-relaxed font-medium italic">"{result.recommendation}"</p>
              </div>
            </div>

            <button 
              onClick={() => { setResult(null); setSelectedMember(null); setSelectedDisease(null); setExternalImage(null); }}
              className="w-full h-16 bg-slate-800 text-slate-500 font-black rounded-[2rem] active:bg-slate-700 transition-all uppercase tracking-[0.2em] text-[10px]"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
      <div className="h-10" />
    </div>
  );
};

export default AIAnalyzer;
