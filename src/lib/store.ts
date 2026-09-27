export type Role = "STUDENT" | "OFFICER" | "COMMITTEE";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
}

export type AppStatus = 
  | "Draft"
  | "Submitted"
  | "Under Verification"
  | "Correction Required"
  | "Resubmitted"
  | "Verified"
  | "Committee Review"
  | "Selected"
  | "Waitlisted"
  | "Not Selected";

export interface DocumentInfo {
  id: string;
  type: string;
  name: string;
  url: string;
}

export interface Application {
  id: string;
  studentId: string;
  schemeId: string;
  status: AppStatus;
  formData: any; // Simplified for demo
  documents: DocumentInfo[];
  officerComments: string;
  correctionField: string;
  additionalReviewFlag: boolean;
  history: Array<{
    timestamp: string;
    action: string;
    actorRole: Role;
    actorName: string;
    oldStatus?: string;
    newStatus: string;
    comment?: string;
  }>;
}

const DEFAULT_SCHEMES = [
  {
    id: "NFST",
    title: "National Fellowship for Scheduled Tribes (NFST)",
    description: "Financial assistance for ST students to pursue higher education such as M.Phil and Ph.D.",
    eligibility: "ST students who have passed Post-Graduation. Income < Rs. 6.0 Lakhs p.a.",
    requiredDocs: ["Caste Certificate", "Income Certificate", "PG Marksheet", "Admission Letter"]
  },
  {
    id: "NOS",
    title: "National Overseas Scholarship (NOS)",
    description: "Financial assistance to selected ST students to pursue Master level courses and Ph.D. abroad.",
    eligibility: "ST students with 55% marks or equivalent grade in relevant Master's Degree/Ph.D. Income < Rs. 6.0 Lakhs p.a.",
    requiredDocs: ["Caste Certificate", "Income Certificate", "Offer Letter from Foreign University", "Passport/Visa"]
  }
];

export const demoStore = {
  getUsers: (): User[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("demo_users") || "[]");
  },
  saveUser: (user: User) => {
    const users = demoStore.getUsers();
    users.push(user);
    localStorage.setItem("demo_users", JSON.stringify(users));
  },
  getApplications: (): Application[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("demo_applications") || "[]");
  },
  saveApplications: (apps: Application[]) => {
    localStorage.setItem("demo_applications", JSON.stringify(apps));
  },
  saveApplication: (app: Application) => {
    const apps = demoStore.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index > -1) apps[index] = app;
    else apps.push(app);
    demoStore.saveApplications(apps);
  },
  getSchemes: () => DEFAULT_SCHEMES,
  seedDemoData: () => {
    const apps = demoStore.getApplications();
    if (apps.length > 0) return; // Only seed if empty
    const samples: Application[] = [
      {
        id: "APP-DEMO-1", studentId: "demo-student", schemeId: "NFST", status: "Submitted",
        formData: { personal: { phone: "9876543210", dob: "2000-01-01", category: "ST" }, academic: { lastDegree: "M.Sc.", percentage: "78" }, institution: { name: "IIT Delhi", course: "Ph.D." }, income: { annualIncome: "250000" } },
        documents: [], officerComments: "", correctionField: "", additionalReviewFlag: false,
        history: [{ timestamp: new Date().toISOString(), action: "Submitted Application", actorRole: "STUDENT", actorName: "Demo Student", newStatus: "Submitted" }]
      },
      {
        id: "APP-DEMO-2", studentId: "demo-student", schemeId: "NOS", status: "Correction Required",
        formData: { personal: { phone: "9876543211", dob: "1999-05-15", category: "ST" }, academic: { lastDegree: "B.Tech", percentage: "82" }, institution: { name: "Stanford", course: "MS CS" }, income: { annualIncome: "450000" } },
        documents: [], officerComments: "Income certificate is blurred. Please upload a clear copy.", correctionField: "Income", additionalReviewFlag: false,
        history: [{ timestamp: new Date().toISOString(), action: "Requested Correction", actorRole: "OFFICER", actorName: "Demo Officer", newStatus: "Correction Required", comment: "Income certificate is blurred. Please upload a clear copy." }]
      },
      {
        id: "APP-DEMO-3", studentId: "demo-student", schemeId: "NFST", status: "Verified",
        formData: { personal: { phone: "9876543212", dob: "2001-11-20", category: "ST" }, academic: { lastDegree: "MA", percentage: "65" }, institution: { name: "JNU", course: "M.Phil" }, income: { annualIncome: "150000" } },
        documents: [], officerComments: "", correctionField: "", additionalReviewFlag: false,
        history: [{ timestamp: new Date().toISOString(), action: "Marked Verified", actorRole: "OFFICER", actorName: "Demo Officer", newStatus: "Verified" }]
      }
    ];
    demoStore.saveApplications(samples);
  },
  resetDemoData: () => {
    localStorage.removeItem("demo_users");
    localStorage.removeItem("demo_applications");
    localStorage.removeItem("demo_session");
  },
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const session = localStorage.getItem("demo_session");
    return session ? JSON.parse(session) : null;
  },
  login: (user: User) => {
    localStorage.setItem("demo_session", JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem("demo_session");
  }
};
