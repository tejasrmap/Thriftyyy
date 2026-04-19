import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
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
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try a different email.");
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
          Join the Circle
        </h2>
        <p className="mt-4 text-center text-sm text-zinc-400 font-medium tracking-widest uppercase">
          Start your boutique experience
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
              <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-black focus:bg-white focus:border-black/10 transition-all font-bold placeholder:text-zinc-300"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-black focus:bg-white focus:border-black/10 transition-all font-bold placeholder:text-zinc-300"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-black focus:bg-white focus:border-black/10 transition-all font-bold placeholder:text-zinc-300"
                placeholder="Min. 6 characters"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-bold bg-black text-white hover:bg-zinc-800 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-12 text-center border-t border-black/5 pt-8">
            <span className="text-zinc-300 text-[10px] font-bold mr-2 uppercase tracking-widest">Already member?</span>
            <Link
              to="/signin"
              className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-all underline underline-offset-8"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
