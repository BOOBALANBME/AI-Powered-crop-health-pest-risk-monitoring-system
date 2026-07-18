import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Activity, ClipboardList, Languages } from "lucide-react";
import { translations } from "../lib/translations";

const languages = [
  { code: "English", name: "English" },
  { code: "Tamil", name: "தமிழ் (Tamil)" },
  { code: "Hindi", name: "हिन्दी (Hindi)" },
  { code: "Telugu", name: "తెలుగు (Telugu)" },
  { code: "Kannada", name: "ಕನ್ನಡ (Kannada)" },
  { code: "Malayalam", name: "മലയാളം (Malayalam)" },
];

export default function Layout({ children, language, setLanguage }: { children: React.ReactNode, language: string, setLanguage: (l: string) => void }) {
  const navigate = useNavigate();
  const getUser = () => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("User parse error", e);
      return null;
    }
  };
  const user = getUser();
  const t = translations[language] || translations.English;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-brand-100 font-sans text-brand-950">
      <nav className="glass border-b border-brand-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center shadow-lg shadow-sage-200">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-semibold tracking-tight text-brand-900">{t.appName}</span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 bg-brand-200/50 px-4 py-2 rounded-full border border-brand-300/30">
                <Languages size={16} className="text-brand-600" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-brand-800"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              {user && (
                <div className="flex items-center gap-6 border-l border-brand-300/30 pl-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-brand-900">{user.fullName}</p>
                    <p className="text-[10px] text-brand-600 uppercase tracking-widest font-bold">{user.role === 'patient' ? t.patient : t.doctor}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    title={t.logout}
                    className="p-3 hover:bg-brand-200 rounded-full transition-all text-brand-600 active:scale-90"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {children}
      </main>
    </div>
  );
}
