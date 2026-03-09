"use client";

import { motion } from "framer-motion";
import { Plus, Search, UserPlus, Mail, Phone, MoreVertical } from "lucide-react";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Edit2, Trash2, X, Check } from "lucide-react";

export default function Billers() {
  const [billers, setBillers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBillerId, setEditingBillerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    fetchBillers();
  }, []);

  const fetchBillers = async () => {
    try {
      const res = await fetch("/api/dashboard/billers");
      const data = await res.json();
      if (res.ok) {
        setBillers(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch billers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBiller = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/billers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchBillers();
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "", password: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBiller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBillerId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/billers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingBillerId, ...formData })
      });
      if (res.ok) {
        fetchBillers();
        setIsModalOpen(false);
        setEditingBillerId(null);
        setFormData({ name: "", email: "", phone: "", password: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBiller = async (id: string) => {
    if (!confirm("Are you sure you want to delete this biller?")) return;
    try {
      const res = await fetch(`/api/dashboard/billers?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchBillers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (biller: any) => {
    setEditingBillerId(biller._id);
    setFormData({
      name: biller.name,
      email: biller.email,
      phone: biller.phone,
      password: biller.password || ""
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 variants={item} className="text-3xl font-bold tracking-tight mb-2">Billers</motion.h1>
          <motion.p variants={item} className="text-gray-500 dark:text-gray-400">Manage your recurring clients and billing profiles.</motion.p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          variants={item}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Biller
        </motion.button>
      </div>

      <motion.div variants={item} className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search billers..."
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-sm rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
        />
      </motion.div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-500">Loading billers...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">{error}</div>
      ) : billers.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No billers found. Add your first client!</div>
      ) : (
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {billers.map((biller) => (
            <motion.div key={biller.id || biller._id} variants={item} className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 hover:shadow-md transition-shadow relative group">

              <div className="flex  items-center justify-between flex-wrap gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${biller.color}`}>
                  {biller.initial}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">{biller.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Biller Account</p>
                </div>
                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => openEditModal(biller)}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBiller(biller._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{biller.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{biller.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Biller Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBillerId(null);
          setFormData({ name: "", email: "", phone: "", password: "" });
        }}
        title={editingBillerId ? "Edit Biller" : "Add New Biller"}
        description={editingBillerId ? "Update the details of your billing client." : "Enter the details of your new billing client."}
      >
        <form onSubmit={editingBillerId ? handleUpdateBiller : handleAddBiller} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Biller Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="Google Inc."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="billing@google.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="+1 234 567"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Access Password</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBillerId(null);
                setFormData({ name: "", email: "", phone: "", password: "" });
              }}
              className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (editingBillerId ? "Updating..." : "Adding...") : (editingBillerId ? "Update Biller" : "Add Biller")}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
