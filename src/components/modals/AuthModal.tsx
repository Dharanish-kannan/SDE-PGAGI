"use client";

import React, { useState } from "react";
import { X, User, Mail, Sparkles, LogOut, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, logout, updateProfile } from "@/redux/slices/authSlice";
import { useTranslation } from "@/i18n/useTranslation";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, bio, avatar }));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleToggleAuth = () => {
    if (user.isLoggedIn) {
      dispatch(logout());
    } else {
      dispatch(login({ name: name || "Dhara M.", email: user.email, avatar }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          onClick={onClose}
          id="close-auth-modal-btn"
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 id="auth-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {t("profileTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.isLoggedIn ? `${t("welcomeBack")}, ${user.name}` : "Sign in to customize your profile"}
            </p>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Select Avatar
          </label>
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            {AVATAR_OPTIONS.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(imgUrl)}
                className={`relative rounded-full overflow-hidden transition-all cursor-pointer ${
                  avatar === imgUrl ? "ring-2 ring-indigo-500 scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Avatar option ${idx}`} className="w-10 h-10 object-cover" />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Bio / About Me
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleToggleAuth}
              id="auth-toggle-btn"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {user.isLoggedIn ? t("logout") : t("login")}
            </button>

            <button
              type="submit"
              id="save-profile-btn"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
