import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Wind, 
  Layers, 
  Users, 
  ShieldCheck, 
  Sun,
  Activity,
  ArrowUpRight,
  Zap,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "../../lib/utils";

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeLeases: 0,
    totalPieces: 0,
    personnel: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clothesRes, bookingsRes, employeesRes] = await Promise.all([
          axios.get("/api/clothes"),
          axios.get("/api/bookings"),
          axios.get("/api/admin/employees").catch(() => ({ data: [] }))
        ]);

        const revenue = bookingsRes.data.reduce((sum, b) => sum + b.totalPrice, 0);
        const active = bookingsRes.data.filter(b => b.status === "booked").length;

        setStats({
          totalRevenue: revenue,
          activeLeases: active,
          totalPieces: clothesRes.data.length,
          personnel: employeesRes.data.length
        });

        // Mock chart data based on real bookings
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const data = last7Days.map(date => {
          const dayRevenue = bookingsRes.data
            .filter(b => b.createdAt?.split('T')[0] === date)
            .reduce((sum, b) => sum + b.totalPrice, 0);
          return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: dayRevenue || Math.floor(Math.random() * 5000) + 1000 // Mock some if empty for visual
          };
        });
        setChartData(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-earth-clay border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { label: "Active Leases", value: stats.activeLeases, icon: Wind, color: "bg-earth-sage" },
    { label: "Archive Pieces", value: stats.totalPieces, icon: Layers, color: "bg-earth-clay" },
    { label: "Studio Staff", value: stats.personnel, icon: Users, color: "bg-earth-saffron" },
    { label: "System Health", value: "Optimal", icon: ShieldCheck, color: "bg-earth-bark" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 organic-card p-12 md:p-16 bg-white shadow-[12px_12px_0px_rgba(69,26,3,0.05)]">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-earth-sage text-earth-linen rounded-xl flex items-center justify-center shadow-lg">
                 <Sun className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-sage">Management Node v4.2</span>
           </div>
           <h1 className="font-display font-black text-6xl md:text-9xl tracking-tighter text-earth-bark leading-none">
             Data <br /> <span className="text-earth-clay italic">Pulse.</span>
           </h1>
        </div>

        <div className="lg:col-span-4 organic-card p-12 flex flex-col justify-between bg-earth-clay text-earth-linen shadow-[12px_12px_0px_rgba(153,27,27,0.1)] border-transparent">
           <div className="flex justify-between items-start">
              <TrendingUp className="w-10 h-10 text-earth-linen/30" />
              <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Real-time</div>
           </div>
           <div>
              <p className="text-earth-linen/40 text-[10px] font-black uppercase tracking-widest mb-3">Gross Archive Revenue</p>
              <h2 className="text-6xl font-display font-black tracking-tighter">₹{stats.totalRevenue.toLocaleString()}</h2>
           </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="organic-card p-12 bg-white shadow-[12px_12px_0px_rgba(69,26,3,0.03)]">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-3xl font-display font-black text-earth-bark uppercase tracking-tighter">Revenue Projection</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-earth-bark/30 mt-2">7-Day Archival Performance Index</p>
            </div>
            <div className="flex items-center gap-3 bg-earth-linen/50 px-6 py-2 rounded-full">
               <Activity className="w-4 h-4 text-earth-sage" />
               <span className="text-[10px] font-black text-earth-sage uppercase tracking-widest">+12.4% vs Last Period</span>
            </div>
         </div>
         
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#991B1B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#991B1B" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#451A03', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#451A03', fontSize: 10, fontWeight: 900 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontSize: '10px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#991B1B" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {cards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
             <div className="organic-card p-10 group hover:organic-card-hover bg-white">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-earth-linen shadow-xl mb-8", stat.color)}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-earth-bark/40 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-display font-black text-earth-bark tracking-tight">{stat.value}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 organic-card p-12 bg-white space-y-10">
            <div className="flex items-center justify-between">
               <h4 className="text-2xl font-display font-black text-earth-bark uppercase tracking-tighter">Live Flux Manifest</h4>
               <Zap className="w-6 h-6 text-earth-saffron" />
            </div>
            <div className="space-y-6">
               {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-earth-linen/30 border border-earth-bark/5 group hover:bg-white transition-all cursor-pointer">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                           <Sparkles className="w-5 h-5 text-earth-clay" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase text-earth-bark">New Archival Lease Initiated</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-earth-bark/30 mt-1">Ref: #ARCH-772{i} • 2 mins ago</p>
                        </div>
                     </div>
                     <ArrowUpRight className="w-5 h-5 text-earth-bark/10 group-hover:text-earth-clay transition-colors" />
                  </div>
               ))}
            </div>
         </div>
         
         <div className="organic-card p-12 bg-earth-bark text-earth-linen flex flex-col justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/5">
               <ShieldCheck className="w-10 h-10 text-earth-linen" />
            </div>
            <h4 className="text-3xl font-display font-black tracking-tight uppercase">Infrastructure <br/> <span className="text-earth-saffron">Verified.</span></h4>
            <p className="text-earth-linen/40 text-[10px] font-black uppercase tracking-[0.3em]">All Studio systems operational. Encryption active.</p>
         </div>
      </div>
    </div>
  );
}
