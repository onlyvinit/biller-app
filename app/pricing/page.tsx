"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Check, X as XIcon, ShieldCheck, BarChart3, Download, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Using the same header/footer structure from page.tsx for consistency
export default function PricingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white dark:bg-[#030712] text-gray-900 dark:text-gray-100">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#030712]/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Billify</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-semibold transition-colors border-b-2 border-blue-600 dark:border-blue-400 pb-1 -mb-[3px]">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hidden sm:block"
            >
              Get Started
            </Link>

            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#030712] overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                <Link href="/#features" className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                <Link href="/pricing" className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/contact" className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                <Link href="/login" className="text-center py-3 mt-4 rounded-xl bg-gray-50 dark:bg-gray-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="text-center py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Pricing Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Simple, transparent <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 text-balance mx-auto max-w-2xl leading-relaxed">
              Unlock the full potential of your restaurant with our powerful billing tools. No hidden fees. Choose the plan that fits your ambition.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 pb-20 max-w-6xl relative z-10 w-full flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* Starter Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-gray-400">🥈</span> Starter Plan
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">Target: Small restaurants, single outlet, just starting out.</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">₹5,000</span>
                  <span className="text-lg text-gray-500 font-medium">/ 6 Months</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 inline-flex px-3 py-1 rounded-full">
                  Works out to ₹833 / month
                </div>
              </div>

              <Link 
                href="/signup?plan=starter" 
                className="mt-6 w-full py-4 rounded-xl font-bold text-base transition-all text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Get Started
              </Link>

              <div className="mt-10 mb-6 flex items-center gap-4">
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Included Features</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              </div>

              <ul className="space-y-4 flex-1">
                <FeatureItem title="Billers" value="Up to 2" />
                <FeatureItem title="POS Terminals" value="1" />
                <FeatureItem title="Bills & Invoices" value="Up to 500/month" />
                <FeatureItem title="Menu Items" value="Up to 50 items" />
                <FeatureItem title="Tables" value="Up to 10" />
                <FeatureItem title="Sales Reports" value="Weekly only" />
                <FeatureItem title="Analytics" value="Basic" />
                <FeatureItem title="Offline Mode" included />
                <FeatureItem title="Thermal Printing" included />
                <FeatureItem title="Email Support" included />
                <FeatureItem title="Software Updates" included />
                <FeatureItem title="Loyalty Points" excluded />
                <FeatureItem title="Split Billing" excluded />
                <FeatureItem title="Tip Management" excluded />
                <FeatureItem title="AI Forecasting" excluded />
                <FeatureItem title="Zomato/Swiggy Integration" excluded />
                <FeatureItem title="Multi Terminal Sync" excluded />
              </ul>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border-2 border-blue-600 bg-white dark:bg-[#0a0a0a] shadow-2xl shadow-blue-500/20 transform scale-[1.02] z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/25">
                <Zap className="w-3 h-3 fill-white" /> Most Popular
              </div>

              <div className="absolute top-6 right-8 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-extrabold px-3 py-1 rounded-full border border-green-200 dark:border-green-800 shadow-sm animate-pulse">
                Save ₹2,000!
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-yellow-500">🥇</span> Pro Plan
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">Target: Growing restaurants, multiple staff, serious operations.</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">₹8,000</span>
                  <span className="text-lg text-gray-500 font-medium">/ 1 Year</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 inline-flex px-3 py-1 rounded-full">
                  Works out to ₹666 / month
                </div>
              </div>

              <Link 
                href="/signup?plan=pro" 
                className="mt-6 w-full py-4 rounded-xl font-bold text-base transition-all text-center bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
              >
                Go Pro Now
              </Link>

              <div className="mt-10 mb-6 flex items-center gap-4">
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Included Features</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              </div>

              <ul className="space-y-4 flex-1">
                <FeatureItem title="Billers" value="Up to 5" />
                <FeatureItem title="POS Terminals" value="Up to 3" />
                <FeatureItem title="Bills & Invoices" value="Unlimited" highlight />
                <FeatureItem title="Menu Items" value="Unlimited" highlight />
                <FeatureItem title="Tables" value="Unlimited" highlight />
                <FeatureItem title="Sales Reports" value="Daily + Weekly + Monthly" />
                <FeatureItem title="Analytics" value="Advanced" />
                <FeatureItem title="Offline Mode" included />
                <FeatureItem title="Thermal Printing" included />
                <FeatureItem title="Loyalty Points" included highlight />
                <FeatureItem title="Split Billing" included highlight />
                <FeatureItem title="Tip Management" included highlight />
                <FeatureItem title="AI Demand Forecasting" included highlight />
                <FeatureItem title="Zomato/Swiggy Integration" included highlight />
                <FeatureItem title="Multi Terminal Sync" included highlight />
                <FeatureItem title="Priority Email Support" included highlight />
                <FeatureItem title="Software Updates" included />
                <FeatureItem title="Early Access to New Features" included highlight />
              </ul>
            </motion.div>

            {/* Custom Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-gray-400">🏢</span> Custom
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">Target: Franchise, chains, or large scale operations.</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">Let&apos;s Talk</span>
                </div>
                {/* Spacer to align with other cards */}
                <div className="mt-2 text-sm font-semibold opacity-0 select-none inline-flex px-3 py-1 rounded-full">
                  Placeholder text
                </div>
              </div>

              <Link 
                href="/contact" 
                className="mt-6 w-full py-4 rounded-xl font-bold text-base transition-all text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Contact Sales
              </Link>

              <div className="mt-10 mb-6 flex items-center gap-4">
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Included Features</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              </div>

              <ul className="space-y-4 flex-1">
                <FeatureItem title="Everything in Pro" included highlight />
                <FeatureItem title="Unlimited Validations" included />
                <FeatureItem title="Custom Billing Integrations" included highlight />
                <FeatureItem title="White-labeling Options" included highlight />
                <FeatureItem title="Dedicated Account Manager" included />
                <FeatureItem title="24/7 Phone Support" included />
                <FeatureItem title="Custom Deployment" included />
                <FeatureItem title="SLA Guarantees" included />
              </ul>
            </motion.div>
        </section>

        {/* Highlight reasons to choose Billify from Landing Page */}
        <section className="container mx-auto px-4 py-20 w-full max-w-6xl border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why upgrade to Billify?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Everything you need to run your restaurant seamlessly, built with extreme speed and scale in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your daily, weekly, and monthly sales and revenue instantly as your billers generate invoices.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Operations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role-based access ensuring owner data is strictly separate from biller environments and highly secure.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Native Biller App</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloadable desktop software for fast, offline-capable billing right at the counter, compatible with thermal printers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center mb-6 text-yellow-600">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Performance First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Architecture optimized for extreme speed and high-volume transactions. 0ms local latency ensures you never miss a beat.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer using original style */}
      <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#030712] overflow-hidden pt-12 pb-8 w-full">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Billify</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Billify Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ 
  title, 
  value, 
  included, 
  excluded, 
  highlight 
}: { 
  title: string; 
  value?: string; 
  included?: boolean; 
  excluded?: boolean;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        {included ? (
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", highlight ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-800")}>
            <Check className={cn("w-3 h-3", highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400")} />
          </div>
        ) : excluded ? (
          <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <XIcon className="w-3 h-3 text-red-500" />
          </div>
        ) : (
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", highlight ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-800")}>
            <Check className={cn("w-3 h-3", highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400")} />
          </div>
        )}
        <span className={cn("text-sm transition-colors", excluded ? "text-gray-400 dark:text-gray-500 line-through" : (highlight ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-700 dark:text-gray-300"))}>
          {title}
        </span>
      </div>
      {value && (
        <span className={cn("text-sm font-medium text-right", highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400")}>
          {value}
        </span>
      )}
    </li>
  );
}
