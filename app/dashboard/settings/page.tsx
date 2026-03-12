"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Wallet, Save } from "lucide-react";
import { useState, useEffect } from "react";
import AccountDeletionFlow from "./AccountDeletionFlow";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantCompany: "",
    restaurantAddress: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) {
        setProfile({
          name: data.name || "",
          email: data.email || "",
          restaurantName: data.restaurantName || "",
          restaurantCompany: data.restaurantCompany || "",
          restaurantAddress: data.restaurantAddress || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing App", icon: Wallet },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <div>
        <motion.h1 variants={item} className="text-3xl font-bold tracking-tight mb-2">Settings</motion.h1>
        <motion.p variants={item} className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div variants={item} className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </motion.div>

        <motion.div variants={item} className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">Personal Information</h3>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold shrink-0">
                  O
                </div>
                <div>
                  <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-900 dark:text-white">
                    Upload new photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">At least 800x800 px recommended. JPG or PNG only.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="py-12 flex justify-center text-gray-500">Loading profile data...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address (Cannot change)</label>
                      <input 
                        type="email" 
                        value={profile.email} 
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none font-medium opacity-70 cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Name</label>
                      <input 
                        type="text" 
                        value={profile.restaurantName} 
                        onChange={(e) => setProfile({...profile, restaurantName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Company</label>
                      <input 
                        type="text" 
                        value={profile.restaurantCompany}
                        onChange={(e) => setProfile({...profile, restaurantCompany: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Address</label>
                      <input 
                        type="text" 
                        value={profile.restaurantAddress}
                        onChange={(e) => setProfile({...profile, restaurantAddress: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      />
                    </div>
                  </div>

                  {message.text && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}>
                      {message.text}
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}

              <AccountDeletionFlow />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">Notification Preferences</h3>

              <div className="space-y-4">
                {[
                  { label: "New Invoice Paid", desc: "Get notified when a client pays an invoice." },
                  { label: "Biller Activity", desc: "Get notified when a biller updates their details." },
                  { label: "Weekly Report", desc: "Receive a weekly summary of your financial activity." },
                  { label: "System Updates", desc: "Important announcements and product updates." },
                  { label: "Daily Sales Summary", desc: "End of day total revenue report" },
                  { label: "Monthly Revenue Report", desc: "Financial month overview" },
                  { label: "Payment Failed", desc: "When a payment doesn't go through" },
                  { label: "Order Cancelled", desc: "By customer or biller" },
                  { label: "Table Waiting Alert", desc: "Table has been waiting too long" },
                  { label: "New Biller Login", desc: "Someone logged into POS" },
                  { label: "New Device Login", desc: "Account accessed from new device" },
                  { label: "Biller Key Generated", desc: "Access key was created" },
                  { label: "Biller Added/Removed", desc: "Staff changes" },
                  { label: "Subscription Expiring Soon", desc: "7 days before plan expires" },
                  { label: "Software Update Available", desc: "New POS version released" },
                  { label: "Sync Failed", desc: "Offline data failed to sync" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {(activeTab === "security" || activeTab === "billing") && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                {activeTab === "security" ? <Shield className="w-8 h-8 text-gray-400" /> : <Wallet className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Coming Soon</h3>
              <p className="text-sm max-w-sm">This section is currently under development. Check back later for updates to your {activeTab} settings.</p>
            </div>
          )}
        </motion.div>
      </div>

    </motion.div>
  );
}
