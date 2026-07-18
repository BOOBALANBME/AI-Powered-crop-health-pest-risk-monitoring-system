import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { Activity, User, Lock, Mail, UserPlus, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { translations } from "../lib/translations";

export default function Auth({ language }: { language: string }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const t = translations[language] || translations.English;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "patient",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { token, user } = await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate(user.role === "doctor" ? "/doctor" : "/patient");
      } else {
        await authApi.register(formData);
        setIsLogin(true);
        setError(t.registerSuccess);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-brand-100 overflow-hidden">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-sage-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sage-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-6xl font-serif font-light leading-tight mb-6">
              Nourishing <br />
              <span className="italic font-normal text-brand-300">Your Journey</span> <br />
              to Wellness.
            </h1>
            <p className="text-sage-200 text-lg leading-relaxed font-light">
              Experience personalized nutrition advice powered by advanced analytics and expert medical insights.
            </p>
          </motion.div>
          
          <div className="mt-12 flex gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  className="w-10 h-10 rounded-full border-2 border-sage-800"
                  referrerPolicy="no-referrer"
                  alt="User"
                />
              ))}
            </div>
            <p className="text-sm text-sage-300 self-center">
              Joined by <span className="text-white font-semibold">2,000+</span> health seekers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center shadow-lg shadow-sage-200">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-semibold tracking-tight text-brand-900">{t.appName}</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-serif font-bold text-brand-900 mb-2">
              {isLogin ? t.login : t.register}
            </h2>
            <p className="text-brand-600">
              {isLogin ? t.authDescriptionLogin : t.authDescriptionRegister}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl mb-8 text-sm font-medium ${error.includes("successful") || error === t.registerSuccess ? "bg-sage-50 text-sage-700 border border-sage-200" : "bg-red-50 text-red-700 border border-red-100"}`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1">{t.fullName}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 focus:border-transparent outline-none transition-all shadow-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1">{t.username}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                <input
                  type="text"
                  placeholder="username@example.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 focus:border-transparent outline-none transition-all shadow-sm"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 focus:border-transparent outline-none transition-all shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1">Account Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "patient" })}
                    className={`flex-1 py-4 rounded-2xl border font-medium transition-all ${formData.role === "patient" ? "bg-sage-600 border-sage-600 text-white shadow-lg shadow-sage-200" : "bg-white border-brand-200 text-brand-600 hover:border-brand-400"}`}
                  >
                    {t.patient}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "doctor" })}
                    className={`flex-1 py-4 rounded-2xl border font-medium transition-all ${formData.role === "doctor" ? "bg-sage-600 border-sage-600 text-white shadow-lg shadow-sage-200" : "bg-white border-brand-200 text-brand-600 hover:border-brand-400"}`}
                  >
                    {t.doctor}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-2xl shadow-xl shadow-brand-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? t.login : t.register}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-brand-200">
            <p className="text-brand-600 text-sm">
              {isLogin ? t.noAccount : t.hasAccount}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-sage-600 font-bold hover:text-sage-700 transition-colors"
              >
                {isLogin ? t.register : t.login}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
