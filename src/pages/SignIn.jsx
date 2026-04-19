import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
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
      // Navigate to dashboard after slightly delaying so animation plays out
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-20 px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition-all group">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to repository
        </Link>
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-xl">
            T
          </div>
          <span className="font-bold text-2xl tracking-tighter text-black">
            Thriftyy
          </span>
        </div>
        <h2 className="text-center text-5xl font-display font-extrabold text-black tracking-tighter uppercase">
          Welcome Back
        </h2>
        <p className="mt-4 text-center text-sm text-zinc-400 font-medium">
          AUTHORIZED STYLIST ACCESS ONLY
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-12 sm:mx-auto sm:w-full sm:max-w-sm relative z-10"
      >
        <div className="bg-white py-12 px-10 border border-black/[0.03] shadow-[0_40px_80px_rgba(0,0,0,0.05)] rounded-[2rem]">
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Identity / Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-black focus:bg-white focus:border-black/10 transition-all font-bold placeholder:text-zinc-300"
                placeholder="identity@thriftyy.studio"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Secret Key</Label>
                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-black transition-colors">
                  Lost Key?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-black focus:bg-white focus:border-black/10 transition-all font-bold placeholder:text-zinc-300"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-bold bg-black text-white hover:bg-zinc-800 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authenticate"}
            </Button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/[0.05]" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-4 bg-white text-zinc-300 font-bold uppercase tracking-widest">
                  Secure Access
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest bg-white text-black border-black/[0.05] hover:bg-zinc-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" fillOpacity="0.8"/>
                </svg>
                Sync with Google
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <span className="text-zinc-300 text-[10px] font-bold mr-2 uppercase tracking-widest">New Stylist?</span>
            <Link
              to="/signup"
              className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-all underline underline-offset-8"
            >
              Apply for Access
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
