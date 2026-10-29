/**
 * WEBO Admin Dashboard
 *
 * A complete enterprise-level SaaS admin dashboard for managing the WEBO digital gift platform.
 *
 * Features:
 * - Dashboard Overview with KPI cards and analytics charts
 * - Order Management with filtering, search, and bulk actions
 * - Gift Management with status tracking
 * - NFC Tag Management and assignment
 * - Template Management (CRUD operations)
 * - Customer Management with detailed profiles
 * - Advanced Analytics with revenue, gift, and NFC metrics
 * - Settings for website, pricing, storage, email, and social media
 *
 * Access: Click the settings icon in the bottom-right corner or visit #admin
 */

import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardOverview } from "./DashboardOverview";
import { OrdersPage } from "./OrdersPage";
import { GiftsPage } from "./GiftsPage";
import { NFCPage } from "./NFCPage";
import { TemplatesPage } from "./TemplatesPage";
import { CustomersPage } from "./CustomersPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { SettingsPage } from "./SettingsPage";
import { SupportChatPage } from "./SupportChatPage";
import { MockConversationsPage } from "./MockConversationsPage";
import { AdminLogin } from "./AdminLogin";

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("wemo_admin_token");
    if (!token) {
      setIsLoggedIn(false);
      sessionStorage.removeItem("admin_logged_in");
      return;
    }

    fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
          sessionStorage.setItem("admin_logged_in", "true");
        } else {
          setIsLoggedIn(false);
          sessionStorage.removeItem("admin_logged_in");
          localStorage.removeItem("wemo_admin_token");
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <DashboardOverview />;
      case "orders":
        return <OrdersPage />;
      case "gifts":
        return <GiftsPage />;
      case "nfc":
        return <NFCPage />;
      case "templates":
        return <TemplatesPage />;
      case "customers":
        return <CustomersPage />;
      case "mock-conversations":
        return <MockConversationsPage />;
      case "support":
        return <SupportChatPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <DashboardLayout activePage={activePage} onPageChange={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  );
}
