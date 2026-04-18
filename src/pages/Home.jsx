import { Link } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-20 md:opacity-[0.85] rounded-bl-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-10 md:pt-20"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary border border-border/60 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-foreground/70" /> Premium Designer Rentals
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-foreground">
              Own the moment, <br />
              <span className="text-muted-foreground font-semibold">rent the look.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed font-medium">
              Access thousands of high-end authentic designer pieces for a
              fraction of the retail price. Delivered to your door.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/browse"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 text-base h-14 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5",
                )}
              >
                Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <div className="flex items-center -space-x-3 pl-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-11 h-11 rounded-full border-[3px] border-background bg-secondary overflow-hidden shadow-sm"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                    />
                  </div>
                ))}
                <span className="pl-5 text-sm font-semibold text-muted-foreground">
                  Loved by 10k+
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              How LuxeRent Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-medium">
              A seamless experience from booking to return.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Sparkles,
                title: "1. Select",
                desc: "Browse our curated collection of designer styles and select your rental period.",
              },
              {
                icon: ShieldCheck,
                title: "2. Wear",
                desc: "Receive your dry-cleaned garment in a pristine garment bag, ready to wear.",
              },
              {
                icon: RefreshCw,
                title: "3. Return",
                desc: "Send it back in the prepaid packaging. We'll handle the dry cleaning.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-3xl bg-secondary/50 border border-border/50 flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                  <step.icon className="w-9 h-9 text-foreground/80 group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview (Bento) */}
      <section className="py-32 bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-14">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Curated for You
              </h2>
              <p className="mt-2 text-muted-foreground font-medium text-lg">
                Discover outfits tailored for your next big event.
              </p>
            </div>
            <Link
              to="/browse"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:inline-flex rounded-full bg-background hover:bg-secondary border-border shadow-sm",
              )}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] bento-grid">
            <Link
              to="/browse"
              className="md:col-span-2 md:row-span-2 relative rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=1000&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-out"
                alt="Wedding"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 inline-block border border-white/20">
                  Popular
                </div>
                <h3 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                  Wedding Guest
                </h3>
                <p className="text-white/80 max-w-sm text-base md:text-lg font-medium leading-relaxed opacity-90">
                  Elevate your presence with stunning designer pieces perfect
                  for any wedding code.
                </p>
              </div>
            </Link>

            <Link
              to="/browse"
              className="md:col-span-2 relative rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-out"
                alt="Casual"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Elevated Casual
                </h3>
              </div>
            </Link>

            <Link
              to="/browse"
              className="md:col-span-1 relative rounded-[32px] overflow-hidden group bg-[#0A0A0A] border border-border/50 shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Formal</h3>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Gowns & Tuxedos</p>
                <ArrowRight className="text-white mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0" />
              </div>
            </Link>

            <Link
              to="/browse"
              className="md:col-span-1 relative rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-out"
                alt="Party"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">Party Wear</h3>
              </div>
            </Link>
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/browse"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full w-full",
              )}
            >
              View All Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
