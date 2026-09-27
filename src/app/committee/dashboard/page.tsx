"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoStore, User, Application } from "@/lib/store";

export default function CommitteeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const schemes = demoStore.getSchemes();

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "COMMITTEE") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    // Committee only sees forwarded applications (Committee Review) or finalized ones
    const allApps = demoStore.getApplications().filter(a => 
      ["Committee Review", "Selected", "Waitlisted", "Not Selected"].includes(a.status)
    );
    setApplications(allApps);
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Selection Committee Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">Welcome, {user.full_name}</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Applications Pending Selection</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No applications in queue.</td></tr>
              ) : applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schemes.find(s=>s.id===app.schemeId)?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.status === 'Committee Review' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.status === 'Selected' ? 'bg-green-100 text-green-800' : ''}
                      ${app.status === 'Not Selected' ? 'bg-red-100 text-red-800' : ''}
                      ${app.status === 'Waitlisted' ? 'bg-orange-100 text-orange-800' : ''}
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/committee/review?id=${app.id}`} className="text-blue-600 hover:text-blue-900">
                      {app.status === 'Committee Review' ? "Make Decision" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
