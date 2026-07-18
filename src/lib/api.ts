const API_URL = ""; // Use relative paths for Netlify redirects

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export const authApi = {
  login: (credentials: any) => apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (data: any) => apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
};

export const patientApi = {
  getDetails: () => apiFetch("/api/patient/details"),
  saveDetails: (details: any) => apiFetch("/api/patient/details", { method: "POST", body: JSON.stringify(details) }),
  saveReport: (data: { imageData: string, extractedData: any }) => apiFetch("/api/patient/save-report", { method: "POST", body: JSON.stringify(data) }),
  savePlan: (data: { reportId: number, planData: any }) => apiFetch("/api/patient/save-plan", { method: "POST", body: JSON.stringify(data) }),
  getPlans: () => apiFetch("/api/patient/plans"),
};

export const doctorApi = {
  getPendingPlans: () => apiFetch("/api/doctor/pending-plans"),
  approvePlan: (planId: number) => apiFetch("/api/doctor/approve-plan", { method: "POST", body: JSON.stringify({ planId }) }),
};
