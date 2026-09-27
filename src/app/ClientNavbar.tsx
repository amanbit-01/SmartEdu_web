"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { demoStore } from "@/lib/store";

export default function ClientNavbar() {
  const [user, setUser] = useState<{full_name: string, email: string} | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(demoStore.getCurrentUser());
  }, [pathname]); // Re-check when route changes

  const handleLogout = () => {
    demoStore.logout();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                MoTA
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">SmartEdu</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Sign Out ({user.full_name || user.email})
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  Sign In
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
