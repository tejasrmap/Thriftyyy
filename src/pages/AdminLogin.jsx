import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ShieldAlert, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { adminSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await adminSignIn(email, password);
      navigate("/admin");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Authentication failed. Unauthorized access.";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Strict administrative styling */}
      <div className="absolute top-0 w-full h-1 bg-red-600/80" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-5xl font-display font-extrabold tracking-architectural uppercase leading-[0.9]">
          Archive <br />
          <span className="text-red-600">Control.</span>
        </h2>
        <p className="mt-4 text-center text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">
          Restricted Auth Portal
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0"
      >
        <div className="bg-[#111111] py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">
                {typeof error === "string" ? error : (error.message || JSON.stringify(error))}
              </div>
            )}
            <div>
              <Label htmlFor="email" className="font-semibold text-gray-300">Admin Email</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-black/50 text-white border-white/20 focus:border-red-500 transition-colors"
                  placeholder="admin@thriftyy.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="font-semibold text-gray-300">Passcode</Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-black/50 text-white border-white/20 focus:border-red-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-bold bg-white text-black hover:bg-gray-200 transition-colors mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center pt-4 border-t border-white/10">
             <span className="text-xs text-gray-500 font-mono block">
               Unauthorized access is strictly prohibited and logged.
             </span>
             <a href="/" className="text-xs text-gray-400 underline hover:text-white mt-1 block">
               Return to public facing site
             </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
