import { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  PlusCircle,
  Users,
  UserPlus,
  Trash2,
  Edit2,
  X,
  Settings,
  ShieldCheck,
  Calendar,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Database,
  Search,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  Leaf,
  Sun,
  Wind
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Switch } from "../components/ui/switch";

export function Admin() {
  const { role, user, permissions: userPermissions } = useAuth();
  const permissions = role === "admin" ? { canManageInventory: true, canSeeRevenue: true, canManageBookings: true } : userPermissions;
  const [clothes, setClothes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("casual");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Employee form state
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPass, setEmpPass] = useState("");
  const [empPerms, setEmpPerms] = useState({
    canManageInventory: true,
    canSeeRevenue: false,
    canManageBookings: true
  });

  const fetchData = async () => {
    try {
      const [clothesRes, bookingsRes] = await Promise.all([
        axios.get("/api/clothes"),
        axios.get("/api/bookings")
      ]);
      setClothes(clothesRes.data);
      setBookings(bookingsRes.data);
      
      if (role === "admin") {
        try {
          const empRes = await axios.get("/api/admin/employees");
          setEmployees(empRes.data);
        } catch (err) {
          console.error("Employee Fetch Error:", err.response?.status, err.message);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin" || role === "employee") {
      fetchData();
    }
  }, [role]);

  const handleCreateCloth = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data: imageUrl } = await axios.post("/api/upload", formData);
      await axios.post("/api/clothes", {
        title, description, category, size, pricePerDay: Number(price), imageUrl
      });
      fetchData();
      resetForm();
    } catch (error) {
      alert("Error adding item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCloth = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalUrl = editingItem.imageUrl;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const { data: imageUrl } = await axios.post("/api/upload", formData);
        finalUrl = imageUrl;
      }

      await axios.put(`/api/clothes/${editingItem._id}`, {
        title, description, category, size, pricePerDay: Number(price), imageUrl: finalUrl
      });
      fetchData();
      setEditingItem(null);
    } catch (error) {
      alert("Error updating item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCloth = async (id) => {
    if (!window.confirm("Permanent deletion?")) return;
    try {
      await axios.delete(`/api/clothes/${id}`);
      fetchData();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setPrice(""); setEditingItem(null); setImage(null);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setSize(item.size);
    setPrice(item.pricePerDay);
  };

  const toggleEmpPermission = async (id, key, current) => {
    try {
      await axios.put(`/api/admin/employees/${id}/permissions`, {
        permissions: { [key]: !current }
      });
      fetchData();
    } catch (error) {
       console.error(error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Remove staff access?")) return;
    try {
      await axios.delete(`/api/admin/employees/${id}`);
      fetchData();
    } catch (error) {
       alert("Failed to remove staff");
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/employees", {
        fullName: empName, email: empEmail, password: empPass, permissions: empPerms
      });
      fetchData();
      setEmpName(""); setEmpEmail(""); setEmpPass("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add employee");
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center grain-texture"><div className="w-12 h-12 border-4 border-earth-clay border-t-transparent rounded-full animate-spin" /></div>;

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter((b) => b.status === "booked").length;

  return (
    <div className="space-y-16 pb-20 grain-texture">
      {/* Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 organic-card p-12 md:p-16 bg-white shadow-[12px_12px_0px_rgba(69,26,3,0.05)]">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-earth-sage text-earth-linen rounded-xl flex items-center justify-center shadow-lg">
                 <Sun className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-sage">Studio Archive Node v4</span>
           </div>
           <h1 className="font-display font-black text-6xl md:text-9xl tracking-tighter text-earth-bark leading-none">
             Collective <br /> <span className="text-earth-clay italic">Management.</span>
           </h1>
        </div>

        <div className="lg:col-span-4 organic-card p-12 flex flex-col justify-between bg-earth-clay text-earth-linen shadow-[12px_12px_0px_rgba(153,27,27,0.1)] border-transparent">
           <div className="flex justify-between items-start">
              <TrendingUp className="w-10 h-10 text-earth-linen/30" />
              <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Active Flux</div>
           </div>
           <div>
              <p className="text-earth-linen/40 text-[10px] font-black uppercase tracking-widest mb-3">Gross Archive Revenue</p>
              <h2 className="text-6xl font-display font-black tracking-tighter">₹{totalRevenue.toLocaleString()}</h2>
           </div>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {[
          { label: "Active Leases", value: activeBookings, icon: Wind, color: "bg-earth-sage" },
          { label: "Archived Pieces", value: clothes.length, icon: Layers, color: "bg-earth-clay" },
          { label: "Member Growth", value: "+18%", icon: Users, color: "bg-earth-saffron" },
          { label: "System Health", value: "Verified", icon: ShieldCheck, color: "bg-earth-bark" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      <Tabs defaultValue="inventory" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
           <TabsList className="p-2 bg-earth-linen border border-earth-bark/10 rounded-[2.5rem] h-24 shadow-inner">
             <TabsTrigger value="inventory" className="rounded-full px-12 h-full font-black text-[12px] uppercase tracking-widest data-[state=active]:bg-earth-clay data-[state=active]:text-earth-linen transition-all">Archive</TabsTrigger>
             <TabsTrigger value="bookings" className="rounded-full px-12 h-full font-black text-[12px] uppercase tracking-widest data-[state=active]:bg-earth-clay data-[state=active]:text-earth-linen transition-all">Manifest</TabsTrigger>
             {role === "admin" && (
               <TabsTrigger value="employees" className="rounded-full px-12 h-full font-black text-[12px] uppercase tracking-widest data-[state=active]:bg-earth-clay data-[state=active]:text-earth-linen transition-all">Personnel</TabsTrigger>
             )}
           </TabsList>

           {permissions.canManageInventory && (
              <Sheet>
              <SheetTrigger render={
                <Button className="clay-button h-24 px-12 text-xs uppercase tracking-widest shadow-2xl">
                  <PlusCircle className="w-6 h-6 mr-4" /> Archive New Piece
                </Button>
              } />
                <SheetContent className="w-full sm:w-[650px] bg-earth-linen border-l-earth-bark/10 p-16 overflow-y-auto grain-texture">
                   <SheetHeader className="mb-16">
                      <SheetTitle className="text-6xl font-display font-black tracking-tighter text-earth-bark leading-none">New <span className="text-earth-clay italic">Archival.</span></SheetTitle>
                      <SheetDescription className="text-earth-bark/40 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Structural Asset Registry</SheetDescription>
                   </SheetHeader>
                   <form onSubmit={handleCreateCloth} className="space-y-12">
                      <div className="space-y-4">
                         <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Nomenclature / Identity</Label>
                         <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Saffron Archive Gown" className="h-18 bg-white border-earth-bark/10 rounded-[1.5rem] px-8 font-bold text-lg text-earth-bark" />
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Classification</Label>
                           <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger className="h-18 bg-white border-earth-bark/10 rounded-[1.5rem] px-8 font-black uppercase tracking-[0.2em] text-[11px]"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl border-earth-bark/10"><SelectItem value="casual">Casual</SelectItem><SelectItem value="formal">Formal</SelectItem><SelectItem value="party">Party</SelectItem><SelectItem value="wedding">Wedding</SelectItem></SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Structural Size</Label>
                           <Select value={size} onValueChange={setSize}>
                              <SelectTrigger className="h-18 bg-white border-earth-bark/10 rounded-[1.5rem] px-8 font-black uppercase tracking-[0.2em] text-[11px]"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl border-earth-bark/10"><SelectItem value="S">S</SelectItem><SelectItem value="M">M</SelectItem><SelectItem value="L">L</SelectItem><SelectItem value="XL">XL</SelectItem></SelectContent>
                           </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Daily Lease Rate (₹)</Label>
                         <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="h-18 bg-white border-earth-bark/10 rounded-[1.5rem] px-8 font-black text-2xl text-earth-bark" />
                      </div>
                      <div className="space-y-4">
                         <Label className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Visual Proof</Label>
                         <div className="h-40 border-2 border-dashed border-earth-bark/20 rounded-[2.5rem] bg-white/50 flex items-center justify-center relative group overflow-hidden transition-all hover:bg-white hover:border-earth-clay/30">
                            <Input type="file" onChange={e => setImage(e.target.files[0])} required className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="text-center group-hover:scale-110 transition-transform">
                               <Sparkles className="w-10 h-10 text-earth-clay mx-auto mb-3 opacity-40" />
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-earth-bark/30">{image ? image.name : "Initialize Upload"}</p>
                            </div>
                         </div>
                      </div>
                      <Button type="submit" disabled={submitting} className="clay-button w-full h-24 text-xs uppercase tracking-[0.3em] shadow-2xl">
                         {submitting ? "Processing Asset..." : "Confirm Archival Entry"}
                      </Button>
                   </form>
                </SheetContent>
              </Sheet>
           )}
        </div>

        <TabsContent value="inventory" className="space-y-12">
           <div className="organic-card bg-white shadow-xl overflow-hidden">
              <Table>
                 <TableHeader className="bg-earth-linen/50">
                    <TableRow className="border-earth-bark/5 hover:bg-transparent">
                       <TableHead className="px-12 py-8 font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Archive Reference</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Taxonomy</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Lease Rate</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Flux State</TableHead>
                       <TableHead className="text-right px-12 font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Modify</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {clothes.map(cloth => (
                       <TableRow key={cloth._id} className="border-earth-bark/5 hover:bg-earth-linen/30 transition-all group">
                          <TableCell className="px-12 py-10">
                             <div className="flex items-center gap-8">
                                <div className="w-20 h-28 rounded-2xl overflow-hidden bg-earth-linen border border-earth-bark/5 shadow-inner">
                                   <img src={cloth.imageUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                                <div className="space-y-1">
                                   <div className="font-black text-lg text-earth-bark uppercase tracking-tight">{cloth.title}</div>
                                   <div className="text-[10px] font-bold text-earth-bark/30 uppercase tracking-[0.3em]">Size {cloth.size} • REF-{cloth._id.slice(-6).toUpperCase()}</div>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="rounded-full border-earth-sage/20 text-earth-sage bg-earth-sage/5 uppercase tracking-[0.2em] text-[10px] px-4 py-1">{cloth.category}</Badge></TableCell>
                          <TableCell><div className="font-black text-2xl text-earth-bark">₹{cloth.pricePerDay}<span className="text-[10px] text-earth-bark/20 ml-2 font-black uppercase tracking-widest">Day</span></div></TableCell>
                          <TableCell>
                             <div className={cn(
                               "inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                               cloth.availability ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                             )}>
                                <div className={cn("w-2 h-2 rounded-full", cloth.availability ? "bg-emerald-600 animate-pulse" : "bg-red-600")} />
                                {cloth.availability ? "Available" : "Reserved"}
                             </div>
                          </TableCell>
                          <TableCell className="text-right px-12">
                             <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                <Button size="icon" variant="ghost" className="w-12 h-12 rounded-xl bg-earth-linen text-earth-bark/40 hover:text-earth-clay hover:bg-white hover:shadow-lg" onClick={() => openEdit(cloth)}>
                                   <Edit2 className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="w-12 h-12 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg" onClick={() => handleDeleteCloth(cloth._id)}>
                                   <Trash2 className="w-5 h-5" />
                                </Button>
                             </div>
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-12">
           <div className="organic-card bg-white shadow-xl overflow-hidden">
              <Table>
                 <TableHeader className="bg-earth-linen/50">
                    <TableRow className="border-earth-bark/5 hover:bg-transparent">
                       <TableHead className="px-12 py-8 font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Lease Payload</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Client Protocol</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Gross Value</TableHead>
                       <TableHead className="font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Flux State</TableHead>
                       <TableHead className="text-right px-12 font-black uppercase text-[11px] tracking-[0.3em] text-earth-bark/40">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {bookings.map(book => (
                       <TableRow key={book._id} className="border-earth-bark/5 hover:bg-earth-linen/30 transition-all group">
                          <TableCell className="px-12 py-10">
                             <div className="font-black text-earth-bark text-lg tracking-tighter uppercase">#LEASE-{book._id.slice(-6).toUpperCase()}</div>
                             <div className="text-[10px] font-bold text-earth-bark/30 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-earth-clay" /> {new Date(book.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="font-black text-earth-bark text-sm uppercase tracking-tight">{book.user?.fullName || "External Guest"}</div>
                             <div className="text-[10px] font-medium text-earth-bark/40 mt-1">{book.user?.email}</div>
                          </TableCell>
                          <TableCell><div className="font-black text-2xl text-earth-sage">₹{book.totalPrice}</div></TableCell>
                          <TableCell>
                             <Badge variant={book.status === "booked" ? "default" : "secondary"} className={cn("rounded-full uppercase tracking-[0.3em] text-[9px] px-5 py-1.5", book.status === "booked" ? "bg-earth-clay text-earth-linen shadow-lg" : "bg-earth-linen text-earth-bark/30")}>
                                {book.status}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right px-12">
                             {permissions.canManageBookings && book.status === "booked" && (
                                <Button className="h-12 px-8 rounded-full bg-white border border-earth-bark/10 text-earth-bark text-[10px] font-black uppercase tracking-widest hover:bg-earth-bark hover:text-white transition-all shadow-md" onClick={() => axios.put(`/api/bookings/${book._id}/return`).then(fetchData)}>
                                   Process Return
                                </Button>
                             )}
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </div>
        </TabsContent>

        {role === "admin" && (
           <TabsContent value="employees" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 organic-card bg-white shadow-xl overflow-hidden">
                    <div className="p-12 border-b border-earth-bark/5 bg-earth-linen/20">
                       <h3 className="text-3xl font-display font-black text-earth-bark tracking-tight">Personnel Nodes.</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/30 mt-2">Active access control manifest</p>
                    </div>
                    <Table>
                       <TableBody>
                          {employees.map(emp => (
                             <TableRow key={emp._id} className="border-earth-bark/5 hover:bg-earth-linen/30 transition-all group">
                                <TableCell className="px-12 py-10">
                                   <div className="flex items-center gap-8">
                                      <div className="w-16 h-16 bg-earth-clay text-earth-linen rounded-2xl flex items-center justify-center font-display font-black text-2xl shadow-xl">
                                         {emp.fullName.charAt(0)}
                                      </div>
                                      <div className="space-y-1">
                                         <div className="font-black text-earth-bark uppercase text-lg tracking-tighter">{emp.fullName}</div>
                                         <div className="text-[10px] font-medium text-earth-bark/30 uppercase tracking-widest">{emp.email}</div>
                                      </div>
                                   </div>
                                </TableCell>
                                <TableCell>
                                   <div className="flex items-center gap-16">
                                      <div className="flex items-center gap-4">
                                         <Switch checked={emp.permissions?.canManageInventory} onCheckedChange={() => toggleEmpPermission(emp._id, "canManageInventory", emp.permissions?.canManageInventory)} className="data-[state=checked]:bg-earth-sage" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40">Inventory</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                         <Switch checked={emp.permissions?.canSeeRevenue} onCheckedChange={() => toggleEmpPermission(emp._id, "canSeeRevenue", emp.permissions?.canSeeRevenue)} className="data-[state=checked]:bg-earth-sage" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40">Revenue</span>
                                      </div>
                                   </div>
                                </TableCell>
                                <TableCell className="text-right px-12">
                                   <Button size="icon" variant="ghost" className="w-12 h-12 rounded-xl bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white" onClick={() => handleDeleteEmployee(emp._id)}>
                                      <Trash2 className="w-5 h-5" />
                                   </Button>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </div>

                 <div className="organic-card p-12 bg-white shadow-xl space-y-12 group hover:organic-card-hover">
                    <div className="space-y-6">
                       <div className="w-16 h-16 bg-earth-saffron/10 text-earth-saffron flex items-center justify-center rounded-2xl">
                          <UserPlus className="w-8 h-8" />
                       </div>
                       <h3 className="text-4xl font-display font-black text-earth-bark tracking-tighter leading-none">Onboard <br/> <span className="text-earth-clay italic">Specialist.</span></h3>
                    </div>
                    <form onSubmit={handleAddEmployee} className="space-y-10">
                       <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Full Identity</Label>
                          <Input value={empName} onChange={e => setEmpName(e.target.value)} required placeholder="Staff Name" className="h-16 bg-earth-linen/50 border-earth-bark/10 rounded-[1.5rem] px-8 font-bold text-earth-bark" />
                       </div>
                       <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Access Email</Label>
                          <Input type="email" value={empEmail} onChange={e => setEmpEmail(e.target.value)} required placeholder="staff@thriftyy.studio" className="h-16 bg-earth-linen/50 border-earth-bark/10 rounded-[1.5rem] px-8 font-bold text-earth-bark" />
                       </div>
                       <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40 ml-6">Initial Secret</Label>
                          <Input type="password" value={empPass} onChange={e => setEmpPass(e.target.value)} required className="h-16 bg-earth-linen/50 border-earth-bark/10 rounded-[1.5rem] px-8 text-earth-bark" />
                       </div>
                       <Button type="submit" className="clay-button w-full h-20 text-[11px] uppercase tracking-[0.3em] shadow-xl">
                          Deploy Access Node
                       </Button>
                    </form>
                 </div>
              </div>
           </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
