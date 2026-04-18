import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import axios from "axios";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  PlusCircle,
} from "lucide-react";

export function Admin() {
  const { role } = useAuth();
  const [clothes, setClothes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("casual");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [clothesRes, bookingsRes] = await Promise.all([
        axios.get("/api/clothes"),
        axios.get("/api/bookings")
      ]);
      setClothes(clothesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "admin") return;
    fetchAdminData();
  }, [role]);

  const handleAddCloth = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      
      const { data: uploadedPath } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axios.post("/api/clothes", {
        title,
        description,
        category,
        size,
        pricePerDay: Number(price),
        imageUrl: uploadedPath,
      });

      fetchAdminData();

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error adding item");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.put(`/api/clothes/${id}/status`, { availability: !currentStatus });
      fetchAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const markReturned = async (id) => {
    try {
      await axios.put(`/api/bookings/${id}/return`);
      fetchAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  if (role !== "admin") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-500">
          Administrator privileges are required to view this page.
        </p>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter((b) => b.status === "booked").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Admin Portal
          </h1>
          <p className="text-gray-500 mt-1">
            Manage inventory and monitor store performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1 text-medium">
              +14% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Rentals
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeBookings}</div>
            <p className="text-xs text-gray-500 mt-1 text-medium">
              Currently out with customers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Inventory
            </CardTitle>
            <Package className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clothes.length}</div>
            <p className="text-xs text-gray-500 mt-1 text-medium">
              Items in catalog
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-8 p-1 bg-gray-100 rounded-xl">
          <TabsTrigger value="inventory" className="rounded-lg px-6">
            Inventory Management
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-lg px-6">
            Bookings & Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="inventory"
          className="space-y-8 animate-in fade-in-50 duration-500"
        >
          <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Add New Item
              </CardTitle>
              <CardDescription>
                Add a new designer piece to the rental catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddCloth} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="font-semibold text-gray-700"
                    >
                      Item Title
                    </Label>
                    <Input
                      id="title"
                      className="rounded-xl border-gray-300"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Gucci Velvet Tuxedo"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="category"
                      className="font-semibold text-gray-700"
                    >
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="rounded-xl border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="size"
                      className="font-semibold text-gray-700"
                    >
                      Size
                    </Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger className="rounded-xl border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="price"
                      className="font-semibold text-gray-700"
                    >
                      Price Per Day ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="rounded-xl border-gray-300"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="e.g. 150"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="image"
                      className="font-semibold text-gray-700"
                    >
                      High-Res Image Upload
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="rounded-xl border-gray-300"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="font-semibold text-gray-700"
                    >
                      Product Description
                    </Label>
                    <Input
                      id="description"
                      className="rounded-xl border-gray-300"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Describe the material, fit, and style..."
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full px-8 shadow-md"
                >
                  {submitting ? "Publishing..." : "Publish to Catalog"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle>Catalog Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/30">
                      <TableHead className="font-semibold px-6">Item</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Size</TableHead>
                      <TableHead className="font-semibold">Price/Day</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right px-6">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clothes.map((cloth) => (
                      <TableRow key={cloth._id || cloth.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium px-6 py-4">
                          {cloth.title}
                        </TableCell>
                        <TableCell className="capitalize py-4 text-gray-600">
                          {cloth.category}
                        </TableCell>
                        <TableCell className="py-4 text-gray-600">
                          {cloth.size}
                        </TableCell>
                        <TableCell className="py-4 font-medium">
                          ${cloth.pricePerDay}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="secondary"
                            className={`font-semibold shadow-none ${cloth.availability ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                          >
                            {cloth.availability ? "Available" : "Rented Out"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg shadow-sm"
                            onClick={() =>
                              toggleAvailability(cloth._id || cloth.id, cloth.availability)
                            }
                          >
                            Toggle Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="bookings"
          className="animate-in fade-in-50 duration-500"
        >
          <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/30">
                      <TableHead className="font-semibold px-6">
                        Order ID
                      </TableHead>
                      <TableHead className="font-semibold">
                        Customer ID
                      </TableHead>
                      <TableHead className="font-semibold">Item ID</TableHead>
                      <TableHead className="font-semibold">Revenue</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right px-6">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow
                        key={booking._id || booking.id}
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell className="font-mono text-xs text-gray-500 px-6 py-4">
                          {(booking._id || booking.id).substring(0, 8)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500 py-4">
                          {booking.user?.fullName || booking.userId}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500 py-4">
                          {booking.cloth?._id?.substring(0, 8) || booking.clothId}
                        </TableCell>
                        <TableCell className="py-4 font-medium">
                          ${booking.totalPrice}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="secondary"
                            className={`font-semibold shadow-none capitalize ${booking.status === "booked" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6 py-4">
                          {booking.status === "booked" ? (
                            <Button
                              variant="default"
                              size="sm"
                              className="rounded-lg shadow-sm"
                              onClick={() => markReturned(booking._id || booking.id)}
                            >
                              Process Return
                            </Button>
                          ) : (
                            <span className="text-sm font-medium text-gray-400">
                              Completed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
