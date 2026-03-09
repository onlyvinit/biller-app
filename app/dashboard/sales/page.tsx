"use client";

import { motion } from "framer-motion";
import { Plus, Search, FileText, Download, Edit2, Trash2 } from "lucide-react";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

export default function SalesAndInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().split('T')[0]
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
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/dashboard/invoices");
      const data = await res.json();
      if (res.ok) {
        setInvoices(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "Overdue": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchInvoices();
        setIsModalOpen(false);
        setFormData({ 
          clientName: "", 
          amount: "", 
          status: "Pending", 
          date: new Date().toISOString().split('T')[0] 
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoiceId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingInvoiceId, ...formData })
      });
      if (res.ok) {
        fetchInvoices();
        setIsModalOpen(false);
        setEditingInvoiceId(null);
        setFormData({ 
          clientName: "", 
          amount: "", 
          status: "Pending", 
          date: new Date().toISOString().split('T')[0] 
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/dashboard/invoices?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (invoice: any) => {
    setEditingInvoiceId(invoice._id);
    setFormData({
      clientName: invoice.clientName,
      amount: invoice.amount,
      status: invoice.status,
      date: new Date(invoice.date).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 variants={item} className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Sales & Invoices</motion.h1>
          <motion.p variants={item} className="text-gray-500 dark:text-gray-400 font-medium">Manage your invoices, sales, and payments.</motion.p>
        </div>
      </div>

      <motion.div variants={item} className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading your invoices...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-medium">{error}</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No invoices found. Invoices are automatically generated.</div>
          ) : (
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 font-bold">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {invoices.map((invoice) => (
                  <tr key={invoice.id || invoice._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap text-gray-900 dark:text-white">
                      <FileText className="w-4 h-4 text-blue-500" />
                      {invoice.invoiceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">{invoice.clientName}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white">{invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1  group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => openEditModal(invoice)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInvoiceId(null);
          setFormData({ 
            clientName: "", 
            amount: "", 
            status: "Pending", 
            date: new Date().toISOString().split('T')[0] 
          });
        }}
        title={editingInvoiceId ? "Edit Invoice" : "Create New Invoice"}
        description={editingInvoiceId ? "Update the details of this invoice." : "Fill in the details to generate a new invoice."}
      >
        <form onSubmit={editingInvoiceId ? handleUpdateInvoice : handleCreateInvoice} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Client Name</label>
            <input
              required
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              placeholder="e.g. Acme Corp"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</label>
              <input
                required
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="e.g. $1,250.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-900 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingInvoiceId(null);
                setFormData({ 
                  clientName: "", 
                  amount: "", 
                  status: "Pending", 
                  date: new Date().toISOString().split('T')[0] 
                });
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
              {isSubmitting ? (editingInvoiceId ? "Updating..." : "Generating...") : (editingInvoiceId ? "Update Invoice" : "Create Invoice")}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
