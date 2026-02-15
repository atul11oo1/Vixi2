
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, UserProfile, Member, AppData, Disease, MedicalReport } from './types';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';
import Members from './screens/Members';
import MemberDetail from './screens/MemberDetail';
import Emergency from './screens/Emergency';
import AIAnalyzer from './screens/AIAnalyzer';
import QRShare from './screens/QRShare';
import PublicView from './screens/PublicView';
import Loader from './components/Loader';

const STORAGE_KEY = 'vixi_health_data';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [appData, setAppData] = useState<AppData>({
    user: null,
    members: [],
    onboardingSeen: true,
  });
  const [loading, setLoading] = useState(true);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [publicViewToken, setPublicViewToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAppData(parsed);
      setCurrentScreen(parsed.user ? Screen.DASHBOARD : Screen.LOGIN);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const navigate = useCallback((screen: Screen, params?: any) => {
    if (screen === Screen.PUBLIC_VIEW) {
      setPublicViewToken(params.token);
    }
    if (screen === Screen.MEMBER_DETAIL) {
      setActiveMemberId(params.id);
    }
    setCurrentScreen(screen);
  }, []);

  const handleLogin = useCallback((user: UserProfile) => {
    setAppData(prev => ({ ...prev, user }));
    navigate(Screen.DASHBOARD);
  }, [navigate]);

  const handleSignup = useCallback((user: UserProfile) => {
    setAppData(prev => ({ ...prev, user }));
    navigate(Screen.DASHBOARD);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setAppData(prev => ({ ...prev, user: null }));
    navigate(Screen.LOGIN);
  }, [navigate]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setAppData(prev => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, ...updates } };
    });
  }, []);

  const addMember = useCallback((member: Member) => {
    setAppData(prev => ({ ...prev, members: [...prev.members, member] }));
  }, []);

  const updateMember = useCallback((updatedMember: Member) => {
    setAppData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full h-screen relative overflow-hidden bg-slate-900 text-white select-none">
      {currentScreen === Screen.LOGIN && (
        <Login onLogin={handleLogin} onGoToSignup={() => navigate(Screen.SIGNUP)} />
      )}
      {currentScreen === Screen.SIGNUP && (
        <Signup onSignup={handleSignup} onGoToLogin={() => navigate(Screen.LOGIN)} />
      )}
      {currentScreen === Screen.DASHBOARD && appData.user && (
        <Dashboard 
          user={appData.user} 
          onNavigate={navigate} 
          onOpenProfile={() => navigate(Screen.PROFILE)} 
        />
      )}
      {currentScreen === Screen.PROFILE && appData.user && (
        <Profile 
          user={appData.user} 
          onUpdate={updateProfile} 
          onClose={() => navigate(Screen.DASHBOARD)} 
          onLogout={handleLogout}
        />
      )}
      {currentScreen === Screen.MEMBERS && (
        <Members 
          members={appData.members} 
          user={appData.user!}
          onAddMember={addMember} 
          onSelectMember={(id) => navigate(Screen.MEMBER_DETAIL, { id })}
          onBack={() => navigate(Screen.DASHBOARD)}
          onBuyPremium={() => navigate(Screen.PROFILE)}
        />
      )}
      {currentScreen === Screen.MEMBER_DETAIL && activeMemberId && (
        <MemberDetail 
          member={appData.members.find(m => m.id === activeMemberId)!} 
          onUpdateMember={updateMember}
          onBack={() => navigate(Screen.MEMBERS)}
        />
      )}
      {currentScreen === Screen.AMBULANCE && (
        <Emergency onBack={() => navigate(Screen.DASHBOARD)} />
      )}
      {currentScreen === Screen.AI_ANALYZER && (
        <AIAnalyzer members={appData.members} onBack={() => navigate(Screen.DASHBOARD)} />
      )}
      {currentScreen === Screen.QR_SHARE && (
        <QRShare 
          members={appData.members} 
          onBack={() => navigate(Screen.DASHBOARD)} 
          onShowPublicView={(token) => navigate(Screen.PUBLIC_VIEW, { token })}
        />
      )}
      {currentScreen === Screen.PUBLIC_VIEW && publicViewToken && (
        <PublicView 
          token={publicViewToken} 
          onBack={() => navigate(Screen.DASHBOARD)} 
        />
      )}
    </div>
  );
};

export default App;
