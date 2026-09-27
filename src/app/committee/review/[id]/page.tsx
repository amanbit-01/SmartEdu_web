"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { demoStore, User, Application, AppStatus } from "@/lib/store";

export default function CommitteeReviewPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "COMMITTEE") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    
    const existingApp = demoStore.getApplications().find(a => a.id === appId);
    if (existingApp) setApp(existingApp);
  }, [appId, router]);

  if (!app || !user) return <div className="p-8">Loading...</div>;

  const handleDecision = (decision: AppStatus) => {
    if (decision === "Not Selected" && !comment) {
      return alert("Please provide a reason for non-selection.");
    }
    const updatedApp = {
      ...app,
      status: decision,
      history: [
        ...app.history,
        {
          timestamp: new Date().toISOString(),
          action: "Committee Decision Made",
          actorRole: "COMMITTEE" as const,
          actorName: user.full_name,
          oldStatus: app.status,
          newStatus: decision,
          comment: comment || ""
        }
      ]
    };
    demoStore.saveApplication(updatedApp);
    setApp(updatedApp);
    setComment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Committee Decision: {app.id}</h2>
        <button onClick={() => router.push("/committee/dashboard")} className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details & History */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Application Profile</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              <div><span className="font-bold">Income:</span> Rs. {app.formData?.income?.annualIncome || "N/A"}</div>
              <div><span className="font-bold">Course:</span> {app.formData?.institution?.course || "N/A"}</div>
              <div><span className="font-bold">Percentage:</span> {app.formData?.academic?.percentage || "N/A"}%</div>
              <div><span className="font-bold">Category:</span> {app.formData?.personal?.category || "ST"}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-sm text-gray-700 mb-2">Simulated Ranking Score</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                Score: 84.5 (Based on Income + Academic Merit sample rules)
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg border p-6">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Application History</h3>
            <ul className="space-y-4">
              {app.history.map((event, eventIdx) => (
                <li key={eventIdx} className="text-sm">
                  <span className="font-bold text-gray-700">[{new Date(event.timestamp).toLocaleString()}]</span> 
                  <span className="ml-2">{event.actorName} ({event.actorRole}):</span> 
                  <span className="ml-1 text-blue-600">{event.action}</span>
                  {event.comment && <div className="mt-1 ml-4 text-gray-600 italic">"{event.comment}"</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Final Decision</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Current Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {app.status}
              </span>
            </div>

            {app.status === "Committee Review" ? (
              <div className="space-y-4 pt-4 border-t">
                <textarea 
                  className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mb-2" 
                  rows={3} 
                  placeholder="Optional comment (Required for non-selection)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={() => handleDecision("Selected")} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Select for Scholarship
                </button>
                <button onClick={() => handleDecision("Waitlisted")} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
                  Waitlist
                </button>
                <button onClick={() => handleDecision("Not Selected")} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Not Selected
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4 italic">Decision has been finalized.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
