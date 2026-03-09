"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Download, Mail, Phone, MapPin, Github, Twitter, Linkedin, Check, Rocket, Quote, Star, Globe, Cpu, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for small businesses starting out.",
      features: ["1 User", "100 Invoices/mo", "Basic Analytics", "Community Support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "Advanced features for growing teams.",
      features: ["5 Users", "Unlimited Invoices", "Advanced Analytics", "Priority Support", "Custom Branding"],
      cta: "Try Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Ultimate power for large-scale operations.",
      features: ["Unlimited Users", "Unlimited Invoices", "Custom Integrations", "Dedicated Account Manager", "SLA Support"],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#030712]/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Billify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hidden sm:block"
            >
              Dashboard
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#030712] overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                <Link 
                  href="#features" 
                  className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#pricing" 
                  className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/contact" 
                  className="text-lg font-medium p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                  <Link 
                    href="/login" 
                    className="text-center py-3 rounded-xl bg-gray-50 dark:bg-gray-900 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-center py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-24 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className=" max-w-4xl mx-auto flex flex-col items-center gap-6"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 mix-blend-multiply dark:mix-blend-normal">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Introducing Billify 2.0
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-tight">
              Smarter billing for <br className="hidden md:block" />
              <span className="text-gradient">modern businesses</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl text-balance">
              Streamline your invoicing, track sales analytics in real-time, and empower your billers with our next-generation desktop software.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <Link 
                href="/dashboard" 
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Dashboard Preview Image/Mockup */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 w-full max-w-5xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl shadow-2xl p-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="w-full h-[400px] md:h-[600px] rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
                {/* Mockup UI Elements inside the preview */}
                <div className="absolute top-4 left-4 right-4 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                
                <div className="absolute top-20 left-4 bottom-4 w-64 hidden lg:flex flex-col gap-4">
                  <div className="h-8 w-full bg-white dark:bg-gray-800 rounded-md shadow-sm opacity-50" />
                  <div className="h-8 w-3/4 bg-white dark:bg-gray-800 rounded-md shadow-sm opacity-50" />
                  <div className="h-8 w-5/6 bg-white dark:bg-gray-800 rounded-md shadow-sm opacity-50" />
                </div>

                <div className="absolute top-20 left-4 lg:left-72 right-4 bottom-4 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                      <div className="h-8 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-md" />
                    </div>
                    <div className="flex-1 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                      <div className="h-8 w-24 bg-green-100 dark:bg-green-900/30 rounded-md" />
                    </div>
                    <div className="flex-1 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm hidden md:flex p-4 flex-col justify-end">
                      <div className="h-8 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-md" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 relative overflow-hidden">
                    {/* Mock Chart Area */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between px-8 pb-4 opacity-20">
                      {[40, 70, 45, 90, 65, 85, 120, 95, 110, 80].map((h, i) => (
                        <div key={i} className="w-8 rounded-t-sm bg-blue-500" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 dark:text-gray-600 font-medium z-10 text-xl backdrop-blur-sm px-4 py-2 rounded-lg bg-white/30 dark:bg-black/30">
                  Interactive Dashboard Preview
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage owners, distribute software to your billers, and track every single invoice beautifully.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
              title="Real-time Analytics"
              description="Monitor your sales and revenue instantly as your billers generate invoices."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
              title="Secure Operations"
              description="Role-based access ensuring owner data is separate from biller environments."
            />
            <FeatureCard 
              icon={<Download className="w-6 h-6 text-purple-500" />}
              title="Native Biller App"
              description="Downloadable Python-based software for fast, offline-capable billing at the counter."
            />
          </div>
        </section>

        {/* The Tech Advantage Section */}
        <section className="container mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                Performance First
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                Built for <span className="text-gradient from-purple-500 to-blue-600">extreme speed</span> and scale.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed text-balance">
                Our architecture is optimized for high-volume transactions, ensuring your business never misses a beat even during peak hours.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">0ms</div>
                  <div className="text-sm font-medium text-gray-500">Local Latency</div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                  <div className="text-sm font-medium text-gray-500">Cloud Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-12">
                <TechBentoCard icon={<Cpu className="w-5 h-5" />} title="Edge Ready" gradient="from-blue-500/10 to-blue-600/10" />
                <TechBentoCard icon={<Globe className="w-5 h-5" />} title="Globally Sync" gradient="from-purple-500/10 to-purple-600/10" />
              </div>
              <div className="space-y-4">
                <TechBentoCard icon={<ShieldCheck className="w-5 h-5" />} title="Auto-Backups" gradient="from-green-500/10 to-green-600/10" />
                <TechBentoCard icon={<Zap className="w-5 h-5" />} title="Instant Load" gradient="from-yellow-500/10 to-yellow-600/10" />
                <TechBentoCard icon={<BarChart3 className="w-5 h-5" />} title="Deep Insights" gradient="from-pink-500/10 to-pink-600/10" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Choose the plan that's right for your business. Grow as you go.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <PricingCard key={idx} {...tier} />
            ))}
          </div>
        </section>

        {/* User Experiences Section */}
        <section className="container mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by forward-thinking teams</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              See how businesses are transforming their billing operations with Billify.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Billify has completely changed how we handle our peak hours. The speed is unmatched."
              author="Sarah Chen"
              role="Owner, Bloom Cafe"
              initial="S"
            />
            <TestimonialCard 
              quote="The real-time analytics gave me insights I never had before. A game changer for my business."
              author="Marcus Wright"
              role="CEO, Wright Logistics"
              initial="M"
            />
            <TestimonialCard 
              quote="Switching was the best decision. Our billers love the intuitive desktop app."
              author="Elena Rodriguez"
              role="Manager, Gourmet Market"
              initial="E"
            />
          </div>
          
          {/* Logo Marquee placeholder */}
          <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["Acme Corp", "TechFlow", "Global Industries", "Logistics Pro", "Cloud Sync"].map((logo) => (
              <span key={logo} className="text-xl font-bold tracking-tighter">{logo}</span>
            ))}
          </div>
        </section>

      </main>

      {/* Stylish & Dynamic Footer */}
      <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#030712] overflow-hidden pt-16 pb-8">
        {/* Dynamic Background Elements for Footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Section */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">Billify</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Next-generation billing software designed to streamline your business operations with powerful analytics and native performance.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Dashboard</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-6">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Documentation</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">API Reference</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Help Center</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Community</Link></li>
              </ul>
            </div>

            {/* Contact Info (Name, Email, Text) */}
            <div>
              <h3 className="font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vinit Panchal</p>
                    <p className="text-xs text-gray-500">Founder & Lead Developer</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <a href="mailto:hello@billify.com" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    hello@billify.com
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <a href="tel:+1234567890" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    Text / Call: +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-3 group pt-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    123 Innovation Drive,<br />
                    Tech District, San Francisco
                  </p>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Billify Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, description, features, cta, popular }: { name: string, price: string, description: string, features: string[], cta: string, popular: boolean }) {
  return (
    <div className={cn(
      "flex flex-col p-8 rounded-3xl border transition-all duration-300 relative",
      popular 
        ? "bg-white dark:bg-[#0a0a0a] border-blue-600/50 shadow-2xl shadow-blue-500/10 scale-105 z-10" 
        : "bg-white/50 dark:bg-[#0a0a0a]/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-[#0a0a0a]"
    )}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-gray-500 text-sm font-medium">/month</span>}
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <Link 
        href="/signup" 
        className={cn(
          "w-full py-3 rounded-full font-bold text-sm transition-all text-center",
          popular 
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

function TechBentoCard({ icon, title, gradient }: { icon: React.ReactNode, title: string, gradient: string }) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative",
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, initial }: { quote: string, author: string, role: string, initial: string }) {
  return (
    <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl hover:bg-white dark:hover:bg-[#0a0a0a] hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
      <Quote className="w-10 h-10 text-blue-600/20 mb-6 group-hover:text-blue-600/40 transition-colors" />
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 italic">
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          {initial}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{author}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
