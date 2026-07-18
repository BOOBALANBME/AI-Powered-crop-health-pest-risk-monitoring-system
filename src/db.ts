import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('nutrition.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
    full_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS patient_details (
    user_id INTEGER PRIMARY KEY,
    age INTEGER,
    gender TEXT,
    weight REAL,
    height REAL,
    lifestyle TEXT,
    sleep_hours REAL,
    stress_level TEXT,
    activity_level TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS lab_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    image_data TEXT, -- Base64 or path
    extracted_data TEXT, -- JSON string of lab values
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'approved')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS diet_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    plan_data TEXT, -- JSON string of the diet chart
    doctor_approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES lab_reports(id),
    FOREIGN KEY (patient_id) REFERENCES users(id)
  );
`);

export default db;
