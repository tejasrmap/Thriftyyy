import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2, ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles, Zap, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      setError("");
      await signUp(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 page-transition relative overflow-hidden grain-texture">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-earth-sage/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-earth-clay/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="organic-card p-12 md:p-20 space-y-16 bg-white shadow-[20px_20px_0px_rgba(69,26,3,0.05)]"
        >
          <div className="text-center space-y-8">
             <Link to="/" className="inline-flex items-center gap-4 mb-4 group">
               <div className="w-14 h-14 bg-earth-sage text-earth-linen flex items-center justify-center font-display font-black text-2xl rounded-2xl shadow-xl transition-transform group-hover:rotate-12 group-hover:scale-110">T</div>
               <span className="font-display font-black text-2xl tracking-tighter text-earth-bark uppercase">Thriftyy</span>
            </Link>
            <h1 className="text-6xl md:text-7xl font-display font-black text-earth-bark tracking-tighter leading-none">Join the <br/> <span className="text-earth-sage italic">Collective.</span></h1>
            <p className="text-earth-bark/40 text-[11px] font-black uppercase tracking-[0.5em]">Initiate Archival Identity</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[1.5rem] bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-[0.2em] text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
               <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Full Nomenclature</Label>
               <div className="relative group">
                 <User className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-sage transition-colors" />
                 <Input
                   type="text"
                   placeholder="Your Legal Name"
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="h-18 bg-earth-linen/30 border-earth-bark/10 rounded-[1.5rem] px-16 font-bold text-earth-bark placeholder:text-earth-bark/10 focus:ring-earth-sage focus:border-earth-sage transition-all shadow-inner"
                   required
                 />
               </div>
            </div>
            <div className="space-y-4">
               <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Member Identity (Email)</Label>
               <div className="relative group">
                 <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-sage transition-colors" />
                 <Input
                   type="email"
                   placeholder="your@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="h-18 bg-earth-linen/30 border-earth-bark/10 rounded-[1.5rem] px-16 font-bold text-earth-bark placeholder:text-earth-bark/10 focus:ring-earth-sage focus:border-earth-sage transition-all shadow-inner"
                   required
                 />
               </div>
            </div>
            <div className="space-y-4">
               <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Initial Access Key</Label>
               <div className="relative group">
                 <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-sage transition-colors" />
                 <Input
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="h-18 bg-earth-linen/30 border-earth-bark/10 rounded-[1.5rem] px-16 font-bold text-earth-bark placeholder:text-earth-bark/10 focus:ring-earth-sage focus:border-earth-sage transition-all shadow-inner"
                   required
                 />
               </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="sage-button w-full h-24 text-sm uppercase tracking-[0.3em] shadow-2xl mt-6"
            >
              {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <div className="flex items-center gap-4">Finalize Identity <ArrowRight className="w-6 h-6" /></div>}
            </Button>
          </form>

          <div className="text-center pt-12 border-t border-earth-bark/5">
            <p className="text-earth-bark/30 text-[11px] font-black uppercase tracking-widest leading-loose">
              Already a member? <br/>
              <Link to="/signin" className="text-earth-sage hover:text-earth-bark transition-colors underline underline-offset-8 decoration-earth-sage/20 mt-4 inline-block font-black uppercase tracking-widest">
                Initialize Session
              </Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
           <Leaf className="w-5 h-5 text-earth-sage" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark">Eco-Secure Identity Protocol</span>
        </div>
      </div>
    </div>
  );
}
