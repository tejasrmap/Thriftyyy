import { useState, useEffect } from "react";
import axios from "axios";
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Edit2, 
  Trash2, 
  Layers,
  Filter
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { cn } from "../../lib/utils";

export function AdminInventory() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("casual");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/clothes");
      setClothes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const filteredClothes = clothes.filter(cloth => {
    const matchesSearch = cloth.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cloth._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || cloth.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-earth-clay border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
         <div>
            <h2 className="text-5xl font-display font-black text-earth-bark tracking-tight uppercase">Archive <span className="text-earth-clay italic">Inventory.</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/30 mt-2">Physical Asset Registry Manifest</p>
         </div>

         <Sheet>
            <SheetTrigger render={
              <Button className="clay-button h-24 px-12 text-xs uppercase tracking-widest shadow-2xl">
                <PlusCircle className="w-6 h-6 mr-4" /> Archive New Piece
              </Button>
            } />
            <SheetContent className="w-full sm:w-[650px] bg-earth-linen border-l-earth-bark/10 p-16 overflow-y-auto grain-texture">
               <SheetHeader className="mb-16">
                  <SheetTitle className="text-6xl font-display font-black tracking-tighter text-earth-bark leading-none">{editingItem ? "Edit" : "New"} <span className="text-earth-clay italic">Archival.</span></SheetTitle>
                  <SheetDescription className="text-earth-bark/40 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Structural Asset Registry</SheetDescription>
               </SheetHeader>
               <form onSubmit={editingItem ? handleUpdateCloth : handleCreateCloth} className="space-y-12">
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
                        <Input type="file" onChange={e => setImage(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="text-center group-hover:scale-110 transition-transform">
                           <Sparkles className="w-10 h-10 text-earth-clay mx-auto mb-3 opacity-40" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-earth-bark/30">{image ? image.name : (editingItem ? "Change Visual Asset" : "Initialize Upload")}</p>
                        </div>
                     </div>
                  </div>
                  <Button type="submit" disabled={submitting} className="clay-button w-full h-24 text-xs uppercase tracking-[0.3em] shadow-2xl">
                     {submitting ? "Processing Asset..." : (editingItem ? "Confirm Modification" : "Confirm Archival Entry")}
                  </Button>
               </form>
            </SheetContent>
         </Sheet>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-8">
         <div className="flex-1 flex items-center gap-5 bg-white organic-card px-8 py-2 border-earth-bark/5 shadow-sm">
            <Search className="w-5 h-5 text-earth-bark/20" />
            <input 
              type="text" 
              placeholder="Search by title or Reference ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-earth-bark placeholder:text-earth-bark/10 flex-1 h-14"
            />
         </div>
         <div className="flex items-center gap-4 bg-white organic-card px-6 py-2 border-earth-bark/5 shadow-sm min-w-[240px]">
            <Filter className="w-4 h-4 text-earth-bark/20" />
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-earth-bark flex-1 cursor-pointer h-14"
            >
               <option value="all">All Classifications</option>
               <option value="casual">Casual</option>
               <option value="formal">Formal</option>
               <option value="party">Party</option>
               <option value="wedding">Wedding</option>
            </select>
         </div>
      </div>

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
               {filteredClothes.map(cloth => (
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
               {filteredClothes.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                       <Layers className="w-12 h-12 text-earth-bark/10 mx-auto mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/20">No assets matching the criteria</p>
                    </TableCell>
                 </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
    </div>
  );
}
