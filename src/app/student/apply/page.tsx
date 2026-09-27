"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { demoStore, User, Application, DocumentInfo, AppStatus } from "@/lib/store";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemeId = searchParams.get("scheme");
  const appId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [app, setApp] = useState<Application | null>(null);
  const [formData, setFormData] = useState<any>({
    personal: { phone: "", dob: "", category: "ST" },
    academic: { lastDegree: "", percentage: "" },
    institution: { name: "", course: "" },
    income: { annualIncome: "" },
  });
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "STUDENT") {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    if (appId) {
      const existingApp = demoStore.getApplications().find(a => a.id === appId && a.studentId === currentUser.id);
      if (existingApp) {
        setApp(existingApp);
        setFormData(existingApp.formData);
        setDocuments(existingApp.documents);
      }
    } else if (schemeId) {
      const newApp: Application = {
        id: "APP-" + Date.now(),
        studentId: currentUser.id,
        schemeId: schemeId,
        status: "Draft",
        formData: formData,
        documents: [],
        officerComments: "",
        correctionField: "",
        additionalReviewFlag: false,
        history: [{
          timestamp: new Date().toISOString(),
          action: "Created Draft",
          actorRole: "STUDENT",
          actorName: currentUser.full_name,
          newStatus: "Draft"
        }]
      };
      setApp(newApp);
    }
  }, [appId, schemeId, router]);

  if (!app) return <div className="p-8 text-center">Loading...</div>;

  const handleSaveDraft = () => {
    const updatedApp = { ...app, formData, documents };
    demoStore.saveApplication(updatedApp);
    alert("Draft saved!");
  };

  const handleSubmit = () => {
    const isResubmit = app.status === "Correction Required";
    const newStatus: AppStatus = isResubmit ? "Resubmitted" : "Submitted";
    
    const updatedApp = { 
      ...app, 
      formData, 
      documents, 
      status: newStatus,
      history: [
        ...app.history, 
        {
          timestamp: new Date().toISOString(),
          action: isResubmit ? "Resubmitted Application" : "Submitted Application",
          actorRole: "STUDENT" as const,
          actorName: user?.full_name || "Student",
          oldStatus: app.status,
          newStatus: newStatus
        }
      ]
    };
    demoStore.saveApplication(updatedApp);
    router.push("/student/dashboard");
  };

  const handleDocUpload = (e: any, type: string) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc: DocumentInfo = {
          id: "DOC-" + Date.now(),
          type: type,
          name: file.name,
          url: reader.result as string // Persistent Base64 instead of transient blob
        };
        setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
      };
      reader.readAsDataURL(file);
    }
  };

  const schemeInfo = demoStore.getSchemes().find(s => s.id === app.schemeId);
  const isReadOnly = app.status !== "Draft" && app.status !== "Correction Required";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Application: {schemeInfo?.title}</h2>
          <p className="text-gray-500">Status: <span className="font-semibold">{app.status}</span></p>
          {app.status === "Correction Required" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-red-800 font-bold">Correction Requested by Officer:</h4>
              <p className="text-red-700">{app.officerComments}</p>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex mb-8 space-x-2 overflow-x-auto">
          {["Personal", "Academic", "Institution", "Income", "Documents", "Review"].map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i + 1)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="mb-8 space-y-4">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" disabled={isReadOnly} value={formData.personal.phone} onChange={(e) => setFormData({...formData, personal: {...formData.personal, phone: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input type="date" disabled={isReadOnly} value={formData.personal.dob} onChange={(e) => setFormData({...formData, personal: {...formData.personal, dob: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Academic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Degree Passed</label>
                  <input type="text" disabled={isReadOnly} value={formData.academic.lastDegree} onChange={(e) => setFormData({...formData, academic: {...formData.academic, lastDegree: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Percentage / CGPA</label>
                  <input type="text" disabled={isReadOnly} value={formData.academic.percentage} onChange={(e) => setFormData({...formData, academic: {...formData.academic, percentage: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Institution Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">University/Institution Name</label>
                  <input type="text" disabled={isReadOnly} value={formData.institution.name} onChange={(e) => setFormData({...formData, institution: {...formData.institution, name: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Applying For</label>
                  <input type="text" disabled={isReadOnly} value={formData.institution.course} onChange={(e) => setFormData({...formData, institution: {...formData.institution, course: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Family Income</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Family Income (Rs.)</label>
                <input type="number" disabled={isReadOnly} value={formData.income.annualIncome} onChange={(e) => setFormData({...formData, income: {...formData.income, annualIncome: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 max-w-sm" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Document Uploads</h3>
              <p className="text-sm text-gray-500 mb-4">Please upload the required documents in PDF or JPG format.</p>
              <div className="space-y-4">
                {schemeInfo?.requiredDocs.map(docType => {
                  const existing = documents.find(d => d.type === docType);
                  return (
                    <div key={docType} className="border p-4 rounded-md flex justify-between items-center bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{docType} <span className="text-red-500">*</span></p>
                        {existing ? <p className="text-sm text-green-600">Uploaded: {existing.name}</p> : <p className="text-sm text-gray-500">Not uploaded</p>}
                      </div>
                      {!isReadOnly && (
                        <div>
                          <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            {existing ? "Replace" : "Upload"}
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(e, docType)} />
                          </label>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review & Submit</h3>
              <div className="bg-gray-50 p-4 rounded-md border mb-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(formData, null, 2)}
                </p>
                <p className="mt-4 text-sm font-bold text-gray-700">Documents uploaded: {documents.length} / {schemeInfo?.requiredDocs.length}</p>
              </div>
              <p className="text-sm text-gray-500 italic mb-4">I hereby declare that the details furnished above are true and correct to the best of my knowledge.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between border-t pt-4">
          <button 
            disabled={step === 1} 
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border rounded-md text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="space-x-2">
            {!isReadOnly && (
              <button 
                onClick={handleSaveDraft}
                className="px-4 py-2 border rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                Save Draft
              </button>
            )}
            
            {step < 6 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              !isReadOnly && (
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 font-bold"
                >
                  {app.status === "Correction Required" ? "Resubmit Application" : "Final Submit"}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyForm />
    </Suspense>
  )
}
