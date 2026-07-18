import React, { useState, useEffect } from "react";
import { patientApi } from "../lib/api";
import { 
  Upload, FileText, Download, CheckCircle, Clock, 
  ChevronRight, Activity, User, Scale, Ruler, 
  Moon, Zap, Brain, LayoutGrid, List, ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { createWorker } from "tesseract.js";
import { generateRuleBasedPlan } from "../lib/nutritionRules";
import { translations } from "../lib/translations";

export default function PatientDashboard({ language }: { language: string }) {
  const t = translations[language] || translations.English;
  const [details, setDetails] = useState<any>({
    age: "", gender: "Male", weight: "", height: "", 
    lifestyle: "Sedentary", sleepHours: "8", stressLevel: "Low", activityLevel: "Low"
  });

  const calculateBMI = (w: string | number, h: string | number) => {
    const weight = parseFloat(String(w));
    const height = parseFloat(String(h)) / 100; // cm to m
    if (!weight || !height || isNaN(weight) || isNaN(height)) return null;
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return t.underweight;
    if (bmi < 25) return t.normal;
    if (bmi < 30) return t.overweight;
    return t.obese;
  };

  const bmi = calculateBMI(details.weight, details.height);
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    try {
      const [d, p] = await Promise.all([patientApi.getDetails(), patientApi.getPlans()]);
      if (d.user_id) setDetails(d);
      setPlans(p.map((plan: any) => ({
        ...plan,
        plan_data: safeParse(plan.plan_data),
        extracted_data: safeParse(plan.extracted_data)
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await patientApi.saveDetails(details);
      setActiveTab("upload");
    } catch (e) {
      alert("Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    try {
      // 1. Read file as base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Image = await base64Promise;

      // 2. OCR Analysis (Tesseract)
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // 3. Simple Parser for Lab Values
      const extractedData: any = {};
      const lines = text.split('\n');
      
      const markers = [
        { key: "Hemoglobin", regex: /(?:Hb|Hemoglobin)\s*[:\-]?\s*(\d+\.?\d*)/i },
        { key: "Blood Sugar", regex: /(?:Sugar|Glucose|Fasting|PP)\s*[:\-]?\s*(\d+\.?\d*)/i },
        { key: "Cholesterol", regex: /(?:Cholesterol|Total Cholesterol)\s*[:\-]?\s*(\d+\.?\d*)/i },
        { key: "Creatinine", regex: /(?:Creatinine)\s*[:\-]?\s*(\d+\.?\d*)/i },
        { key: "Uric Acid", regex: /(?:Uric Acid)\s*[:\-]?\s*(\d+\.?\d*)/i }
      ];

      lines.forEach(line => {
        markers.forEach(marker => {
          const match = line.match(marker.regex);
          if (match && !extractedData[marker.key]) {
            extractedData[marker.key] = match[1];
          }
        });
      });

      // 4. Save Report to Backend
      const { id: reportId } = await patientApi.saveReport({ imageData: base64Image, extractedData });

      // 5. Generate Rule-Based Diet Plan
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const planData = { 
        ...generateRuleBasedPlan(details, extractedData, language),
        weight: details.weight,
        height: details.height
      };

      // 6. Save Plan to Backend
      await patientApi.savePlan({ reportId, planData });

      loadData();
      setActiveTab("plans");
    } catch (e: any) {
      console.error(e);
      alert("Analysis or Plan generation failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadPDF = async (plan: any) => {
    setGeneratingPDF(plan.id);
    setPdfStatus(t.analyzing || "Generating PDF...");
    
    try {
      const plan_data = safeParse(plan.plan_data);
      const labValues = safeParse(plan.extracted_data);
      const { patient_name, age, gender, lifestyle, doctor_approved } = plan;
      const weight = plan_data.weight || plan.weight;
      const height = plan_data.height || plan.height;
      const language = plan.language || "English";
      
      if (!plan_data || !plan_data.dietChart) {
        throw new Error("Invalid plan data");
      }

      if (language !== "English") {
        // Use html2canvas for non-English languages to preserve character rendering
        const element = document.getElementById(`plan-card-${plan.id}`);
        if (!element) throw new Error("Plan element not found");

        // Scroll to top to ensure canvas captures correctly
        window.scrollTo(0, 0);
        
        // Small delay to ensure UI is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
          scale: 1.5, // Reduced scale for speed
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG and lower quality for speed/size
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        
        const dateStr = plan.created_at ? new Date(plan.created_at).toISOString().split('T')[0] : 'Plan';
        pdf.save(`BioNutriSense_${dateStr}.pdf`);
      } else {
        // Use standard jsPDF for English for better text quality and structure
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(74, 90, 74); // Sage-700
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text(t.appName, 14, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(t.reviewDescription, 14, 32);
        
        // Status Badge in Header
        if (doctor_approved) {
          doc.setFillColor(255, 255, 255, 0.2);
          doc.roundedRect(140, 15, 55, 10, 3, 3, 'F');
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text(`✓ ${t.approvedByDoctor}`, 145, 21.5);
        }

        // Main Content Border
        doc.setDrawColor(74, 90, 74);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, 200, 287);

        // Patient Information Section
        doc.setTextColor(74, 90, 74);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(t.personalDetails, 14, 60);
        
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.1);
        doc.line(14, 63, 196, 63);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        const col1 = 14;
        const col2 = 75;
        const col3 = 140;

        doc.setFont("helvetica", "bold"); doc.text(t.fullName + ":", col1, 72);
        doc.setFont("helvetica", "normal"); doc.text(patient_name || "N/A", col1 + 25, 72);
        
        doc.setFont("helvetica", "bold"); doc.text(t.age + ":", col1, 78);
        doc.setFont("helvetica", "normal"); doc.text(String(age || "N/A"), col1 + 25, 78);
        
        doc.setFont("helvetica", "bold"); doc.text(t.gender + ":", col1, 84);
        doc.setFont("helvetica", "normal"); doc.text(gender || "N/A", col1 + 25, 84);

        doc.setFont("helvetica", "bold"); doc.text(t.weight + ":", col2, 72);
        doc.setFont("helvetica", "normal"); doc.text(`${weight || "N/A"} kg`, col2 + 25, 72);
        
        doc.setFont("helvetica", "bold"); doc.text(t.height + ":", col2, 78);
        doc.setFont("helvetica", "normal"); doc.text(`${height || "N/A"} cm`, col2 + 25, 78);
        
        doc.setFont("helvetica", "bold"); doc.text(t.lifestyle + ":", col2, 84);
        doc.setFont("helvetica", "normal"); doc.text(lifestyle || "N/A", col2 + 25, 84);

        doc.setFont("helvetica", "bold"); doc.text(t.date + ":", col3, 72);
        doc.setFont("helvetica", "normal"); doc.text(new Date(plan.created_at).toLocaleDateString(), col3 + 20, 72);
        
        doc.setFont("helvetica", "bold"); doc.text(t.languageLabel + ":", col3, 78);
        doc.setFont("helvetica", "normal"); doc.text(language, col3 + 20, 78);

        const bmiValue = calculateBMI(weight, height);
        if (bmiValue) {
          doc.setFont("helvetica", "bold"); doc.text(t.bmi + ":", col3, 84);
          doc.setFont("helvetica", "normal"); doc.text(`${bmiValue} (${getBMICategory(parseFloat(bmiValue))})`, col3 + 20, 84);
        }

        // Lab Results Summary Section
        doc.setTextColor(74, 90, 74);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(t.extractedLabValues, 14, 100);
        
        doc.setDrawColor(230, 230, 230);
        doc.line(14, 103, 196, 103);
        
        const labRows = Object.entries(labValues).map(([key, value]) => [key, value]);
        if (labRows.length > 0) {
          autoTable(doc, {
            startY: 108,
            head: [[t.food || "Parameter", t.quantity || "Value"]],
            body: labRows,
            theme: 'striped',
            headStyles: { fillColor: [245, 245, 240], textColor: [74, 90, 74], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
            margin: { left: 14, right: 14 }
          });
        } else {
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text("No lab data extracted from report.", 14, 110);
        }

        let currentY = labRows.length > 0 ? (doc as any).lastAutoTable.finalY + 15 : 120;
        
        // Diet Chart
        doc.setTextColor(74, 90, 74);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(t.personalizedDietChart, 14, currentY);
        
        autoTable(doc, {
          startY: currentY + 5,
          head: [[t.time, t.meal, t.food, t.quantity, t.method, t.reason]],
          body: plan_data.dietChart.map((d: any) => [d.time, d.meal, d.food, d.quantity, d.preparation, d.reason]),
          theme: 'grid',
          headStyles: { fillColor: [74, 90, 74], textColor: [255, 255, 255], fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 4, font: 'helvetica' },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 35 },
            3: { cellWidth: 25 },
            4: { cellWidth: 35 },
            5: { cellWidth: 'auto' }
          }
        });
        
        let finalY = (doc as any).lastAutoTable.finalY;
        
        // General Advice
        if (finalY > 230) {
          doc.addPage();
          doc.setDrawColor(74, 90, 74);
          doc.setLineWidth(0.5);
          doc.rect(5, 5, 200, 287);
          finalY = 20;
        }
        
        doc.setTextColor(74, 90, 74);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(t.generalAdvice, 14, finalY + 15);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const splitAdvice = doc.splitTextToSize(plan_data.generalAdvice, 180);
        doc.text(splitAdvice, 14, finalY + 22);
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`BioNutriSense - ${t.personalizedDietChart} | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }
        
        const dateStr = plan.created_at ? new Date(plan.created_at).toISOString().split('T')[0] : 'Plan';
        doc.save(`BioNutriSense_${dateStr}.pdf`);
      }
      setPdfStatus("Success!");
      setTimeout(() => setPdfStatus(null), 3000);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setPdfStatus("Error generating PDF. Please try again.");
      setTimeout(() => setPdfStatus(null), 5000);
    } finally {
      setGeneratingPDF(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-3">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-serif text-lg ${activeTab === "profile" ? "bg-sage-600 text-white shadow-xl shadow-sage-100" : "bg-white text-brand-600 hover:bg-brand-200 border border-brand-200"}`}
        >
          <User size={20} />
          <span className="font-medium">{t.myProfile}</span>
        </button>
        <button 
          onClick={() => setActiveTab("upload")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-serif text-lg ${activeTab === "upload" ? "bg-sage-600 text-white shadow-xl shadow-sage-100" : "bg-white text-brand-600 hover:bg-brand-200 border border-brand-200"}`}
        >
          <Upload size={20} />
          <span className="font-medium">{t.uploadReport}</span>
        </button>
        <button 
          onClick={() => setActiveTab("plans")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-serif text-lg ${activeTab === "plans" ? "bg-sage-600 text-white shadow-xl shadow-sage-100" : "bg-white text-brand-600 hover:bg-brand-200 border border-brand-200"}`}
        >
          <ClipboardList size={20} />
          <span className="font-medium">{t.dietPlans}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-organic"
            >
              <h3 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3 text-brand-900">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <User className="text-brand-600" />
                </div>
                {t.personalDetails}
              </h3>
              <form onSubmit={handleSaveDetails} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1 flex items-center gap-2">
                    <Activity size={14} /> {t.age}
                  </label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.age || ""}
                    onChange={(e) => setDetails({ ...details, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1">{t.gender}</label>
                  <select 
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.gender || "Male"}
                    onChange={(e) => setDetails({ ...details, gender: e.target.value })}
                  >
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1 flex items-center gap-2">
                    <Scale size={14} /> {t.weight} (kg)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.weight || ""}
                    onChange={(e) => setDetails({ ...details, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1 flex items-center gap-2">
                    <Ruler size={14} /> {t.height} (cm)
                  </label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.height || ""}
                    onChange={(e) => setDetails({ ...details, height: e.target.value })}
                  />
                </div>

                {bmi && (
                  <div className="md:col-span-2 p-6 bg-sage-50 rounded-3xl border border-sage-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sage-600 rounded-2xl flex items-center justify-center text-white">
                        <Activity size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-sage-600">{t.bmi}</p>
                        <p className="text-2xl font-serif font-bold text-brand-900">{bmi}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-widest text-sage-600">{t.bmiCategory}</p>
                      <p className="text-lg font-serif font-bold text-sage-700">{bmiCategory}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1 flex items-center gap-2">
                    <Moon size={14} /> {t.sleepHours}
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.sleepHours || ""}
                    onChange={(e) => setDetails({ ...details, sleepHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-500 ml-1 flex items-center gap-2">
                    <Brain size={14} /> {t.stressLevel}
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-200 rounded-2xl focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                    value={details.stressLevel || "Low"}
                    onChange={(e) => setDetails({ ...details, stressLevel: e.target.value })}
                  >
                    <option value="Low">{t.low}</option>
                    <option value="Moderate">{t.moderate}</option>
                    <option value="High">{t.high}</option>
                  </select>
                </div>
                <div className="md:col-span-2 pt-4">
                  {bmi && (
                    <div className="mb-8 p-6 bg-sage-50 rounded-3xl border border-sage-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-sage-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sage-100">
                          <Activity size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-sage-500">{t.bmi}</p>
                          <p className="text-3xl font-serif font-bold text-brand-900">{bmi}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-sage-500">{t.bmiCategory}</p>
                        <p className="text-xl font-serif font-bold text-sage-700">{bmiCategory}</p>
                      </div>
                    </div>
                  )}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-sage-600 text-white font-bold rounded-2xl hover:bg-sage-700 transition-all shadow-xl shadow-sage-100 flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t.saveContinue}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "upload" && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-organic text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Upload className="text-sage-600 w-12 h-12" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-3 text-brand-900">{t.uploadLabReport}</h3>
                <p className="text-brand-600 mb-10 leading-relaxed">{t.uploadDescription}</p>
                
                <label className="block w-full cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                  <div className={`py-12 border-2 border-dashed border-brand-200 rounded-[2.5rem] group-hover:border-sage-500 group-hover:bg-sage-50/50 transition-all flex flex-col items-center gap-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
                        <p className="font-serif text-xl text-sage-700 italic">{t.analyzing}</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="text-brand-500" size={32} />
                        </div>
                        <span className="font-serif text-xl text-brand-900">{t.clickToSelect}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">{t.maxSize}</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === "plans" && (
            <motion.div 
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-4xl font-serif font-bold text-brand-900">{t.yourDietPlans}</h3>
                  <p className="text-brand-600 mt-1">{t.plansGenerated}: <span className="font-bold text-sage-600">{plans.length}</span></p>
                </div>
              </div>

              {plans.length === 0 ? (
                <div className="card-organic py-20 text-center">
                  <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="text-brand-300" size={40} />
                  </div>
                  <p className="text-brand-500 font-serif text-xl italic">{t.noPlans}</p>
                </div>
              ) : (
                plans.map((plan, idx) => (
                  <div key={plan.id} id={`plan-card-${plan.id}`} className="card-organic overflow-hidden !p-0">
                    <div className="p-8 border-b border-brand-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-brand-50/50">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sage-600 rounded-2xl flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg shadow-sage-100">
                          {plans.length - idx}
                        </div>
                        <div>
                          <p className="font-serif text-2xl font-bold text-brand-900">{t.planFor} {new Date(plan.created_at).toLocaleDateString()}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {plan.doctor_approved && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 text-sage-700 text-xs font-bold uppercase tracking-wider rounded-full border border-sage-200">
                                <CheckCircle size={14} /> {t.approvedByDoctor}
                              </span>
                            )}
                            {calculateBMI(plan.plan_data.weight || plan.weight, plan.plan_data.height || plan.height) && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-full border border-brand-200">
                                <Activity size={14} /> {t.bmi}: {calculateBMI(plan.plan_data.weight || plan.weight, plan.plan_data.height || plan.height)} ({getBMICategory(parseFloat(calculateBMI(plan.plan_data.weight || plan.weight, plan.plan_data.height || plan.height)!))})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadPDF(plan)}
                        disabled={generatingPDF === plan.id}
                        className="flex items-center gap-3 px-6 py-3 bg-brand-900 text-white rounded-full hover:bg-brand-950 transition-all text-sm font-bold shadow-lg shadow-brand-100 active:scale-95 disabled:opacity-50 relative"
                      >
                        {generatingPDF === plan.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download size={18} />
                        )} 
                        {generatingPDF === plan.id ? pdfStatus : t.downloadPDF}
                      </button>
                    </div>
                    
                    <div className="p-8 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-brand-500 text-xs uppercase tracking-[0.2em] font-bold">
                            <th className="pb-6">{t.time}</th>
                            <th className="pb-6">{t.meal}</th>
                            <th className="pb-6">{t.foodQuantity}</th>
                            <th className="pb-6">{t.preparation}</th>
                            <th className="pb-6">{t.reason}</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {plan.plan_data.dietChart.map((meal: any, mIdx: number) => (
                            <tr key={mIdx} className="border-t border-brand-100 group">
                              <td className="py-6 font-mono text-sage-600 font-bold">{meal.time}</td>
                              <td className="py-6 font-serif text-lg font-semibold text-brand-900">{meal.meal}</td>
                              <td className="py-6">
                                <span className="font-bold text-brand-800">{meal.food}</span>
                                <p className="text-brand-500 text-xs mt-0.5">{meal.quantity}</p>
                              </td>
                              <td className="py-6 text-brand-600 italic font-serif">{meal.preparation}</td>
                              <td className="py-6 text-xs text-brand-700 max-w-xs leading-relaxed">{meal.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="p-8 bg-sage-50 border-t border-brand-100">
                      <h4 className="font-serif text-xl font-bold text-sage-900 mb-3 flex items-center gap-2">
                        <Zap size={20} className="text-sage-600" /> {t.generalAdvice}
                      </h4>
                      <p className="text-brand-800 leading-relaxed font-light italic">{plan.plan_data.generalAdvice}</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
