"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { Loader2, Trash2 } from "lucide-react";

export default function AccountDeletionFlow() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    if (isLoading) return;
    setStep(0);
  };

  const nextStep = () => setStep((s) => s + 1);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete account");
        setIsLoading(false);
      }
    } catch (e) {
      alert("An error occurred. The universe is trying to save your account.");
      setIsLoading(false);
    }
  };

  const modals = [
    {
      title: "Delete Account?",
      desc: "Are you sure you want to delete your account? All your precious data will be gone forever. It's a sad day.",
      cancel: "No, wait! I love Billify",
      confirm: "Yes, I'm sure",
    },
    {
      title: "Really?",
      desc: "Like, really really sure? We have feelings too, you know. Think of the electrons you're killing by wiping out your data.",
      cancel: "Okay, I'll stay",
      confirm: "I don't care about electrons, delete it",
    },
    {
      title: "Wow. Heartless.",
      desc: "Fine. Be that way. I hope you step on a Lego when you get out of bed tomorrow.",
      cancel: "I'm sorry, I didn't mean to hurt your feelings",
      confirm: "Bring on the Legos, continue",
    },
    {
      title: "Is this a joke to you?",
      desc: "There's no turning back after this point. Well, there wasn't after step 1 either, but seriously.",
      cancel: "Haha, just kidding",
      confirm: "I'm not laughing. Delete it.",
    },
    {
      title: "Final Warning!",
      desc: "Just kidding, there are still 2 more warnings after this. We are very needy and clingy.",
      cancel: "I can see that, cancel",
      confirm: "I have all day, delete my account",
    },
    {
      title: "Okay, actual final warning.",
      desc: "Last chance to back out. We'll even throw in a virtual cookie 🍪 if you stay.",
      cancel: "Ooh, cookie! I'm staying.",
      confirm: "I'm allergic to cookies. Delete.",
    },
    {
      title: "You monster.",
      desc: "Fine. Click the button below to wipe your existence from our database. We won't miss you (we will).",
      cancel: "Nevermind, I feel bad",
      confirm: "Wipe My Existence",
      danger: true,
    },
  ];

  return (
    <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-500 mb-2 flex items-center gap-2">
        <Trash2 className="w-5 h-5" /> Danger Zone
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        onClick={nextStep}
        className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-200 dark:border-red-500/20"
      >
        Delete Account
      </button>

      {modals.map((modal, index) => (
        <Modal
          key={index}
          isOpen={step === index + 1}
          onClose={handleClose}
          title={modal.title}
          description={modal.desc}
        >
          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {modal.cancel}
            </button>
            <button
              onClick={index === modals.length - 1 ? handleDelete : nextStep}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 flex justify-center items-center gap-2 rounded-lg text-sm font-medium transition-colors text-white ${
                modal.danger
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-600/50"
                  : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50"
              }`}
            >
              {isLoading && index === modals.length - 1 && <Loader2 className="w-4 h-4 animate-spin" />}
              {modal.confirm}
            </button>
          </div>
        </Modal>
      ))}
    </div>
  );
}
