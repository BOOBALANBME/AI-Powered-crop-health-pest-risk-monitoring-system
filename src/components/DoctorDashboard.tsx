import React, { useState, useEffect } from "react";
import { doctorApi } from "../lib/api";
import { 
  CheckCircle, Clock, FileText, User, 
  Activity, ClipboardList, ChevronRight, 
  AlertCircle, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "../lib/translations";

export default function DoctorDashboard({ language = "English" }: { language?: string }) {
  const [pendingPlans, setPendingPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);

  const t = translations[language] || translations.English;

  useEffect(() => {
    loadPending();
  }, []);

  const safeParse = (data: any, fallback: any = {}) => {
    if (!data) return fallback;
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("JSON parse error", e, data);
      return fallback;
    }
  };

  const loadPending = async () => {
    try {
      const plans = await doctorApi.getPendingPlans();
      setPendingPlans(plans.map((plan: any) => ({
        ...plan,
        plan_data: safeParse(plan.plan_data),
        extracted_data: safeParse(plan.extracted_data)
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (planId: number) => {
    setApproving(planId);
    try {
      await doctorApi.approvePlan(planId);
      setPendingPlans(pendingPlans.filter(p => p.id !== planId));
    } catch (e) {
      alert("Approval failed");
    } finally {
      setApproving(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-sage-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-sage-100" />
      <p className="text-brand-600 font-serif text-xl italic animate-pulse">{t.analyzing}</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-serif font-bold text-brand-900 tracking-tight">{t.doctorDashboard}</h2>
          <p className="text-brand-600 mt-2 text-lg font-light">{t.reviewDescription}</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-brand-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-sage-600 rounded-2xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-sage-100">
            {pendingPlans.length}
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400">Status</span>
            <span className="font-serif text-lg font-bold text-brand-900 leading-none">{t.pendingReviews}</span>
          </div>
        </div>
      </div>

      {pendingPlans.length === 0 ? (
        <div className="card-organic py-24 text-center">
          <div className="w-24 h-24 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="text-sage-600 w-12 h-12" />
          </div>
          <h3 className="text-3xl font-serif font-bold mb-3 text-brand-900">{t.allCaughtUp}</h3>
          <p className="text-brand-600 text-lg font-light italic">{t.noPendingPlans}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {pendingPlans.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-organic !p-0 overflow-hidden"
            >
              <div className="p-8 border-b border-brand-100 flex flex-col lg:flex-row justify-between items-center gap-8 bg-brand-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-sage-600 rounded-[2rem] flex items-center justify-center text-white font-serif font-bold text-3xl shadow-xl shadow-sage-100">
                    {plan.patient_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-brand-900">{plan.patient_name}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-brand-500 mt-2">
                      <span className="flex items-center gap-2 font-medium"><Clock size={16} className="text-brand-400" /> {new Date(plan.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2 font-medium"><FileText size={16} className="text-brand-400" /> Report ID: <span className="font-mono text-brand-600">{plan.report_id}</span></span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleApprove(plan.id)}
                  disabled={approving === plan.id}
                  className="w-full lg:w-auto px-10 py-5 bg-sage-600 text-white font-bold rounded-full hover:bg-sage-700 transition-all shadow-xl shadow-sage-100 flex items-center justify-center gap-3 text-lg active:scale-95 disabled:opacity-50"
                >
                  {approving === plan.id ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={24} /> {t.approvePlan}
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2">
                {/* Lab Values Section */}
                <div className="p-8 border-r border-brand-100 bg-brand-50/30">
                  <h4 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3 text-brand-900">
                    <Activity size={22} className="text-sage-600" /> {t.extractedLabValues}
                  </h4>
                  <div className="bg-white rounded-[2rem] border border-brand-200 p-8 shadow-inner">
                    <pre className="text-xs font-mono text-brand-700 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(safeParse(plan.extracted_data), null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Diet Chart Section */}
                <div className="p-8">
                  <h4 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3 text-brand-900">
                    <ClipboardList size={22} className="text-sage-600" /> {t.personalizedDietChart}
                  </h4>
                  <div className="space-y-5">
                    {plan.plan_data.dietChart.map((meal: any, idx: number) => (
                      <div key={idx} className="flex gap-6 p-6 rounded-[2rem] border border-brand-100 hover:bg-sage-50/50 transition-all group">
                        <div className="text-right min-w-[100px]">
                          <p className="text-xs font-bold text-sage-600 uppercase tracking-[0.2em] mb-1">{meal.time}</p>
                          <p className="text-lg font-serif font-bold text-brand-900">{meal.meal}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-800 text-lg">{meal.food} <span className="text-brand-400 font-normal text-sm italic">({meal.quantity})</span></p>
                          <p className="text-sm text-brand-500 mt-1 italic font-serif">{meal.preparation}</p>
                          <div className="mt-3 p-3 bg-white rounded-2xl border border-brand-100 text-xs text-brand-600 leading-relaxed">
                            <span className="font-bold text-sage-600 uppercase tracking-widest mr-2">{t.reason}:</span> {meal.reason}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-8 bg-brand-100/50 rounded-[2rem] border border-brand-200">
                    <h5 className="font-serif text-xl font-bold text-brand-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} className="text-brand-500" /> {t.generalAdvice}
                    </h5>
                    <p className="text-brand-700 leading-relaxed italic font-light">{plan.plan_data.generalAdvice}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
