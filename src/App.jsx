/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
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

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black antialiased">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="py-24 bg-[#050510] border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-2xl rounded-xl shadow-2xl">
                T
              </div>
              <span className="font-bold text-2xl tracking-tighter glow-text">
                Thriftyy
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-xs text-center md:text-left font-medium leading-relaxed">
              Elevating the rental experience through curated designer collections and seamless circular fashion.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-white/80 font-bold text-sm tracking-widest uppercase">
              © 2026 Thriftyy Official
            </div>
            <div className="text-white/30 text-xs font-medium">
              Premium Clothing Rental • Built for Excellence
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
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
