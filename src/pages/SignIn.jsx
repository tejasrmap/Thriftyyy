import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, Zap, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signInWithGoogle } = useAuth();
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
    setIsSubmitting(true);
    try {
      setError("");
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.response?.data?.error || "Invalid credentials.";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 page-transition relative overflow-hidden grain-texture">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-earth-sage/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-earth-clay/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="organic-card p-12 md:p-20 space-y-16 bg-white shadow-[20px_20px_0px_rgba(69,26,3,0.05)]"
        >
          <div className="text-center space-y-8">
             <Link to="/" className="inline-flex items-center gap-4 mb-4 group">
               <div className="w-14 h-14 bg-earth-clay text-earth-linen flex items-center justify-center font-display font-black text-2xl rounded-2xl shadow-xl transition-transform group-hover:rotate-12 group-hover:scale-110">T</div>
               <span className="font-display font-black text-2xl tracking-tighter text-earth-bark uppercase">Thriftyy</span>
            </Link>
            <h1 className="text-6xl md:text-7xl font-display font-black text-earth-bark tracking-tighter leading-none">Access <br/> <span className="text-earth-clay italic">Portal.</span></h1>
            <p className="text-earth-bark/40 text-[11px] font-black uppercase tracking-[0.5em]">Initialize Member Session</p>
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

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
               <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Member Identity (Email)</Label>
               <div className="relative group">
                 <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-clay transition-colors" />
                 <Input
                   type="email"
                   placeholder="your@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="h-18 bg-earth-linen/30 border-earth-bark/10 rounded-[1.5rem] px-16 font-bold text-earth-bark placeholder:text-earth-bark/10 focus:ring-earth-clay focus:border-earth-clay transition-all shadow-inner"
                   required
                 />
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between px-6">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40">Access Key</Label>
                  <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-earth-clay hover:text-earth-bark transition-colors">Forgotten Key?</Link>
               </div>
               <div className="relative group">
                 <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-clay transition-colors" />
                 <Input
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="h-18 bg-earth-linen/30 border-earth-bark/10 rounded-[1.5rem] px-16 font-bold text-earth-bark placeholder:text-earth-bark/10 focus:ring-earth-clay focus:border-earth-clay transition-all shadow-inner"
                   required
                 />
               </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="clay-button w-full h-24 text-sm uppercase tracking-[0.3em] shadow-2xl mt-6"
            >
              {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <div className="flex items-center gap-4">Initialize Session <ArrowRight className="w-6 h-6" /></div>}
            </Button>
          </form>

          <div className="space-y-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-earth-bark/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/20">
                <span className="px-8 bg-white rounded-full">Protocol Swap</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-18 rounded-[1.5rem] bg-white border border-earth-bark/10 text-earth-bark text-[11px] font-black uppercase tracking-widest hover:bg-earth-linen transition-all shadow-sm flex items-center justify-center gap-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Identity
            </Button>
          </div>

          <div className="text-center pt-12 border-t border-earth-bark/5">
            <p className="text-earth-bark/30 text-[11px] font-black uppercase tracking-widest leading-loose">
              Not a member yet? <br/>
              <Link to="/signup" className="text-earth-clay hover:text-earth-bark transition-colors underline underline-offset-8 decoration-earth-clay/20 mt-4 inline-block font-black uppercase tracking-widest">
                Initiate Registration
              </Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
           <ShieldCheck className="w-5 h-5 text-earth-sage" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark">Secured Archival Node</span>
        </div>
      </div>
    </div>
  );
}
