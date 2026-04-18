/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { ClothDetails } from "./pages/ClothDetails";
import { Dashboard } from "./pages/Dashboard";
import { Admin } from "./pages/Admin";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans tracking-tight selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
      <footer className="border-t py-16 bg-card mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="w-9 h-9 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl rounded-lg shadow-sm">
              L
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              LuxeRent
            </span>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            © 2026 LuxeRent. Premium Clothing Rental. Built for Final Project.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Strict Admin Zone */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            
            {/* Public Consumer Zone */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/cloth/:id" element={<ClothDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
