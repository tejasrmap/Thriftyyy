import { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  Calendar, 
  Filter, 
  Search,
  ArrowUpRight
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { cn } from "../../lib/utils";

export function AdminOrders() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/bookings");
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (id) => {
    try {
      await axios.put(`/api/bookings/${id}/return`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to process return");
    }
  };

  const filteredBookings = bookings.filter(book => {
    const matchesSearch = book.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.cloth?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-earth-clay border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div>
         <h2 className="text-5xl font-display font-black text-earth-bark tracking-tight uppercase">Order <span className="text-earth-clay italic">Manifest.</span></h2>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/30 mt-2">Active Archival Lease Registry</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-8">
         <div className="flex-1 flex items-center gap-5 bg-white organic-card px-8 py-2 border-earth-bark/5 shadow-sm">
            <Search className="w-5 h-5 text-earth-bark/20" />
            <input 
              type="text" 
              placeholder="Search by Client, Piece, or Lease ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-earth-bark placeholder:text-earth-bark/10 flex-1 h-14"
            />
         </div>
         <div className="flex items-center gap-4 bg-white organic-card px-6 py-2 border-earth-bark/5 shadow-sm min-w-[240px]">
            <Filter className="w-4 h-4 text-earth-bark/20" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-earth-bark flex-1 cursor-pointer h-14"
            >
               <option value="all">All States</option>
               <option value="booked">Active Leases</option>
               <option value="returned">Archived History</option>
            </select>
         </div>
      </div>

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
               {filteredBookings.map(book => (
                  <TableRow key={book._id} className="border-earth-bark/5 hover:bg-earth-linen/30 transition-all group">
                     <TableCell className="px-12 py-10">
                        <div className="font-black text-earth-bark text-lg tracking-tighter uppercase">#LEASE-{book._id.slice(-6).toUpperCase()}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-clay mt-1">{book.cloth?.title || "Unknown Piece"}</div>
                        <div className="text-[10px] font-bold text-earth-bark/30 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-earth-clay" /> 
                           {new Date(book.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(book.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        {book.status === "booked" && (
                           <Button className="h-12 px-8 rounded-full bg-white border border-earth-bark/10 text-earth-bark text-[10px] font-black uppercase tracking-widest hover:bg-earth-bark hover:text-white transition-all shadow-md" onClick={() => handleReturn(book._id)}>
                              Process Return
                           </Button>
                        )}
                        {book.status === "returned" && (
                           <div className="w-12 h-12 rounded-full bg-earth-linen flex items-center justify-center text-earth-bark/10 ml-auto">
                              <ArrowUpRight className="w-5 h-5" />
                           </div>
                        )}
                     </TableCell>
                  </TableRow>
               ))}
               {filteredBookings.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                       <ShoppingBag className="w-12 h-12 text-earth-bark/10 mx-auto mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/20">No orders found in the manifest</p>
                    </TableCell>
                 </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
    </div>
  );
}
