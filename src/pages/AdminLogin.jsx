import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, Key, Loader2 } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
      setError(err.response?.data?.message || err.message || "Unauthorized access attempt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-6 relative overflow-hidden page-transition">
      <div className="noise-overlay" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full vogue-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-[3.5rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] border border-black/5 p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold opacity-30" />
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-ivory border border-black/5 mb-10 shadow-sm"
            >
              <Key className="w-10 h-10 text-brand-gold" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-black uppercase tracking-tighter leading-none mb-4">
              Management <br/> <span className="italic font-normal">Portal.</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Authorised Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Digital Identity</label>
               <div className="relative group">
                 <Input
                   type="email"
                   placeholder="admin@thriftyy.studio"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="h-20 bg-brand-ivory border-black/5 rounded-3xl px-8 font-bold text-black placeholder:text-black/20 focus:ring-black focus:border-black transition-all"
                   required
                 />
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Access Key</label>
               <div className="relative">
                 <Input
                   type={showPassword ? "text" : "password"}
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="h-20 bg-brand-ivory border-black/5 rounded-3xl px-8 font-bold text-black placeholder:text-black/20 focus:ring-black focus:border-black transition-all"
                   required
                 />
                 <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-24 rounded-full bg-black text-white font-black text-lg uppercase tracking-[0.3em] hover:bg-brand-gold hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/10 mt-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Validating
                </div>
              ) : (
                <>Initialize Access <ArrowRight className="ml-4 w-5 h-5" /></>
              )}
            </Button>
          </form>

          <div className="mt-16 flex flex-col items-center gap-6">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black/30">End-to-End Encryption Active</span>
             </div>
             <Link 
               to="/"
               className="text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors"
             >
               Return to Public Studio
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
