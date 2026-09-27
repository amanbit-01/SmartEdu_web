"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { demoStore, User } from "@/lib/store";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(demoStore.getCurrentUser());
  }, []);

  return (
    <main className="flex-grow flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl w-full">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Empowering the Future with</span>{' '}
            <span className="block text-blue-700 xl:inline">Smart Education</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
            The AI-Enabled Scholarship and Fellowship Management System for the Ministry of Tribal Affairs (MoTA). Streamlining applications, verification, and disbursement.
          </p>
          
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            {user ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg mx-auto">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4">
                  {(user.full_name || user.email).charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                <p className="text-gray-600 mb-6">{user.full_name || user.email}</p>
                <Link href={user.role === 'STUDENT' ? '/student/dashboard' : user.role === 'OFFICER' ? '/officer/dashboard' : '/committee/dashboard'} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-0 sm:inline-flex sm:space-x-4">
                <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm">
                  Apply for Scholarship
                </Link>
                <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                  Check Status / Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white py-16 sm:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-sm border border-gray-100 h-full transform transition hover:-translate-y-1">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI Verification</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Automated OCR and document intelligence for faster verification of caste and income certificates.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-sm border border-gray-100 h-full transform transition hover:-translate-y-1">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Real-time Tracking</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Transparent status tracking and automated SMS/Email notifications for deficiency resubmission.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-sm border border-gray-100 h-full transform transition hover:-translate-y-1">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Rapid Processing</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Unified platform reducing average application-to-selection processing time significantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
