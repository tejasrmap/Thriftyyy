import { useState, useEffect } from "react";
import axios from "axios";
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
  Calendar
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";
import { Switch } from "../components/ui/switch";

export function Admin() {
  const { role, permissions: userPermissions } = useAuth();
  const permissions = role === "admin" ? { canManageInventory: true, canSeeRevenue: true, canManageBookings: true } : userPermissions;
  const [clothes, setClothes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding/editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("casual");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Selection/Edit state
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
        const empRes = await axios.get("/api/admin/employees");
        setEmployees(empRes.data);
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
    if (!window.confirm("Are you sure you want to delete this piece?")) return;
    try {
      await axios.delete(`/api/clothes/${id}`);
      fetchData();
    } catch (error) {
      alert("Delete failed");
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
    if (!window.confirm("Remove this staff member?")) return;
    try {
      await axios.delete(`/api/admin/employees/${id}`);
      fetchData();
    } catch (error) {
       alert("Failed to remove staff");
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

  if (role !== "admin" && role !== "employee") {
    return (
      <div className="min-h-screen pt-32 px-10 flex flex-col items-center">
         <ShieldCheck className="w-20 h-20 text-red-600 mb-6" />
         <h2 className="text-4xl font-display font-extrabold uppercase tracking-tighter">Access Forbidden</h2>
         <p className="text-zinc-500 mt-4 tracking-widest uppercase text-sm">Security clearance required.</p>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter((b) => b.status === "booked").length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {/* Dynamic Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-black text-white rounded-[2rem] flex items-center justify-center shadow-2xl">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-6xl font-display font-extrabold tracking-architectural text-black uppercase leading-[0.85]">
              Archive<br />
              <span className="text-zinc-400">Control.</span>
            </h1>
            <p className="text-zinc-400 mt-4 font-bold text-xs tracking-[0.3em] uppercase">
               Studio Terminal & Management
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-4">
           {permissions.canManageInventory && (
             <Sheet>
               <SheetTrigger asChild>
                 <Button className="rounded-full px-8 py-6 bg-black text-white hover:bg-zinc-800 shadow-xl transition-all font-bold uppercase tracking-widest text-xs">
                   <PlusCircle className="w-4 h-4 mr-2" /> Add New Piece
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-white p-10">
                 <SheetHeader className="mb-10 text-left">
                   <SheetTitle className="text-4xl font-display font-extrabold tracking-tighter uppercase">New Catalog Entry</SheetTitle>
                   <SheetDescription className="tracking-widest uppercase text-xs font-bold text-zinc-400">Expand the Thriftyy Collection</SheetDescription>
                 </SheetHeader>
                 <form onSubmit={handleCreateCloth} className="space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Title</Label>
                          <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Dior Shadow Vest" className="rounded-xl h-14" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Category</Label>
                             <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="rounded-xl h-14"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="casual">Casual</SelectItem><SelectItem value="formal">Formal</SelectItem><SelectItem value="party">Party</SelectItem><SelectItem value="wedding">Wedding</SelectItem></SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Size</Label>
                             <Select value={size} onValueChange={setSize}>
                                <SelectTrigger className="rounded-xl h-14"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="S">S</SelectItem><SelectItem value="M">M</SelectItem><SelectItem value="L">L</SelectItem><SelectItem value="XL">XL</SelectItem></SelectContent>
                             </Select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Daily Price ($)</Label>
                          <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="150" className="rounded-xl h-14" />
                       </div>
                       <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Imagery</Label>
                          <Input type="file" onChange={e => setImage(e.target.files[0])} required className="rounded-xl h-14 pt-3" />
                       </div>
                       <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Description</Label>
                          <Input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Premium velvet finish..." className="rounded-xl h-14" />
                       </div>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full py-8 rounded-2xl bg-black text-white font-black uppercase tracking-widest">
                       {submitting ? "Processing..." : "Confirm & Publish"}
                    </Button>
                 </form>
               </SheetContent>
             </Sheet>
           )}
        </div>
      </div>

      {/* Cinematic Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {permissions.canSeeRevenue !== false && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-[2.5rem] border-zinc-100 shadow-2xl shadow-zinc-200/50 p-8 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-black">
                   <DollarSign className="w-6 h-6" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 uppercase text-[10px] font-black px-3 py-1">+14%</Badge>
              </div>
              <h4 className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Total Management Revenue</h4>
              <div className="text-5xl font-display font-extrabold tracking-tighter">${totalRevenue.toLocaleString()}<span className="text-zinc-300 text-2xl">.00</span></div>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-2xl shadow-zinc-200/50 p-8 hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-black">
                 <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <h4 className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Active Studio Bookings</h4>
            <div className="text-5xl font-display font-extrabold tracking-tighter">{activeBookings}<span className="text-zinc-300 text-2xl"> UNITS</span></div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-2xl shadow-zinc-200/50 p-8 hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-black">
                 <Package className="w-6 h-6" />
              </div>
            </div>
            <h4 className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Live Catalog Depth</h4>
            <div className="text-5xl font-display font-extrabold tracking-tighter">{clothes.length}<span className="text-zinc-300 text-2xl"> PIECES</span></div>
          </Card>
        </motion.div>
      </div>

      {/* Main Studio Console */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-12 p-2 bg-zinc-100 rounded-[2rem] h-20 w-full md:w-auto">
          <TabsTrigger value="inventory" className="rounded-[1.5rem] px-10 h-full font-bold uppercase tracking-widest text-[11px] data-[state=active]:bg-black data-[state=active]:text-white">
            Inventory System
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-[1.5rem] px-10 h-full font-bold uppercase tracking-widest text-[11px] data-[state=active]:bg-black data-[state=active]:text-white">
            Order Flow
          </TabsTrigger>
          {role === "admin" && (
            <TabsTrigger value="employees" className="rounded-[1.5rem] px-10 h-full font-bold uppercase tracking-widest text-[11px] data-[state=active]:bg-black data-[state=active]:text-white">
              Studio Staff
            </TabsTrigger>
          )}
        </TabsList>

        {/* --- INVENTORY TAB --- */}
        <TabsContent value="inventory" className="space-y-10 focus:outline-none">
          <Card className="rounded-[3rem] border-zinc-100 shadow-3xl overflow-hidden bg-white">
             <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-display font-extrabold tracking-tighter uppercase">Product Catalog</h3>
                   <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Surgical control of digital inventory</p>
                </div>
             </div>
             <Table>
                <TableHeader>
                   <TableRow className="border-zinc-50 hover:bg-transparent">
                      <TableHead className="px-10 py-6 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Piece Overview</TableHead>
                      <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Category</TableHead>
                      <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Price/Day</TableHead>
                      <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Visibility</TableHead>
                      <TableHead className="text-right px-10 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {clothes.map(cloth => (
                     <TableRow key={cloth._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                        <TableCell className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                                 <img src={cloth.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <div className="font-display font-extrabold uppercase text-lg leading-tight">{cloth.title}</div>
                                 <div className="text-[10px] font-black uppercase text-zinc-400 mt-1 tracking-widest border border-zinc-200 px-2 py-0.5 rounded inline-block">Size {cloth.size}</div>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="uppercase text-[11px] font-black tracking-widest">{cloth.category}</TableCell>
                        <TableCell className="font-display font-extrabold text-lg">${cloth.pricePerDay}</TableCell>
                        <TableCell>
                           <Badge className={`rounded-lg px-3 py-1.5 uppercase text-[9px] font-black border-0 shadow-none ${cloth.availability ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"}`}>
                              {cloth.availability ? "On Gallery" : "Hidden"}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right px-10">
                           <div className="flex items-center justify-end gap-2">
                              {permissions.canManageInventory && (
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full hover:bg-black hover:text-white transition-all" onClick={() => openEdit(cloth)}>
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent side="right" className="w-[400px] sm:w-[500px] bg-white p-10">
                                      <SheetHeader className="mb-10 text-left">
                                         <SheetTitle className="text-4xl font-display font-extrabold tracking-tighter uppercase">Edit Evolution</SheetTitle>
                                         <SheetDescription className="tracking-widest uppercase text-xs font-bold text-zinc-400">Modify properties of {editingItem?.title}</SheetDescription>
                                      </SheetHeader>
                                      <form onSubmit={handleUpdateCloth} className="space-y-8">
                                         <div className="space-y-6">
                                            <div className="space-y-2">
                                               <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Title</Label>
                                               <Input value={title} onChange={e => setTitle(e.target.value)} required className="rounded-xl h-14" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                               <div className="space-y-2">
                                                  <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Category</Label>
                                                  <Select value={category} onValueChange={setCategory}>
                                                     <SelectTrigger className="rounded-xl h-14"><SelectValue /></SelectTrigger>
                                                     <SelectContent><SelectItem value="casual">Casual</SelectItem><SelectItem value="formal">Formal</SelectItem><SelectItem value="party">Party</SelectItem><SelectItem value="wedding">Wedding</SelectItem></SelectContent>
                                                  </Select>
                                               </div>
                                               <div className="space-y-2">
                                                  <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Size</Label>
                                                  <Select value={size} onValueChange={setSize}>
                                                     <SelectTrigger className="rounded-xl h-14"><SelectValue /></SelectTrigger>
                                                     <SelectContent><SelectItem value="S">S</SelectItem><SelectItem value="M">M</SelectItem><SelectItem value="L">L</SelectItem><SelectItem value="XL">XL</SelectItem></SelectContent>
                                                  </Select>
                                               </div>
                                            </div>
                                            <div className="space-y-2">
                                               <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Daily Rate ($)</Label>
                                               <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="rounded-xl h-14" />
                                            </div>
                                            <div className="space-y-2">
                                               <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">New Imagery (Optional)</Label>
                                               <Input type="file" onChange={e => setImage(e.target.files[0])} className="rounded-xl h-14 pt-3" />
                                            </div>
                                            <div className="space-y-2">
                                               <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Description</Label>
                                               <Input value={description} onChange={e => setDescription(e.target.value)} required className="rounded-xl h-14" />
                                            </div>
                                         </div>
                                         <Button type="submit" disabled={submitting} className="w-full py-8 rounded-2xl bg-black text-white font-black uppercase tracking-widest shadow-2xl">
                                            {submitting ? "Updating System..." : "Save Evolution"}
                                         </Button>
                                      </form>
                                  </SheetContent>
                                </Sheet>
                              )}
                              {role === "admin" && (
                                <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full hover:bg-red-50 text-zinc-300 hover:text-red-600 transition-all" onClick={() => handleDeleteCloth(cloth._id)}>
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                           </div>
                        </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
             </Table>
          </Card>
        </TabsContent>

        {/* --- BOOKINGS TAB --- */}
        <TabsContent value="bookings" className="focus:outline-none">
           <Card className="rounded-[3rem] border-zinc-100 shadow-3xl overflow-hidden bg-white">
              <Table>
                 <TableHeader>
                    <TableRow className="border-zinc-50 hover:bg-transparent">
                       <TableHead className="px-10 py-6 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Order Reference</TableHead>
                       <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Studio Client</TableHead>
                       <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Revenue Impact</TableHead>
                       <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Pulse</TableHead>
                       <TableHead className="text-right px-10 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Control</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {bookings.map(book => (
                       <TableRow key={book._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                          <TableCell className="px-10 py-8">
                             <div className="font-display font-extrabold uppercase tracking-tighter text-lg">ORD-{book._id.substring(18).toUpperCase()}</div>
                             <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" /> {new Date(book.startDate).toLocaleDateString()} — {new Date(book.endDate).toLocaleDateString()}
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="font-bold text-sm">{book.user?.fullName || "Private Studio User"}</div>
                             <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{book.user?.email}</div>
                          </TableCell>
                          <TableCell className="font-display font-extrabold text-lg">${book.totalPrice}</TableCell>
                          <TableCell>
                             <Badge className={`rounded-lg px-3 py-1.5 uppercase text-[9px] font-black border-0 shadow-none ${book.status === "booked" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400"}`}>
                                {book.status}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right px-10">
                             {permissions.canManageBookings && book.status === "booked" && (
                               <Button variant="outline" size="sm" className="rounded-full px-6 font-bold uppercase tracking-widest text-[9px] border-zinc-200" onClick={() => axios.put(`/api/bookings/${book._id}/return`).then(fetchData)}>
                                  Archive Return
                               </Button>
                             )}
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </Card>
        </TabsContent>

        {/* --- EMPLOYEES TAB (ADMIN ONLY) --- */}
        {role === "admin" && (
           <TabsContent value="employees" className="space-y-10 focus:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* Staff Roster */}
                 <div className="lg:col-span-2">
                    <Card className="rounded-[3rem] border-zinc-100 shadow-3xl overflow-hidden bg-white">
                       <div className="p-10 border-b border-zinc-50">
                          <h3 className="text-2xl font-display font-extrabold tracking-tighter uppercase">Staff Roster</h3>
                          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Management of Studio Clearance Levels</p>
                       </div>
                       <Table>
                          <TableHeader>
                             <TableRow className="border-zinc-50 hover:bg-transparent">
                                <TableHead className="px-10 py-6 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Staff Identity</TableHead>
                                <TableHead className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Clearance Switches</TableHead>
                                <TableHead className="text-right px-10 text-zinc-400 font-black uppercase text-[10px] tracking-widest">Action</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody>
                             {employees.map(emp => (
                               <TableRow key={emp._id} className="border-zinc-50">
                                  <TableCell className="px-10 py-8">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500">
                                           {emp.fullName.charAt(0)}
                                        </div>
                                        <div>
                                           <div className="font-display font-extrabold uppercase text-lg leading-tight">{emp.fullName}</div>
                                           <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{emp.email}</div>
                                        </div>
                                     </div>
                                  </TableCell>
                                  <TableCell>
                                     <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                           <Switch checked={emp.permissions?.canManageInventory} onCheckedChange={() => toggleEmpPermission(emp._id, "canManageInventory", emp.permissions?.canManageInventory)} />
                                           <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Inventory</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <Switch checked={emp.permissions?.canSeeRevenue} onCheckedChange={() => toggleEmpPermission(emp._id, "canSeeRevenue", emp.permissions?.canSeeRevenue)} />
                                           <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Finance</span>
                                        </div>
                                     </div>
                                  </TableCell>
                                  <TableCell className="text-right px-10">
                                      <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full hover:bg-red-50 text-zinc-300 hover:text-red-600 transition-all" onClick={() => handleDeleteEmployee(emp._id)}>
                                         <Trash2 className="w-4 h-4" />
                                      </Button>
                                  </TableCell>
                               </TableRow>
                             ))}
                          </TableBody>
                       </Table>
                    </Card>
                 </div>

                 {/* Onboarding Logic */}
                 <div>
                    <Card className="rounded-[3rem] border-zinc-100 shadow-3xl p-10 bg-white">
                       <div className="flex items-center gap-3 mb-8">
                          <UserPlus className="w-6 h-6 text-black" />
                          <h3 className="text-2xl font-display font-extrabold tracking-tighter uppercase">Clearance</h3>
                       </div>
                       <form onSubmit={handleAddEmployee} className="space-y-6">
                          <div className="space-y-2">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Full Name</Label>
                             <Input value={empName} onChange={e => setEmpName(e.target.value)} required placeholder="Studio Lead" className="rounded-xl h-12" />
                          </div>
                          <div className="space-y-2">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Identity Email</Label>
                             <Input type="email" value={empEmail} onChange={e => setEmpEmail(e.target.value)} required placeholder="staff@thriftyy.com" className="rounded-xl h-12" />
                          </div>
                          <div className="space-y-2">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Access Key (Pass)</Label>
                             <Input type="password" value={empPass} onChange={e => setEmpPass(e.target.value)} required className="rounded-xl h-12" />
                          </div>
                          <div className="py-4 space-y-4">
                             <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-400 block mb-2">Primary Clearances</Label>
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-tight">Invemtory Mgt</span>
                                <Switch checked={empPerms.canManageInventory} onCheckedChange={(val) => setEmpPerms({...empPerms, canManageInventory: val})} />
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-tight">Finance Access</span>
                                <Switch checked={empPerms.canSeeRevenue} onCheckedChange={(val) => setEmpPerms({...empPerms, canSeeRevenue: val})} />
                             </div>
                          </div>
                          <Button type="submit" className="w-full py-7 rounded-2xl bg-black text-white font-black uppercase tracking-widest mt-4 shadow-xl">
                             Onboard Staff
                          </Button>
                       </form>
                    </Card>
                 </div>
              </div>
           </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
