
import React, { useState, useRef } from 'react';
import { Member, Disease, MedicalReport, REPORT_TYPES } from '../types';
import { ArrowLeft, Plus, FileText, ChevronRight, X, Image as ImageIcon, Search } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  member: Member;
  onUpdateMember: (member: Member) => void;
  onBack: () => void;
}

const MemberDetail: React.FC<Props> = ({ member, onUpdateMember, onBack }) => {
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [newDiseaseName, setNewDiseaseName] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState<{type: string, fileData: string}>({type: 'Blood Test', fileData: ''});
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDisease = () => {
    if (!newDiseaseName) return;
    const disease: Disease = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDiseaseName,
      reports: []
    };
    onUpdateMember({
      ...member,
      diseases: [...member.diseases, disease]
    });
    setNewDiseaseName('');
    setShowAddDisease(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReport({ ...newReport, fileData: reader.result as string });
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReport = () => {
    if (!newReport.fileData || !selectedDisease) return;
    
    // Limits check: e.g., only 2 X-rays for specific demonstration if needed
    if (newReport.type === 'X-Ray') {
      const xrayCount = selectedDisease.reports.filter(r => r.type === 'X-Ray').length;
      if (xrayCount >= 2) {
        alert("Free limit: Max 2 X-Rays per disease. Please delete an older one or upgrade.");
      }
    }

    const report: MedicalReport = {
      id: Math.random().toString(36).substr(2, 9),
      type: newReport.type,
      date: new Date().toLocaleDateString(),
      fileData: newReport.fileData
    };

    const updatedDiseases = member.diseases.map(d => {
      if (d.id === selectedDisease.id) {
        return { ...d, reports: [...d.reports, report] };
      }
      return d;
    });

    onUpdateMember({ ...member, diseases: updatedDiseases });
    setNewReport({ type: 'Blood Test', fileData: '' });
    setShowAddReport(false);
    
    // Refresh local state if open
    setSelectedDisease(updatedDiseases.find(d => d.id === selectedDisease.id) || null);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col overflow-hidden relative">
      {processing && <Loader />}
      
      {/* Header */}
      <div className="p-6 pt-10 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md z-10">
        <button onClick={selectedDisease ? () => setSelectedDisease(null) : onBack} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold">{selectedDisease ? selectedDisease.name : member.name}</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest">{selectedDisease ? "Records" : member.relation}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
        {!selectedDisease ? (
          <>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Medical Conditions</h3>
            <div className="space-y-4">
              {member.diseases.map(disease => (
                <button
                  key={disease.id}
                  onClick={() => setSelectedDisease(disease)}
                  className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                    <Search size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-lg">{disease.name}</h4>
                    <p className="text-slate-400 text-xs">{disease.reports.length} Reports</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              ))}

              {showAddDisease ? (
                <div className="p-5 bg-slate-800 rounded-3xl border border-blue-500/30 animate-scaleIn">
                  <h4 className="font-bold mb-4">Add Condition</h4>
                  <input 
                    type="text"
                    autoFocus
                    value={newDiseaseName}
                    onChange={(e) => setNewDiseaseName(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes"
                    className="w-full h-12 bg-slate-700 rounded-xl px-4 text-white outline-none focus:ring-1 focus:ring-blue-500 mb-4"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddDisease(false)} className="flex-1 h-12 bg-slate-700 rounded-xl font-bold text-slate-400">Cancel</button>
                    <button onClick={handleAddDisease} className="flex-1 h-12 bg-blue-600 rounded-xl font-bold">Save</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddDisease(true)}
                  className="w-full py-5 border-2 border-dashed border-slate-700 text-slate-400 font-bold rounded-3xl flex items-center justify-center gap-2 active:text-blue-500 transition-all"
                >
                  <Plus size={20} /> Add Medical Condition
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {selectedDisease.reports.map(report => (
                <div key={report.id} className="bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/30">
                  <div className="h-32 bg-slate-700 overflow-hidden">
                    <img src={report.fileData} alt="report" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="p-3">
                    <h5 className="font-bold text-sm truncate">{report.type}</h5>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{report.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedDisease.reports.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No reports uploaded yet</p>
              </div>
            )}

            {showAddReport ? (
              <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl p-6 flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-full max-w-sm space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">New Report</h3>
                    <button onClick={() => setShowAddReport(false)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                      <X size={20} />
                    </button>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video w-full rounded-3xl bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-3 overflow-hidden"
                  >
                    {newReport.fileData ? (
                      <img src={newReport.fileData} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={40} className="text-slate-600" />
                        <p className="text-slate-500 font-bold">Select Image or Document</p>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                  <div>
                    <label className="block text-xs uppercase text-slate-500 font-bold mb-2 ml-1">Report Type</label>
                    <select 
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                      className="w-full h-14 bg-slate-800 border border-slate-700 rounded-2xl px-6 text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                    >
                      {REPORT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleAddReport}
                    disabled={!newReport.fileData}
                    className="w-full h-16 blue-gradient rounded-2xl font-bold shadow-xl shadow-blue-900/30 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    Upload Report
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddReport(true)}
                className="w-full py-6 blue-gradient rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40"
              >
                <Plus size={24} /> Upload New Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
