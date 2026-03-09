"use client";

import { motion } from "framer-motion";
import { Download, Monitor, Key, Plus, ShieldCheck, UserPlus, FileTerminal } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function BillerPortal() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch active key on mount
  useEffect(() => {
    const fetchActiveKey = async () => {
      try {
        const res = await fetch("/api/dashboard/biller-keys");
        if (res.ok) {
          const data = await res.json();
          if (data && data.key) {
            setCreatedKey(data.key);
            const expiry = new Date(data.expiresAt).getTime();
            setExpiryTime(expiry);
            startCountdown(expiry);
          }
        }
      } catch (err) {
        console.error("Failed to fetch active key:", err);
      }
    };

    fetchActiveKey();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCountdown = (expiry: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance < 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCreatedKey(null);
        setExpiryTime(null);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(distance / 1000));
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createdKey) return;
    setIsCreating(true);

    try {
      const res = await fetch("/api/dashboard/biller-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedKey(data.key);
        const expiry = new Date(data.expiresAt).getTime();
        setExpiryTime(expiry);
        startCountdown(expiry);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 py-4 md:py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto"
        >
          <div className="mb-12">
            <motion.h1 variants={item} className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Biller <span className="text-blue-600 dark:text-blue-500">Portal</span>
            </motion.h1>
            <motion.p variants={item} className="text-gray-500 dark:text-gray-400 max-w-2xl">
              Create secure access profiles for your billing staff and download the native desktop application to seamlessly link them to your cloud dashboard.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Profile Section */}
            <motion.div variants={item} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[5rem] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create Biller Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate secure credentials</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="flex-1 flex flex-col">
                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                      Click the button below to generate a secure, one-time access key for your biller software.
                      <strong className="block mt-1">This key will expire automatically after 3 minutes for security.</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button
                    disabled={isCreating || createdKey !== null}
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:grayscale-[0.5]"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {createdKey ? "Active Key Present" : "Generate Biller Access Key"}
                      </>
                    )}
                  </button>

                  {createdKey && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="p-6 rounded-2xl bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 shadow-inner"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                          <Key className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-lg mb-1">Access Key Generated</p>
                        <p className="text-xs mb-4 opacity-80">Use this key to login to the desktop software</p>

                        <code className="w-full py-4 bg-white/70 dark:bg-black/40 rounded-xl font-mono text-2xl font-black select-all tracking-[0.2em] border border-green-100 dark:border-green-900/30 mb-4 text-blue-600 dark:text-blue-400">
                          {createdKey}
                        </code>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-sm font-bold">
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          Expires in {formatTime(timeLeft)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Download Software Section */}
            <motion.div variants={item} className="bg-gray-900 text-white rounded-3xl border border-gray-800 p-8 shadow-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[5rem] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[5rem] translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/10">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Desktop Biller App</h2>
                  <p className="text-sm text-gray-400">v2.1.0 • Python / PyQt5 Core</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">Offline capable. Automatically syncs invoices when internet is restored.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileTerminal className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">Lightweight native execution optimized for Point-of-Sale hardware.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href="/downloads/Billify-POS.exe"
                  download
                  className="w-full py-4 px-4 rounded-xl bg-white text-black hover:bg-gray-100 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download for Windows (.exe)
                </a>
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                  <button className="hover:text-white transition-colors">MacOS Installer</button>
                  <span>•</span>
                  <button className="hover:text-white transition-colors">Linux AppImage</button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
