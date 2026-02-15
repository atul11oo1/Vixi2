
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MapPin, Star, MessageSquare, Truck } from 'lucide-react';
import Loader from '../components/Loader';

interface Props {
  onBack: () => void;
}

const Emergency: React.FC<Props> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const hospitals = [
    { name: "City Care Hospital", rating: 4.8, distance: "1.2 km", phone: "+91 9876543210", whatsapp: "+91 9876543210" },
    { name: "LifeLine Medical Center", rating: 4.5, distance: "2.4 km", phone: "+91 8876543211", whatsapp: "+91 8876543211" },
    { name: "VIXI Specialized Clinic", rating: 4.9, distance: "3.1 km", phone: "+91 7776543212", whatsapp: "+91 7776543212" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleShareLocation = (whatsapp: string) => {
    const googleMapsUrl = location 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : `My Current Location`;
    const message = encodeURIComponent(`Emergency! Need an ambulance. My location: ${googleMapsUrl}`);
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-6 overflow-y-auto no-scrollbar">
      {loading && <Loader />}
      
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Ambulance Hub</h2>
      </div>

      <div className="bg-rose-600 rounded-[2.5rem] p-8 shadow-2xl shadow-rose-900/30 mb-8 relative overflow-hidden group">
        <Truck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Priority Service</span>
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter text-white mb-1">AMBULANCE</h3>
          <p className="text-rose-100 text-sm font-medium">Nearest response: <span className="font-black">~4-7 mins</span></p>
        </div>
      </div>

      <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Local Health Centers</h3>
      
      <div className="space-y-4 mb-8">
        {hospitals.map((h, i) => (
          <div key={i} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-[2rem] p-6 shadow-xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h4 className="font-bold text-lg text-white">{h.name}</h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-black bg-amber-400/10 px-2.5 py-1 rounded-lg">
                    <Star size={10} fill="currentColor" /> {h.rating}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <MapPin size={10} className="text-rose-500" /> {h.distance}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a href={`tel:${h.phone}`} className="h-14 bg-slate-700/80 rounded-2xl flex items-center justify-center gap-2 text-white font-bold active:bg-slate-600 transition-all shadow-lg border border-slate-600/30">
                <Phone size={18} /> Call
              </a>
              <button 
                onClick={() => handleShareLocation(h.whatsapp)}
                className="h-14 bg-emerald-600 rounded-2xl flex items-center justify-center gap-2 text-white font-bold active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
              >
                <MessageSquare size={18} /> WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto text-center p-6 border-t border-slate-800/50">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em]">
          Current Location Detected
        </p>
        <p className="text-slate-400 text-xs font-medium mt-1">
          {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting GPS...'}
        </p>
      </div>
    </div>
  );
};

export default Emergency;
