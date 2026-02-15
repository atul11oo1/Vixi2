
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  onLogin: (user: UserProfile) => void;
  onGoToSignup: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('vixi_health_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.user && data.user.email === email) {
          onLogin(data.user);
          return;
        }
      }
      onLogin({
        fullName: 'Lohit Kumar',
        email: email || 'lohit@vixi.health',
        age: '24',
        gender: 'Male',
        registrationDate: new Date().toLocaleDateString(),
        registrationTime: new Date().toLocaleTimeString(),
        isPremium: false
      });
    }, 1500);
  };

  return (
    <div className="h-full bg-slate-900 p-10 flex flex-col justify-center animate-fadeIn relative">
      {loading && <Loader />}
      
      <div className="text-center mb-16 relative">
        <div className="inline-flex w-24 h-24 bg-blue-600 rounded-[2.5rem] items-center justify-center mb-8 shadow-2xl shadow-blue-600/40 transform -rotate-6">
          <span className="text-4xl font-black italic tracking-tighter text-white">V</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white mb-2 italic">VIXI <span className="text-blue-500">HEALTH</span></h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Premium Medical Suite</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-12 text-white font-medium focus:ring-2 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-600"
            placeholder="Email Address"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-12 text-white font-medium focus:ring-2 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-600"
            placeholder="Password"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full h-18 bg-white text-slate-900 font-black text-lg rounded-[1.5rem] shadow-2xl shadow-white/5 active:scale-[0.98] transition-all mt-10 uppercase tracking-widest"
        >
          Sign In
        </button>

        <button 
          type="button"
          onClick={onGoToSignup}
          className="w-full h-16 border border-slate-700/50 text-slate-400 font-bold rounded-2xl active:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck size={18} className="text-blue-500" /> Create Free Account
        </button>
      </form>
      
      <div className="mt-16 flex items-center justify-center gap-2 text-slate-600">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
         <p className="text-[10px] font-black uppercase tracking-widest">Secured by AES-256</p>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
      </div>
    </div>
  );
};

export default Login;
