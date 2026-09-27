"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoStore, User, Application } from "@/lib/store";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const schemes = demoStore.getSchemes();

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "STUDENT") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    const allApps = demoStore.getApplications();
    setApplications(allApps.filter(a => a.studentId === currentUser.id));
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Student Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {user.full_name}</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button 
            onClick={() => demoStore.resetDemoData()}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Applications */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Applications</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {applications.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-500">No applications found.</li>
            ) : (
              applications.map((app) => {
                const scheme = schemes.find(s => s.id === app.schemeId);
                return (
                  <li key={app.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{scheme?.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${app.status === 'Draft' ? 'bg-gray-100 text-gray-800' : ''}
                          ${app.status === 'Submitted' || app.status === 'Resubmitted' ? 'bg-blue-100 text-blue-800' : ''}
                          ${app.status === 'Under Verification' || app.status === 'Committee Review' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${app.status === 'Correction Required' ? 'bg-red-100 text-red-800' : ''}
                          ${app.status === 'Verified' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'Selected' ? 'bg-green-200 text-green-900' : ''}
                          ${app.status === 'Not Selected' ? 'bg-red-200 text-red-900' : ''}
                        `}>
                          {app.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          App ID: {app.id}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Application Timeline</h4>
                      <ul className="space-y-2">
                        {app.history.map((evt, idx) => (
                          <li key={idx} className="flex text-sm text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{evt.action}</p>
                              <p className="text-xs text-gray-400">{new Date(evt.timestamp).toLocaleString()}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {app.status === 'Correction Required' && (
                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-sm text-red-700">
                        <p className="font-bold">Officer Comment:</p>
                        <p>{app.officerComments}</p>
                        <Link href={`/student/apply?id=${app.id}`} className="mt-2 inline-block text-blue-600 hover:underline font-medium">
                          Update and Resubmit &rarr;
                        </Link>
                      </div>
                    )}
                    {(app.status === 'Draft') && (
                      <div className="mt-4">
                        <Link href={`/student/apply?id=${app.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                          Continue Application &rarr;
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Right Column: Discover & Info */}
        <div className="space-y-6">
          {/* Notifications & Payments */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              {applications.filter(a => a.status === 'Selected').map(app => (
                <div key={`payment-${app.id}`} className="bg-green-50 p-4 border border-green-200 rounded-md">
                  <h4 className="text-sm font-bold text-green-900">Payment Status (Simulated)</h4>
                  <p className="text-sm text-green-700 mt-1">Application {app.id} is approved. First installment of Rs. 45,000 has been disbursed via DBT.</p>
                  <p className="text-xs text-gray-500 mt-2 italic">No actual money is transferred in this demo.</p>
                </div>
              ))}
              {applications.filter(a => a.status === 'Correction Required').map(app => (
                <div key={`corr-${app.id}`} className="bg-red-50 p-4 border border-red-200 rounded-md">
                  <h4 className="text-sm font-bold text-red-900">Action Required</h4>
                  <p className="text-sm text-red-700 mt-1">Application {app.id} needs your attention. Please check the Officer Comments.</p>
                </div>
              ))}
              {applications.length === 0 && <p className="text-sm text-gray-500">No new notifications.</p>}
            </div>
          </div>

          {/* Scheme Discovery */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Explore Schemes</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {schemes.map((scheme) => (
                <li key={scheme.id} className="p-4 sm:px-6">
                  <h4 className="text-lg font-bold text-gray-900">{scheme.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{scheme.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Eligibility:</span> {scheme.eligibility}
                  </div>
                  <div className="mt-4">
                    <Link href={`/student/apply?scheme=${scheme.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
