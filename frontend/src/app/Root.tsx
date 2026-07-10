import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SupportChatWidget } from "./components/SupportChatWidget";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastKeyPressTime = useRef<number>(0);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in form fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === "h") {
        const currentTime = new Date().getTime();
        // Check if double press happens within 500ms
        if (currentTime - lastKeyPressTime.current < 500) {
          e.preventDefault();
          navigate("/adminWemo");
        }
        lastKeyPressTime.current = currentTime;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Ẩn Header chỉ trên các trang standalone full-page
  const hideHeader =
    location.pathname === "/toonhub" ||
    location.pathname === "/orbis";

  // Các trang standalone (/toonhub, /orbis) ẩn Footer vì chúng là full-page độc lập
  const hideFooter =
    location.pathname === "/toonhub" ||
    location.pathname === "/orbis";

  return (
    <div className="min-h-screen relative">
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      {!hideFooter && <SupportChatWidget />}
    </div>
  );
}
