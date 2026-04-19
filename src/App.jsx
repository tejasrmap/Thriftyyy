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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white antialiased">
      <Navbar />
      <main className="flex-1 w-full pt-20">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-black/[0.05] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="font-serif text-3xl tracking-tight text-black">
                Thriftyy
              </span>
              <p className="text-black/40 text-[13px] leading-relaxed max-w-xs font-medium">
                A digital archive of premium fashion circularity. Dedicated to the preservation of movement, style, and moment.
              </p>
            </div>
            
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Archive</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/browse" className="text-[13px] font-bold hover:text-black/40 transition-colors">The Collection</Link>
                <Link to="/browse?category=wedding" className="text-[13px] font-bold hover:text-black/40 transition-colors">Evening Wear</Link>
                <Link to="/browse?category=casual" className="text-[13px] font-bold hover:text-black/40 transition-colors">Daily Curations</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Identity</h4>
              <nav className="flex flex-col gap-4">
                <a href="#" className="text-[13px] font-bold hover:text-black/40 transition-colors">About the Studio</a>
                <a href="#" className="text-[13px] font-bold hover:text-black/40 transition-colors">Sustainability Report</a>
                <a href="#" className="text-[13px] font-bold hover:text-black/40 transition-colors">Stylist Circle</a>
              </nav>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-black/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em]">
              © 2026 Thriftyy Official Archive
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black transition-colors">Privacy</a>
              <a href="#" className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black transition-colors">Terms</a>
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
