"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { demoStore, User, Application, AppStatus } from "@/lib/store";

function OfficerReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("id") || "";
  
  const [user, setUser] = useState<User | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "OFFICER") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    
    if (appId) {
      const existingApp = demoStore.getApplications().find(a => a.id === appId);
      if (existingApp) {
        setApp(existingApp);
      }
    }
  }, [appId, router]);

  if (!app || !user) return <div className="p-8">Loading application data...</div>;

  const updateStatus = (newStatus: AppStatus, historyAction: string, additionalProps: any = {}) => {
    const updatedApp = {
      ...app,
      ...additionalProps,
      status: newStatus,
      history: [
        ...app.history,
        {
          timestamp: new Date().toISOString(),
          action: historyAction,
          actorRole: "OFFICER" as const,
          actorName: user.full_name,
          oldStatus: app.status,
          newStatus: newStatus,
          comment: additionalProps.officerComments || ""
        }
      ]
    };
    demoStore.saveApplication(updatedApp);
    setApp(updatedApp);
    setComment("");
  };

  const handleStartReview = () => updateStatus("Under Verification", "Started Review");
  const handleRequestCorrection = () => {
    if (!comment) return alert("Please provide a reason for correction.");
    updateStatus("Correction Required", "Requested Correction", { officerComments: comment });
  };
  const handleMarkVerified = () => updateStatus("Verified", "Marked Verified");
  const handleForward = () => updateStatus("Committee Review", "Forwarded to Committee");

  const isReviewable = ["Submitted", "Resubmitted", "Under Verification"].includes(app.status);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Application Review: {app.id}</h2>
        <button onClick={() => router.push("/officer/dashboard")} className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Back to Queue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Applicant Data</h3>
            <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(app.formData, null, 2)}
            </pre>
          </div>

          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Eligibility & Flags</h3>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700">Eligibility Checklist</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><input type="checkbox" className="mr-2" /> Income matches scheme requirements?</li>
                <li className="flex items-center"><input type="checkbox" className="mr-2" /> ST Category verified?</li>
                <li className="flex items-center"><input type="checkbox" className="mr-2" /> Documents are authentic?</li>
              </ul>
            </div>
            {app.additionalReviewFlag && (
              <div className="p-3 bg-red-50 text-red-800 text-sm border border-red-200 rounded-md">
                <strong>Flag:</strong> Additional Review Required.
              </div>
            )}
            <div className="p-3 bg-yellow-50 text-yellow-800 text-sm border border-yellow-200 rounded-md mt-4">
              <strong>Potential Duplicate Check:</strong> No duplicates found.
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Uploaded Documents</h3>
            <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="text-blue-800 font-bold text-sm flex items-center mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path></svg>
                AI Document Analysis (Simulated Demo)
              </h4>
              <ul className="text-sm text-blue-900 space-y-1 list-disc pl-5">
                <li><span className="font-semibold">Income Certificate:</span> Verified (Extracted Rs. {app.formData?.income?.annualIncome || "..."}) - <span className="text-green-600">Match</span></li>
                <li><span className="font-semibold">Caste Certificate:</span> Verified (Category: {app.formData?.personal?.category || "ST"}) - <span className="text-green-600">Match</span></li>
              </ul>
              <p className="text-xs text-blue-700 mt-2 italic">Note: In the live system, these values are extracted automatically via OCR.</p>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {app.documents.map(doc => (
                <li key={doc.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                    <p className="text-xs text-gray-500">{doc.name}</p>
                  </div>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 block text-center">
                      Preview Document
                    </a>
                  ) : (
                    <span className="text-xs text-red-500">Preview Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
            {app.documents.length === 0 && <p className="text-sm text-gray-500">No documents uploaded.</p>}
          </div>
          
          {/* History */}
          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Application History</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {app.history.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== app.history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                            <span className="text-blue-600 text-xs font-bold">{event.actorRole.charAt(0)}</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{event.actorName}</span> {event.action}
                              {event.newStatus && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{event.newStatus}</span>}
                            </p>
                            {event.comment && <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 border-l-2 border-red-400">{event.comment}</p>}
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Officer Actions</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Current Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {app.status}
              </span>
            </div>

            {isReviewable && (
              <div className="space-y-4">
                {(app.status === "Submitted" || app.status === "Resubmitted") && (
                  <button onClick={handleStartReview} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors">
                    Start Review
                  </button>
                )}

                {app.status === "Under Verification" && (
                  <>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Officer Notes (Internal)</label>
                      <textarea 
                        className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mb-2" 
                        rows={2} 
                        placeholder="Private notes for officers..."
                      />
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Action Comment / Reason</label>
                      <textarea 
                        className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mb-2" 
                        rows={3} 
                        placeholder="Explain what needs to be fixed..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button onClick={handleRequestCorrection} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        Request Correction
                      </button>
                    </div>

                    <div className="pt-2">
                      <button onClick={() => {
                        if (!comment) return alert("Please provide a reason for additional review.");
                        updateStatus("Under Verification", "Referred for Additional Review", { officerComments: comment, additionalReviewFlag: true });
                      }} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        Refer for Additional Review
                      </button>
                    </div>

                    <div className="border-t pt-4">
                      <button onClick={handleMarkVerified} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors mb-2">
                        Mark as Verified
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {app.status === "Verified" && (
              <div className="space-y-4">
                <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">This application is verified and ready for committee review.</p>
                <button onClick={handleForward} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Forward to Committee
                </button>
              </div>
            )}

            {["Correction Required", "Committee Review", "Selected", "Not Selected", "Waitlisted"].includes(app.status) && (
              <p className="text-sm text-gray-500 mt-4 italic">No actions available at this stage.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OfficerReviewPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading view...</div>}>
      <OfficerReviewContent />
    </Suspense>
  );
}
