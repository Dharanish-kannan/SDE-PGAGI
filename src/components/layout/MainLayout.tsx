"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ContentFeed from "@/components/feed/ContentFeed";
import TrendingSection from "@/components/sections/TrendingSection";
import FavoritesSection from "@/components/sections/FavoritesSection";
import AnalyticsSection from "@/components/sections/AnalyticsSection";
import SettingsModal from "@/components/modals/SettingsModal";
import AuthModal from "@/components/modals/AuthModal";
import DetailModal from "@/components/modals/DetailModal";
import RealtimeTicker from "@/components/common/RealtimeTicker";
import { useAppSelector } from "@/redux/hooks";

export default function MainLayout() {
  const activeSection = useAppSelector((state) => state.content.activeSection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeSection === "feed" && <ContentFeed />}
          {activeSection === "trending" && <TrendingSection />}
          {activeSection === "favorites" && <FavoritesSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
        </main>
      </div>

      {/* Modals & Live Notifications */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <DetailModal />

      <RealtimeTicker />
    </div>
  );
}
