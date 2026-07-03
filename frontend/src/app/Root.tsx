import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SupportChatWidget } from "./components/SupportChatWidget";

export function Root() {
  const navigate = useNavigate();
  const lastKeyPressTime = useRef<number>(0);

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

  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SupportChatWidget />
    </div>
  );
}
