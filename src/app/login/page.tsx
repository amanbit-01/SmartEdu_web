"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoStore, Role } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "STUDENT" as Role,
  });
  const [error, setError] = useState("");

  const handleDemoLogin = (role: Role) => {
    const user = {
      id: "demo-" + role.toLowerCase(),
      full_name: "Demo " + role,
      email: role.toLowerCase() + "@demo.com",
      role: role
    };
    demoStore.seedDemoData();
    demoStore.login(user);
    redirectToDashboard(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Try to find registered user
    const users = demoStore.getUsers();
    let user = users.find(u => u.email === formData.email && u.role === formData.role);
    
    // If not found, create a temporary demo session
    if (!user) {
      user = {
        id: "temp-" + Date.now().toString(),
        full_name: formData.email.split("@")[0],
        email: formData.email,
        role: formData.role
      };
    }

    demoStore.login(user);
    redirectToDashboard(user.role);
  };

  const redirectToDashboard = (role: Role) => {
    if (role === "STUDENT") window.location.href = "/student/dashboard";
    else if (role === "OFFICER") window.location.href = "/officer/dashboard";
    else if (role === "COMMITTEE") window.location.href = "/committee/dashboard";
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 text-center text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 px-4 py-2 rounded-md">
        ⚠️ Prototype Demo: Credentials are not authenticated.
      </div>
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              create a new applicant account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                className="mt-1 block w-full pl-3 pr-10 py-3 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                <option value="STUDENT">Student</option>
                <option value="OFFICER">Reviewing Officer</option>
                <option value="COMMITTEE">Selection Committee</option>
              </select>
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email-address"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter any dummy password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Quick Demo Access</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button onClick={() => handleDemoLogin("STUDENT")} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Student
            </button>
            <button onClick={() => handleDemoLogin("OFFICER")} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Officer
            </button>
            <button onClick={() => handleDemoLogin("COMMITTEE")} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Committee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
