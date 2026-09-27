"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoStore, User, Application } from "@/lib/store";

export default function OfficerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const schemes = demoStore.getSchemes();

  const [search, setSearch] = useState("");
  const [filterScheme, setFilterScheme] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const currentUser = demoStore.getCurrentUser();
    if (!currentUser || currentUser.role !== "OFFICER") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    const allApps = demoStore.getApplications().filter(a => a.status !== "Draft");
    setApplications(allApps);
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  const getCount = (status: string | string[]) => {
    if (Array.isArray(status)) return applications.filter(a => status.includes(a.status)).length;
    return applications.filter(a => a.status === status).length;
  }

  const filteredApps = applications.filter(app => {
    if (search && !app.id.toLowerCase().includes(search.toLowerCase()) && !app.studentId.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterScheme !== "ALL" && app.schemeId !== filterScheme) return false;
    if (filterStatus !== "ALL" && app.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reviewing Officer Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">Welcome, {user.full_name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {[
          { label: "Submitted", val: getCount("Submitted"), color: "bg-blue-50" },
          { label: "Resubmitted", val: getCount("Resubmitted"), color: "bg-purple-50" },
          { label: "Under Verification", val: getCount("Under Verification"), color: "bg-yellow-50" },
          { label: "Correction Req.", val: getCount("Correction Required"), color: "bg-red-50" },
          { label: "Verified", val: getCount("Verified"), color: "bg-green-50" },
          { label: "Fwd to Committee", val: getCount(["Committee Review", "Selected", "Not Selected", "Waitlisted"]), color: "bg-gray-100" },
        ].map((stat, i) => (
          <div key={i} className={`overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 ${stat.color} border border-gray-200`}>
            <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stat.val}</dd>
          </div>
        ))}
      </div>

      {/* Application Queue */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 border-b border-gray-200 space-y-4 sm:space-y-0">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Application Queue</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Search App ID or Name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
            <select value={filterScheme} onChange={e => setFilterScheme(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="ALL">All Schemes</option>
              {schemes.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Resubmitted">Resubmitted</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Correction Required">Correction Required</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
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
              {filteredApps.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No applications match criteria.</td></tr>
              ) : filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schemes.find(s=>s.id===app.schemeId)?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.status === 'Submitted' || app.status === 'Resubmitted' ? 'bg-blue-100 text-blue-800' : ''}
                      ${app.status === 'Under Verification' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.status === 'Correction Required' ? 'bg-red-100 text-red-800' : ''}
                      ${app.status === 'Verified' ? 'bg-green-100 text-green-800' : ''}
                      ${['Committee Review','Selected','Waitlisted','Not Selected'].includes(app.status) ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {app.status}
                    </span>
                    {app.status === 'Resubmitted' && <span className="ml-2 text-xs font-bold text-purple-600">(Updated)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/officer/review?id=${app.id}`} className="text-blue-600 hover:text-blue-900">
                      {['Submitted', 'Resubmitted', 'Under Verification'].includes(app.status) ? "Review" : "View"}
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
