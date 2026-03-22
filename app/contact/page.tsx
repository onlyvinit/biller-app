"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ArrowLeft,
  Zap,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#030712]/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Billify</span>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              >
                Get in <span className="text-blue-600">Touch</span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Have questions about Billify? Our team is here to help you revolutionize your billing process.
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Support Channels</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Us</p>
                        <p className="font-medium">support@billify.com</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Call Us</p>
                        <p className="font-medium">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Us</p>
                        <p className="font-medium">123 Billing St, Fintech City</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <Clock className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Support Hours</h3>
                  <p className="text-blue-100 text-sm mb-4">We're available to help you during these hours:</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span>Mon - Fri</span> <span>9am - 6pm</span></li>
                    <li className="flex justify-between"><span>Saturday</span> <span>10am - 4pm</span></li>
                    <li className="flex justify-between opacity-50"><span>Sunday</span> <span>Closed</span></li>
                  </ul>
                </div>
              </motion.div>

              {/* Form Section */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none min-h-[500px] flex flex-col">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                          <h2 className="text-2xl font-bold">Send a Message</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                              <input 
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="John Doe"
                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Your Email</label>
                              <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="john@example.com"
                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2 flex-1 min-h-[150px] flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">How can we help?</label>
                            <textarea 
                              required
                              value={formData.message}
                              onChange={(e) => setFormData({...formData, message: e.target.value})}
                              placeholder="Describe your query here..."
                              className="w-full flex-1 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                          </div>
                          
                          <button 
                            disabled={isLoading}
                            type="submit"
                            className="w-full md:w-auto self-end px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
                          >
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                Send Message
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                      >
                        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                          <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                            We've received your message and will get back to you within 24 hours.
                          </p>
                        </div>
                        <button 
                          onClick={() => setIsSubmitted(false)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Send another message
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#030712] border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl">Billify</span>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            </div>

            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Billify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
