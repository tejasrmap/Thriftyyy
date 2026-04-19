import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";

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
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try a different email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] flex flex-col justify-center py-20 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white mb-12 transition-all group">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-black text-3xl rounded-[20px] shadow-[0_20px_50px_rgba(255,255,255,0.15)]">
            T
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tighter glow-text">
          Join the Circle
        </h2>
        <p className="mt-4 text-center text-sm text-white/40 font-bold tracking-widest uppercase">
          Start your boutique experience
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10 max-w-sm px-4 sm:px-0"
      >
        <div className="glass-card py-10 px-8 sm:px-12">
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest text-center animate-in fade-in zoom-in-95 duration-500">
              {error}
            </div>
          )}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 bg-white/5 border-white/5 rounded-2xl px-5 text-white focus:bg-white/10 focus:border-white/20 transition-all font-bold"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/5 rounded-2xl px-5 text-white focus:bg-white/10 focus:border-white/20 transition-all font-bold"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/5 border-white/5 rounded-2xl px-5 text-white focus:bg-white/10 focus:border-white/20 transition-all font-bold"
                placeholder="Min. 6 characters"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-black bg-white text-black hover:bg-white/90 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-4 bg-transparent text-white/20 font-black uppercase tracking-widest">
                  Quick Access
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full h-14 rounded-2xl text-sm font-bold bg-white/5 text-white border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <span className="text-white/20 text-xs font-bold mr-2 uppercase tracking-widest">Already a member?</span>
            <Link
              to="/signin"
              className="text-white text-xs font-black uppercase tracking-[0.2em] hover:glow-text transition-all underline decoration-white/20 underline-offset-8"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
