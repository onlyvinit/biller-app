"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { z } from "zod";

const step1Schema = z.object({
    email: z.string().email("Invalid email").endsWith("@gmail.com", "Only @gmail.com emails are allowed"),
});

const step2Schema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const step3Schema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // persistent timer state
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Check local storage for an existing timer on mount
        const savedEndTime = localStorage.getItem("otp_timer_end");
        if (savedEndTime) {
            const remaining = Math.floor((parseInt(savedEndTime, 10) - Date.now()) / 1000);
            if (remaining > 0) {
                setTimeLeft(remaining);
            } else {
                localStorage.removeItem("otp_timer_end");
            }
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem("otp_timer_end");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeLeft]);

    const startTimer = () => {
        const end = Date.now() + 60 * 1000;
        localStorage.setItem("otp_timer_end", end.toString());
        setTimeLeft(60);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validation = step1Schema.safeParse({ email });
        if (!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep(2);
                startTimer();
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtpClick = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validation = step2Schema.safeParse({ otp });
        if (!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }
        setStep(3);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validation = step3Schema.safeParse({ password, confirmPassword });
        if (!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("otp_timer_end");
                // Redirect to login page with success param
                window.location.href = "/login?reset=success";
            } else {
                setError(data.error || "Failed to reset password.");
                if (data.error === "Invalid OTP provided" || data.error === "OTP expired or not found. Please request a new one.") {
                    setStep(2); // kick back to correct step if OTP was wrong
                }
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] flex overflow-hidden">
            {/* Left Column - Dynamic Visualizations */}
            <div className="hidden lg:flex flex-1 relative bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex-col justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <div className="relative z-10 px-16 max-w-2xl">
                    <Link href="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Billify</span>
                    </Link>

                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-4xl xl:text-5xl font-extrabold tracking-tight text-balance leading-tight mb-6">
                            Regain access to <br className="hidden xl:block" />
                            your <span className="text-gradient">account.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-lg">
                            We'll help you securely reset your password so you can get back to managing your business.
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* Right Column - Forgot Password Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 relative py-12 overflow-y-auto">
                <Link href="/" className="lg:hidden absolute top-8 left-6 inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold tracking-tight">Billify</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {step === 1 && "Enter your email to receive an OTP."}
                            {step === 2 && "Enter the OTP sent to your email."}
                            {step === 3 && "Create a new secure password."}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleSendOtp}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="owner@gmail.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 px-4 mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send OTP <ArrowRight className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleVerifyOtpClick}
                                    className="space-y-5"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl mb-4">
                                        We sent a secure 6-digit OTP to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                                    </p>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter OTP</label>
                                            {timeLeft > 0 ? (
                                                <span className="text-sm text-gray-500">Expires in 00:{timeLeft.toString().padStart(2, '0')}</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={isLoading}
                                                    className="text-sm text-blue-600 font-medium hover:underline"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                maxLength={6}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 tracking-widest font-mono text-lg"
                                                placeholder="000000"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!otp || otp.length < 6}
                                            className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20"
                                        >
                                            Next <ArrowRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {step === 3 && (
                                <motion.form
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleResetPassword}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="Create a strong password"
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Min 8 chars, 1 number, and 1 special character.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="Confirm your password"
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            disabled={isLoading}
                                            className="py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium transition-all disabled:opacity-70"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Reset Password <CheckCircle2 className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                        Remembered your password? <Link href="/login" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sign in here</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
