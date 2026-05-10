import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "../../components/ui/table";

export function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const { data } = await axios.get("/api/admin/employees");
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-earth-clay border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div>
         <h2 className="text-5xl font-display font-black text-earth-bark tracking-tight uppercase">Personnel <span className="text-earth-clay italic">Nodes.</span></h2>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/30 mt-2">Active Access Control Manifest</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 organic-card bg-white shadow-xl overflow-hidden h-fit">
            <div className="p-12 border-b border-earth-bark/5 bg-earth-linen/20">
               <h3 className="text-3xl font-display font-black text-earth-bark tracking-tight">Active Specialists.</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/30 mt-2">Authorized Staff Directory</p>
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
                  {employees.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={3} className="py-20 text-center">
                          <Users className="w-12 h-12 text-earth-bark/10 mx-auto mb-6" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/20">No personnel nodes deployed</p>
                       </TableCell>
                    </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         <div className="organic-card p-12 bg-white shadow-xl space-y-12 group hover:organic-card-hover h-fit">
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
    </div>
  );
}
