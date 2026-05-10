/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { AdminLayout } from "./components/AdminLayout";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Browse = lazy(() => import("./pages/Browse").then(m => ({ default: m.Browse })));
const ClothDetails = lazy(() => import("./pages/ClothDetails").then(m => ({ default: m.ClothDetails })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));
const SignIn = lazy(() => import("./pages/SignIn").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("./pages/SignUp").then(m => ({ default: m.SignUp })));
const AdminLogin = lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview").then(m => ({ default: m.AdminOverview })));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory").then(m => ({ default: m.AdminInventory })));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })));
const AdminEmployees = lazy(() => import("./pages/admin/AdminEmployees").then(m => ({ default: m.AdminEmployees })));

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-ivory text-black font-sans selection:bg-black selection:text-white antialiased overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-black/5 py-32 relative z-10 overflow-hidden">
        <div className="vogue-grid opacity-10 absolute inset-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
             <div className="md:col-span-2 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-display font-black text-xl rounded-2xl shadow-xl">
                    T
                  </div>
                  <span className="font-display font-black text-3xl tracking-tighter text-black uppercase">
                    Thriftyy
                  </span>
                </div>
                <p className="text-black/40 text-lg font-medium max-w-md leading-relaxed">
                  A high-fashion archival collective providing exclusive access to curated designer pieces for the modern visionary.
                </p>
             </div>
             <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">The Collective</h4>
                <ul className="space-y-4">
                  <li><Link to="/browse" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Archive</Link></li>
                  <li><Link to="/signin" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Studio Access</Link></li>
                  <li><a href="#" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Curators</a></li>
                </ul>
             </div>
             <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Protocol</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Governance</a></li>
                  <li><a href="#" className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-brand-gold transition-colors">Security</a></li>
                </ul>
             </div>
          </div>
          <div className="pt-20 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-black/20 text-[9px] font-black uppercase tracking-[0.4em]">
              © 2026 Thriftyy Boutique Archive • All Rights Reserved
            </div>
            <div className="flex items-center gap-10">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/10">High Fidelity Digital Experience</span>
            </div>
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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Strict Admin Zone */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/employees" element={<AdminEmployees />} />
              </Route>
              
              {/* Public Consumer Zone */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/cloth/:id" element={<ClothDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
