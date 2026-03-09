"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Receipt, Users, TrendingUp } from "lucide-react";

import { useState, useEffect } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <motion.h1 variants={item} className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</motion.h1>
        <motion.p variants={item} className="text-gray-500 dark:text-gray-400">Welcome back! Here is what's happening today.</motion.p>
      </div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || "0.00"}`} 
          trend="+0% from last month" 
          icon={<DollarSign className="w-4 h-4 text-gray-500" />} 
          positive
        />
        <MetricCard 
          title="Invoices Issued" 
          value={stats?.invoiceCount || 0} 
          trend="+0% from last month" 
          icon={<Receipt className="w-4 h-4 text-gray-500" />} 
          positive
        />
        <MetricCard 
          title="Active Billers" 
          value={stats?.billerCount || 0} 
          trend="+0 since last week" 
          icon={<Users className="w-4 h-4 text-gray-500" />} 
          positive
        />
        <MetricCard 
          title="Recent Sales" 
          value={stats?.recentInvoices?.length || 0} 
          trend="Real-time data" 
          icon={<TrendingUp className="w-4 h-4 text-gray-500" />} 
          positive={true}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div variants={item} className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg">Sales Overview</h3>
            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1 text-sm outline-none">
              <option>Real-time</option>
            </select>
          </div>
          <div className="h-72 w-full flex items-end justify-between gap-2">
            {[35, 45, 30, 60, 75, 50, 85].map((height, i) => (
              <div key={i} className="w-full relative group">
                <div 
                  className="w-full rounded-t-sm bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: '30%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Recent Transactions</h3>
          <div className="flex-1 flex flex-col gap-6">
            {stats?.recentInvoices?.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent activity.</p>
            ) : (
              stats?.recentInvoices?.map((inv: any) => (
                <TransactionItem 
                  key={inv._id} 
                  name={inv.clientName} 
                  amount={inv.amount} 
                  date={new Date(inv.date).toLocaleDateString()} 
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, trend, icon, positive }: any) {
  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div variants={item} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="tracking-tight text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs mt-1 flex items-center gap-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </p>
    </motion.div>
  );
}

function TransactionItem({ name, amount, date }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm leading-none mb-1.5">{name}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <div className="font-medium">{amount}</div>
    </div>
  );
}
