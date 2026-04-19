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
      <footer className="bg-white border-t border-black/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-lg">
              T
            </div>
            <span className="font-bold text-xl tracking-tighter text-black">
              Thriftyy
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Link to="/browse" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black">Collection</Link>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black">Privacy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black">Terms</a>
          </div>
          <div className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 Thriftyy Official Archive
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
