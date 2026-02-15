
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, User, Mail, Lock, Calendar, ChevronDown } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  onSignup: (user: UserProfile) => void;
  onGoToLogin: () => void;
}

const Signup: React.FC<Props> = ({ onSignup, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        ...formData,
        registrationDate: new Date().toLocaleDateString(),
        registrationTime: new Date().toLocaleTimeString(),
        isPremium: false
      };
      onSignup(newUser);
    }, 1500);
  };

  const inputStyle = "w-full h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-12 text-white font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 backdrop-blur-sm";

  return (
    <div className="h-full bg-slate-900 p-8 flex flex-col animate-slideUp overflow-y-auto no-scrollbar pb-16">
      {loading && <Loader />}
      
      <div className="pt-4 mb-10">
        <button onClick={onGoToLogin} className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-white active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tight text-white italic">JOIN <span className="text-blue-500">VIXI</span></h2>
        <p className="text-slate-400 mt-2 font-medium">Create your secure medical profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className={inputStyle}
            placeholder="Full Name"
            required
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={inputStyle}
            placeholder="Email Address"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-12 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
              placeholder="Age"
              required
            />
          </div>
          <div className="relative group">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className={inputStyle}
            placeholder="Password"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full h-18 bg-blue-600 text-white font-black text-lg rounded-[1.5rem] shadow-2xl shadow-blue-900/40 active:scale-[0.98] transition-all mt-8 uppercase tracking-widest"
        >
          Register Now
        </button>
      </form>
      
      <div className="h-10" />
    </div>
  );
};

export default Signup;
