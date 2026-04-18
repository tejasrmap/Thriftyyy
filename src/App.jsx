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
