import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";

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
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col justify-center py-20 px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black mb-12 transition-all group">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to repository
        </Link>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-black mb-4">
          Studio Access
        </h2>
        <p className="text-black/40 text-sm font-medium tracking-tight">
          Enter your credentials to manage your archive.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white border border-black/[0.05] shadow-sm rounded-lg py-12 px-10">
          {error && (
            <div className="mb-8 p-4 rounded bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium leading-relaxed">
              {error}
            </div>
          )}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50 mb-3 block">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-[#F9F9F9] border-black/[0.03] rounded-md px-4 text-black focus:bg-white focus:border-black/10 transition-all font-medium placeholder:text-black/20"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">Password</Label>
                <a href="#" className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/30 hover:text-black transition-colors">
                  Reset?
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
                className="h-14 bg-[#F9F9F9] border-black/[0.03] rounded-md px-4 text-black focus:bg-white focus:border-black/10 transition-all font-medium placeholder:text-black/20"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-md text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all shadow-md mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/[0.05]">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-14 rounded-md text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black border-black/10 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" fillOpacity="0.8"/>
              </svg>
              Google Access
            </Button>
          </div>

          <div className="mt-10 text-center">
            <span className="text-black/30 text-[11px] font-bold mr-2 uppercase tracking-[0.1em]">New Identity?</span>
            <Link
              to="/signup"
              className="text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all underline decoration-black/10 underline-offset-8 hover:decoration-black"
            >
              Request Entry
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
