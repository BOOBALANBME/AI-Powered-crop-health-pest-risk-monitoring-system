import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import db from "./src/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));

  // Multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // --- Auth Routes ---
  app.post("/api/auth/register", async (req, res) => {
    const { username, password, role, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const stmt = db.prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)");
      const result = stmt.run(username, hashedPassword, role, fullName);
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, role: user.role, fullName: user.full_name } });
  });

  // --- Patient Routes ---
  app.post("/api/patient/details", authenticate, (req: any, res) => {
    const { age, gender, weight, height, lifestyle, sleepHours, stressLevel, activityLevel } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO patient_details (user_id, age, gender, weight, height, lifestyle, sleep_hours, stress_level, activity_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(req.user.id, age, gender, weight, height, lifestyle, sleepHours, stressLevel, activityLevel);
    res.json({ success: true });
  });

  app.get("/api/patient/details", authenticate, (req: any, res) => {
    const details = db.prepare("SELECT * FROM patient_details WHERE user_id = ?").get(req.user.id);
    res.json(details || {});
  });

  app.post("/api/patient/save-report", authenticate, (req: any, res) => {
    const { imageData, extractedData } = req.body;
    const stmt = db.prepare("INSERT INTO lab_reports (patient_id, image_data, extracted_data, status) VALUES (?, ?, ?, ?)");
    const result = stmt.run(req.user.id, imageData, JSON.stringify(extractedData), 'analyzed');
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/patient/save-plan", authenticate, (req: any, res) => {
    const { reportId, planData } = req.body;
    const stmt = db.prepare("INSERT INTO diet_plans (report_id, patient_id, plan_data) VALUES (?, ?, ?)");
    const result = stmt.run(reportId, req.user.id, JSON.stringify(planData));
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/patient/plans", authenticate, (req: any, res) => {
    const plans = db.prepare(`
      SELECT 
        dp.*, 
        lr.extracted_data, 
        u.full_name as patient_name,
        pd.age, pd.gender, pd.weight, pd.height, pd.lifestyle, pd.sleep_hours, pd.stress_level, pd.activity_level
      FROM diet_plans dp
      JOIN lab_reports lr ON dp.report_id = lr.id
      JOIN users u ON dp.patient_id = u.id
      LEFT JOIN patient_details pd ON dp.patient_id = pd.user_id
      WHERE dp.patient_id = ?
      ORDER BY dp.created_at DESC
    `).all(req.user.id);
    
    res.json(plans.map((p: any) => {
      let plan_data = {};
      let extracted_data = {};
      try {
        plan_data = typeof p.plan_data === 'string' ? JSON.parse(p.plan_data) : p.plan_data;
      } catch (e) { console.error("Plan data parse error", e); }
      try {
        extracted_data = typeof p.extracted_data === 'string' ? JSON.parse(p.extracted_data) : p.extracted_data;
      } catch (e) { console.error("Extracted data parse error", e); }
      
      return { ...p, plan_data, extracted_data };
    }));
  });

  // --- Doctor Routes ---
  app.get("/api/doctor/pending-plans", authenticate, (req: any, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ error: "Forbidden" });
    const plans = db.prepare(`
      SELECT dp.*, u.full_name as patient_name, lr.extracted_data
      FROM diet_plans dp
      JOIN users u ON dp.patient_id = u.id
      JOIN lab_reports lr ON dp.report_id = lr.id
      WHERE dp.doctor_approved = 0
    `).all();
    
    res.json(plans.map((p: any) => {
      let plan_data = {};
      let extracted_data = {};
      try {
        plan_data = typeof p.plan_data === 'string' ? JSON.parse(p.plan_data) : p.plan_data;
      } catch (e) { console.error("Plan data parse error", e); }
      try {
        extracted_data = typeof p.extracted_data === 'string' ? JSON.parse(p.extracted_data) : p.extracted_data;
      } catch (e) { console.error("Extracted data parse error", e); }
      
      return { ...p, plan_data, extracted_data };
    }));
  });

  app.post("/api/doctor/approve-plan", authenticate, (req: any, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ error: "Forbidden" });
    const { planId } = req.body;
    db.prepare("UPDATE diet_plans SET doctor_approved = 1 WHERE id = ?").run(planId);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
