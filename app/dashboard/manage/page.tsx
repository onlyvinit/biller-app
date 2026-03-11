"use client";

import { motion } from "framer-motion";
import { Utensils, Grid2X2, Users, Percent, Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

export default function Manage() {
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Form States
  const [categoryName, setCategoryName] = useState("");
  const [itemForm, setItemForm] = useState({ name: "", price: "", status: "Available" });
  const [tableForm, setTableForm] = useState({ tableNumber: "", capacity: "", location: "", status: "Available" });
  const [staffForm, setStaffForm] = useState({ name: "", role: "Biller", email: "", pin: "" });
  const [offerForm, setOfferForm] = useState({ title: "", code: "", value: "", type: "percentage", status: "Active" });

  // Editing States
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState({ name: "", price: "", status: "" });
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editTableForm, setEditTableForm] = useState({ tableNumber: "", capacity: "", location: "", status: "" });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editStaffForm, setEditStaffForm] = useState({ name: "", role: "", email: "", pin: "" });
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editOfferForm, setEditOfferForm] = useState({ title: "", code: "", value: "", type: "", status: "" });

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const animationItem: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const tabs = [
    { id: "menu", label: "Food & Categories", icon: Utensils },
    { id: "tables", label: "Tables", icon: Grid2X2 },
    { id: "staff", label: "Staff & Roles", icon: Users },
    { id: "offers", label: "Discounts & Offers", icon: Percent },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [catRes, itemRes, tableRes, staffRes, offerRes] = await Promise.all([
        fetch("/api/dashboard/manage/categories"),
        fetch("/api/dashboard/manage/items"),
        fetch("/api/dashboard/manage/tables"),
        fetch("/api/dashboard/manage/staff"),
        fetch("/api/dashboard/manage/offers")
      ]);

      const [catData, itemData, tableData, staffData, offerData] = await Promise.all([
        catRes.json(),
        itemRes.json(),
        tableRes.json(),
        staffRes.json(),
        offerRes.json()
      ]);

      if (catRes.ok && itemRes.ok && tableRes.ok && staffRes.ok && offerRes.ok) {
        setCategories(catData);
        setItems(itemData);
        setTables(tableData);
        setStaff(staffData);
        setOffers(offerData);
      } else {
        setError("Failed to fetch some data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });
      if (res.ok) {
        fetchAllData();
        setIsCategoryModalOpen(false);
        setCategoryName("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...itemForm, categoryId: selectedCategoryId })
      });
      if (res.ok) {
        fetchAllData();
        setIsItemModalOpen(false);
        setItemForm({ name: "", price: "", status: "Available" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tableForm, capacity: parseInt(tableForm.capacity) })
      });
      if (res.ok) {
        fetchAllData();
        setIsTableModalOpen(false);
        setTableForm({ tableNumber: "", capacity: "", location: "", status: "Available" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm)
      });
      if (res.ok) {
        fetchAllData();
        setIsStaffModalOpen(false);
        setStaffForm({ name: "", role: "Biller", email: "", pin: "" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleUpdateCategory = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editCategoryName })
      });
      if (res.ok) {
        fetchAllData();
        setEditingCategoryId(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm)
      });
      if (res.ok) {
        fetchAllData();
        setIsOfferModalOpen(false);
        setOfferForm({ title: "", code: "", value: "", type: "percentage", status: "Active" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will also delete all items in this category.")) return;
    try {
      const res = await fetch(`/api/dashboard/manage/categories?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateItem = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editItemForm })
      });
      if (res.ok) {
        fetchAllData();
        setEditingItemId(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/dashboard/manage/items?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTable = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editTableForm })
      });
      if (res.ok) {
        fetchAllData();
        setEditingTableId(null);
        setIsTableModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return;
    try {
      const res = await fetch(`/api/dashboard/manage/tables?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStaff = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editStaffForm })
      });
      if (res.ok) {
        fetchAllData();
        setEditingStaffId(null);
        setIsStaffModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await fetch(`/api/dashboard/manage/staff?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOffer = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/manage/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editOfferForm })
      });
      if (res.ok) {
        fetchAllData();
        setEditingOfferId(null);
        setIsOfferModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/dashboard/manage/offers?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTables = tables.filter(t => t.tableNumber.toString().includes(searchQuery) || (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase())));
  const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.role && s.role.toLowerCase().includes(searchQuery.toLowerCase())));
  const filteredOffers = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || (o.code && o.code.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 variants={animationItem} className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Manage Center</motion.h1>
          <motion.p variants={animationItem} className="text-gray-500 dark:text-gray-400 font-medium">Configure your menu, tables, staff, and promotions.</motion.p>
        </div>
        <motion.button 
          onClick={() => {
            if (activeTab === 'menu') setIsCategoryModalOpen(true);
            else if (activeTab === 'tables') setIsTableModalOpen(true);
            else if (activeTab === 'staff') setIsStaffModalOpen(true);
            else if (activeTab === 'offers') setIsOfferModalOpen(true);
          }}
          variants={animationItem} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'menu' ? 'Add New Category' : `Add ${tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}`}
        </motion.button>
      </div>

      <motion.div variants={animationItem} className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col flex-wrap gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`} 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm font-medium"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading data...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-medium">{error}</div>
          ) : activeTab === "menu" ? (
            <div className="p-4 space-y-3">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-medium">{searchQuery ? 'No categories match your search.' : 'No categories found.'}</div>
              ) : (
                filteredCategories.map((category) => {
                  const isExpanded = expandedCategory === (category._id || category.id);
                  const categoryItems = items.filter(i => i.categoryId === (category._id || category.id));
                  
                  return (
                    <div key={category._id || category.id} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-[#0a0a0a] transition-all hover:border-gray-300 dark:hover:border-gray-700">
                      
                      <div className="flex flex-wrap justify-end sm:justify-between p-4 cursor-pointer select-none group/category" onClick={() => setExpandedCategory(isExpanded ? null : (category._id || category.id))}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-1.5 rounded-md text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                          </div>
                          {editingCategoryId === category._id ? (
                            <div className="flex flex-wrap gap-3 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                              <input 
                                autoFocus
                                type="text" 
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                              <button onClick={() => handleUpdateCategory(category._id)} className="text-green-600 hover:text-green-700 font-bold text-xs uppercase">Save</button>
                              <button onClick={() => setEditingCategoryId(null)} className="text-gray-500 hover:text-gray-600 font-bold text-xs uppercase">Cancel</button>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white group-hover/category:text-blue-600 dark:group-hover/category:text-blue-400 transition-colors uppercase text-sm tracking-wide">{category.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-bold">{categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-80 group-hover/category:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategoryId(category._id);
                              setEditCategoryName(category.name);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category._id);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f0f] p-4">
                          <div className="flex justify-end mb-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategoryId(category._id || category.id);
                                setIsItemModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-bold"
                            >
                              <Plus className="w-4 h-4" />
                              Add Food Item
                            </button>
                          </div>
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 font-bold">
                              <tr>
                                <th className="pb-3 px-4">Item Name</th>
                                <th className="pb-3 px-4">Price</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                               {categoryItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group/item">
                                  {editingItemId === item._id ? (
                                    <>
                                      <td className="py-3 px-4">
                                        <input 
                                          type="text" 
                                          value={editItemForm.name}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border rounded text-xs font-bold uppercase"
                                        />
                                      </td>
                                      <td className="py-3 px-4">
                                        <input 
                                          type="text" 
                                          value={editItemForm.price}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value })}
                                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border rounded text-xs font-bold"
                                        />
                                      </td>
                                      <td className="py-3 px-4">
                                        <select
                                          value={editItemForm.status}
                                          onChange={(e) => setEditItemForm({ ...editItemForm, status: e.target.value })}
                                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border rounded text-xs font-bold"
                                        >
                                          <option value="Available">Available</option>
                                          <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                      </td>
                                      <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                          <button onClick={() => handleUpdateItem(item._id)} className="text-green-600 hover:text-green-700 font-bold text-xs uppercase">Save</button>
                                          <button onClick={() => setEditingItemId(null)} className="text-gray-500 hover:text-gray-600 font-bold text-xs uppercase">Cancel</button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white uppercase text-xs">{item.name}</td>
                                      <td className="py-3 px-4 font-bold text-gray-700 dark:text-gray-300">{item.price}</td>
                                      <td className="py-3 px-4 text-xs font-bold text-green-600">{item.status}</td>
                                      <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-80 group-hover/item:opacity-100 transition-opacity">
                                          <button 
                                            onClick={() => {
                                              setEditingItemId(item._id);
                                              setEditItemForm({ name: item.name, price: item.price, status: item.status });
                                            }}
                                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : activeTab === "tables" ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                {filteredTables.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 font-bold">{searchQuery ? 'No tables match your search.' : 'No tables added yet.'}</div>
                ) : (
                filteredTables.map((table) => (
                  <div key={table._id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-md transition-all relative group bg-white dark:bg-[#0a0a0a]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Grid2X2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">Table {table.tableNumber}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{table.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 flex items-center gap-1.5 font-bold"><Users className="w-4 h-4" /> {table.capacity} Seats</span>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">{table.status}</span>
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTableId(table._id);
                              setEditTableForm({ tableNumber: table.tableNumber, capacity: table.capacity, location: table.location, status: table.status });
                              setIsTableModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTable(table._id)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          ) : activeTab === "staff" ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStaff.map((s) => (
                  <div key={s._id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-md transition-all relative group bg-white dark:bg-[#0a0a0a]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">{s.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{s.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingStaffId(s._id);
                            setEditStaffForm({ name: s.name, role: s.role, email: s.email, pin: s.pin });
                            setIsStaffModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(s._id)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Email/ID</span>
                        <span className="text-gray-900 dark:text-white font-bold">{s.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Access Pin</span>
                        <span className="text-gray-900 dark:text-white font-bold tracking-widest">{s.pin ? '****' : 'None'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStaff.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 font-bold">{searchQuery ? 'No staff match your search.' : 'No staff members added yet.'}</div>
                )}
              </div>
            </div>
          ) : activeTab === "offers" ? (
            <div className="p-6">
              <div className="space-y-4">
                {filteredOffers.map((offer) => (
                  <div key={offer._id} className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#0a0a0a] group hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">{offer.title}</h3>
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">{offer.code}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                          {offer.value}{offer.type === 'percentage' ? '%' : offer.type === 'fixed' ? '$' : ''} Discount 
                          <span className={`ml-3 px-1.5 py-0.5 rounded text-[10px] ${offer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {offer.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingOfferId(offer._id);
                          setEditOfferForm({ 
                            title: offer.title, 
                            code: offer.code, 
                            value: offer.value.toString(), 
                            type: offer.type, 
                            status: offer.status 
                          });
                          setIsOfferModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteOffer(offer._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredOffers.length === 0 && (
                  <div className="py-12 text-center text-gray-500 font-bold">{searchQuery ? 'No offers match your search.' : 'No discounts or offers configured yet.'}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">No {activeTab} configured yet</h3>
              <p className="text-sm max-w-sm font-medium">Start managing your {activeTab} by clicking the "Add New" button above.</p>
            </div>
          )}

        </div>
      </motion.div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Category"
        description="Organize your menu with a new category (e.g. Desserts, Drinks)."
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              required
              autoFocus
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. Starters"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Food Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title="Add Food Item"
        description="Add a new dish or drink to your menu."
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Item Name</label>
            <input
              required
              type="text"
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. Margherita Pizza"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price</label>
              <input
                required
                type="text"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="e.g. $12.50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={itemForm.status}
                onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title={editingTableId ? "Edit Table" : "Add New Table"}
        description={editingTableId ? "Update table configuration." : "Add a table configuration to your restaurant layout."}
      >
        <form onSubmit={editingTableId ? (e) => { e.preventDefault(); handleUpdateTable(editingTableId); } : handleAddTable} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Table Number</label>
              <input
                required
                type="text"
                value={editingTableId ? editTableForm.tableNumber : tableForm.tableNumber}
                onChange={(e) => editingTableId 
                  ? setEditTableForm({ ...editTableForm, tableNumber: e.target.value })
                  : setTableForm({ ...tableForm, tableNumber: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Capacity</label>
              <input
                required
                type="number"
                value={editingTableId ? editTableForm.capacity : tableForm.capacity}
                onChange={(e) => editingTableId
                  ? setEditTableForm({ ...editTableForm, capacity: e.target.value })
                  : setTableForm({ ...tableForm, capacity: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="e.g. 4"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              value={editingTableId ? editTableForm.location : tableForm.location}
              onChange={(e) => editingTableId
                ? setEditTableForm({ ...editTableForm, location: e.target.value })
                : setTableForm({ ...tableForm, location: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. Window Side / Patio"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={editingTableId ? editTableForm.status : tableForm.status}
              onChange={(e) => editingTableId
                ? setEditTableForm({ ...editTableForm, status: e.target.value })
                : setTableForm({ ...tableForm, status: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Out of Order">Out of Order</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsTableModalOpen(false);
                setEditingTableId(null);
              }} 
              className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
              {isSubmitting ? (editingTableId ? "Updating..." : "Adding...") : (editingTableId ? "Update Table" : "Add Table")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Staff Modal */}
      <Modal
        isOpen={isStaffModalOpen}
        onClose={() => {
          setIsStaffModalOpen(false);
          setEditingStaffId(null);
        }}
        title={editingStaffId ? "Edit Staff Member" : "Add New Staff"}
        description={editingStaffId ? "Update staff credentials and role." : "Create a new staff member account for your restaurant."}
      >
        <form onSubmit={editingStaffId ? (e) => { e.preventDefault(); handleUpdateStaff(editingStaffId); } : handleAddStaff} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Staff Name</label>
            <input
              required
              type="text"
              value={editingStaffId ? editStaffForm.name : staffForm.name}
              onChange={(e) => editingStaffId 
                ? setEditStaffForm({ ...editStaffForm, name: e.target.value })
                : setStaffForm({ ...staffForm, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <select
                value={editingStaffId ? editStaffForm.role : staffForm.role}
                onChange={(e) => editingStaffId 
                  ? setEditStaffForm({ ...editStaffForm, role: e.target.value })
                  : setStaffForm({ ...staffForm, role: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Biller">Biller</option>
                <option value="Manager">Manager</option>
                <option value="Waiter">Waiter</option>
                <option value="Kitchen Staff">Kitchen Staff</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Access Pin</label>
              <input
                required
                type="password"
                maxLength={4}
                value={editingStaffId ? editStaffForm.pin : staffForm.pin}
                onChange={(e) => editingStaffId 
                  ? setEditStaffForm({ ...editStaffForm, pin: e.target.value })
                  : setStaffForm({ ...staffForm, pin: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium tracking-widest"
                placeholder="4-digit pin"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email / Login ID</label>
            <input
              required
              type="email"
              value={editingStaffId ? editStaffForm.email : staffForm.email}
              onChange={(e) => editingStaffId 
                ? setEditStaffForm({ ...editStaffForm, email: e.target.value })
                : setStaffForm({ ...staffForm, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. john@billify.com"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsStaffModalOpen(false);
                setEditingStaffId(null);
              }} 
              className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
              {isSubmitting ? (editingStaffId ? "Updating..." : "Creating...") : (editingStaffId ? "Update Staff" : "Create Staff")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Offers Modal */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setEditingOfferId(null);
        }}
        title={editingOfferId ? "Edit Offer" : "Create New Offer"}
        description={editingOfferId ? "Update discount details." : "Create a new discount code or promotion."}
      >
        <form onSubmit={editingOfferId ? (e) => { e.preventDefault(); handleUpdateOffer(editingOfferId); } : handleAddOffer} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Offer Title</label>
            <input
              required
              type="text"
              value={editingOfferId ? editOfferForm.title : offerForm.title}
              onChange={(e) => editingOfferId 
                ? setEditOfferForm({ ...editOfferForm, title: e.target.value })
                : setOfferForm({ ...offerForm, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. Weekend Special"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Promo Code</label>
              <input
                required
                type="text"
                value={editingOfferId ? editOfferForm.code : offerForm.code}
                onChange={(e) => editingOfferId 
                  ? setEditOfferForm({ ...editOfferForm, code: e.target.value.toUpperCase() })
                  : setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-bold uppercase"
                placeholder="E.G. SAVE20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Discount Value</label>
              <input
                required
                type="number"
                value={editingOfferId ? editOfferForm.value : offerForm.value}
                onChange={(e) => editingOfferId 
                  ? setEditOfferForm({ ...editOfferForm, value: e.target.value })
                  : setOfferForm({ ...offerForm, value: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="e.g. 20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={editingOfferId ? editOfferForm.type : offerForm.type}
                onChange={(e) => editingOfferId 
                  ? setEditOfferForm({ ...editOfferForm, type: e.target.value })
                  : setOfferForm({ ...offerForm, type: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={editingOfferId ? editOfferForm.status : offerForm.status}
                onChange={(e) => editingOfferId 
                  ? setEditOfferForm({ ...editOfferForm, status: e.target.value })
                  : setOfferForm({ ...offerForm, status: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsOfferModalOpen(false);
                setEditingOfferId(null);
              }} 
              className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
              {isSubmitting ? (editingOfferId ? "Updating..." : "Creating...") : (editingOfferId ? "Update Offer" : "Create Offer")}
            </button>
          </div>
        </form>
      </Modal>

      </motion.div>

  );
}
