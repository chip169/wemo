import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

const BASE_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560";
const REVEAL_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536";
const SPOTLIGHT_R = 240;

export function HeroSection() {
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const mobileRevealRef = useRef<HTMLDivElement>(null);
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const desktopRevealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let autoAngle = 0;
    const mouse = { x: -999, y: -999 };
    const smooth = { x: window.innerWidth / 2, y: window.innerHeight * 0.35 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let touchTimeout: NodeJS.Timeout | null = null;
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (touchTimeout) clearTimeout(touchTimeout);
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        mouse.x = -999;
        mouse.y = -999;
      }, 2500);
    };

    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    let raf: number;
    const loop = () => {
      const isMobile = window.innerWidth < 768;
      const canvas = isMobile ? mobileCanvasRef.current : desktopCanvasRef.current;
      const layer = isMobile ? mobileRevealRef.current : desktopRevealRef.current;

      if (canvas && layer) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const rect = layer.getBoundingClientRect();
          const targetW = Math.max(1, Math.round(rect.width));
          const targetH = Math.max(1, Math.round(rect.height));

          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          let targetX = 0;
          let targetY = 0;

          if (mouse.x === -999) {
            autoAngle += 0.012;
            const cx = targetW * 0.5;
            const cy = targetH * (isMobile ? 0.42 : 0.38);
            targetX = cx + Math.cos(autoAngle) * (targetW * (isMobile ? 0.22 : 0.18));
            targetY = cy + Math.sin(autoAngle) * (targetH * (isMobile ? 0.12 : 0.1));
          } else {
            targetX = mouse.x - rect.left;
            targetY = mouse.y - rect.top;
          }

          smooth.x += (targetX - smooth.x) * (isMobile ? 0.08 : 0.1);
          smooth.y += (targetY - smooth.y) * (isMobile ? 0.08 : 0.1);

          const r = isMobile ? Math.min(targetW, targetH) * 0.38 : SPOTLIGHT_R;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, r);
          g.addColorStop(0, "rgba(255,255,255,1)");
          g.addColorStop(0.35, "rgba(255,255,255,1)");
          g.addColorStop(0.55, "rgba(255,255,255,0.8)");
          g.addColorStop(0.75, "rgba(255,255,255,0.35)");
          g.addColorStop(0.9, "rgba(255,255,255,0.08)");
          g.addColorStop(1, "rgba(255,255,255,0)");

          ctx.beginPath();
          ctx.arc(smooth.x, smooth.y, r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();

          const url = canvas.toDataURL();
          layer.style.webkitMaskImage = `url(${url})`;
          layer.style.maskImage = `url(${url})`;
          layer.style.webkitMaskSize = "100% 100%";
          layer.style.maskSize = "100% 100%";
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      if (touchTimeout) clearTimeout(touchTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  const bricks = [
    { w: 20, h: 20, top: "8%", left: "5%", right: "", bg: "#E8734A", delay: 0, dur: 6 },
    { w: 13, h: 13, top: "18%", left: "11%", right: "", bg: "#D4AF78", delay: 0.5, dur: 8 },
    { w: 16, h: 16, top: "5%", left: "21%", right: "", bg: "#E8B4A8", delay: 1, dur: 7 },
    { w: 18, h: 18, top: "10%", left: "", right: "5%", bg: "#D4AF78", delay: 0.3, dur: 7 },
    { w: 11, h: 11, top: "26%", left: "", right: "3%", bg: "#E8B4A8", delay: 0.8, dur: 6 },
    { w: 14, h: 14, top: "52%", left: "", right: "6%", bg: "#E8734A", delay: 1.2, dur: 10 },
    { w: 8, h: 8, top: "65%", left: "4%", right: "", bg: "#D4AF78", delay: 0.6, dur: 8 },
  ];

  return (
    <>
      <style>{`
        .wemo-splash {
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none; overflow: hidden;
          animation: splashHide 0.3s ease forwards;
          animation-delay: 1.35s;
        }
        .splash-row { display: flex; width: 100%; height: 50%; }
        .splash-box { width: 20%; height: 100%; background: #D4957F; }
        .splash-row-top    .splash-box { animation: splashTop    1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
        .splash-row-bottom .splash-box { animation: splashBottom 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
        .splash-box:nth-child(1) { animation-delay: 0s; }
        .splash-box:nth-child(2) { animation-delay: 0.05s; }
        .splash-box:nth-child(3) { animation-delay: 0.1s; }
        .splash-box:nth-child(4) { animation-delay: 0.15s; }
        .splash-box:nth-child(5) { animation-delay: 0.2s; }
        @keyframes splashTop    { from { transform: translateY(0%); } to { transform: translateY(-100%); } }
        @keyframes splashBottom { from { transform: translateY(0%); } to { transform: translateY(100%); }  }
        @keyframes splashHide   { to { opacity: 0; visibility: hidden; } }
      `}</style>

      {/* Splash intro animation */}
      <div className="wemo-splash">
        <div className="splash-row splash-row-top">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="splash-box" />
          ))}
        </div>
        <div className="splash-row splash-row-bottom">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="splash-box" />
          ))}
        </div>
      </div>

      {/* ════ MOBILE (< md): Native app feeling layout ════ */}
      <section className="md:hidden flex flex-col bg-[#FFF5F2]" style={{ minHeight: "100svh" }}>
        {/* Top Interactive Spotlight Visual Area */}
        <div className="relative w-full overflow-hidden" style={{ height: "54svh", minHeight: "350px", paddingTop: "60px" }}>
          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 -left-16 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(232,180,168,0.5) 0%, transparent 70%)" }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(212,175,120,0.4) 0%, transparent 70%)" }}
            />
          </div>

          {/* Floating bricks */}
          {bricks.map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0], rotate: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              className="absolute rounded-[4px] z-10"
              style={{
                width: s.w * 0.85,
                height: s.h * 0.85,
                top: s.top,
                left: s.left || undefined,
                right: s.right || undefined,
                background: s.bg,
                boxShadow: `0 3px 10px ${s.bg}88`,
              }}
            />
          ))}

          {/* Base image (Blue character) */}
          <motion.div
            className="absolute inset-0 z-[5] bg-no-repeat bg-center"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
            style={{ backgroundImage: `url('${BASE_IMG}')`, backgroundSize: "contain" }}
          />

          {/* Canvas mask (Hidden) */}
          <canvas ref={mobileCanvasRef} className="absolute inset-0 pointer-events-none z-[6]" style={{ display: "none" }} />

          {/* Reveal image (Fiery character revealed by spotlight) */}
          <div
            ref={mobileRevealRef}
            className="absolute inset-0 z-[7] pointer-events-none bg-no-repeat bg-center"
            style={{ backgroundImage: `url('${REVEAL_IMG}')`, backgroundSize: "contain" }}
          />

          {/* Bottom gentle fade to blend cleanly into content */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 z-[8] pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #FFF5F2)" }}
          />
        </div>

        {/* Bottom Content Area: clean, distinct, fully visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col gap-4 px-6 pb-12 pt-1"
        >
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E8734A]">
            🧱 Personalized LEGO Figure
          </p>

          <h2 className="text-[1.9rem] font-black text-[#2A1A14] leading-[1.18] tracking-tight">
            Nhân vật LEGO<br />
            <span className="text-[#E8734A]">của riêng bạn.</span>
          </h2>

          <p className="text-sm text-[#6B4D42] leading-relaxed">
            Cá nhân hóa độc nhất — giao nhanh, chất lượng cao.
          </p>

          <Link
            to="/order"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
                       bg-[#2A1A14] text-white text-base font-bold
                       active:scale-95 transition-all duration-200
                       shadow-lg shadow-black/25 hover:bg-[#E8734A]"
          >
            Đặt ngay
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="flex gap-6 pt-2 border-t border-[#E8B4A8]/30">
            {[
              { v: "10K+", l: "Nhân vật" },
              { v: "4.9★", l: "Đánh giá" },
              { v: "95%", l: "Hài lòng" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-sm font-black text-[#2A1A14]">{s.v}</div>
                <div className="text-[10px] text-[#9A7060]">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════ DESKTOP (≥ md): Full-screen spotlight experience ════ */}
      <section className="hidden md:block relative w-full min-h-screen overflow-hidden bg-[#FFF5F2]">
        {/* Ambient orbs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,180,168,0.55) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ x: [0, -40, 25, 0], y: [0, 30, -50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(212,175,120,0.4) 0%, transparent 70%)" }}
          />
        </div>

        {/* Floating bricks */}
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          {bricks.map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -18, 0], rotate: [0, 12, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              className="absolute rounded-[5px]"
              style={{
                width: s.w,
                height: s.h,
                top: s.top,
                left: s.left || undefined,
                right: s.right || undefined,
                background: s.bg,
                boxShadow: `0 4px 14px ${s.bg}99`,
              }}
            />
          ))}
        </div>

        {/* Base image (Blue character) */}
        <motion.div
          className="absolute inset-0 z-[5] bg-no-repeat"
          initial={{ opacity: 0, scale: 1.5, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 1 }}
          style={{
            backgroundImage: `url('${BASE_IMG}')`,
            backgroundSize: "85% auto",
            backgroundPosition: "center 80px",
          }}
        />

        {/* Canvas mask (Hidden) */}
        <canvas ref={desktopCanvasRef} className="absolute inset-0 pointer-events-none" style={{ display: "none" }} />

        {/* Reveal image (Fiery character) */}
        <div
          ref={desktopRevealRef}
          className="absolute inset-0 z-[7] pointer-events-none bg-no-repeat"
          style={{
            backgroundImage: `url('${REVEAL_IMG}')`,
            backgroundSize: "85% auto",
            backgroundPosition: "center 80px",
          }}
        />

        {/* Desktop bottom-left Content & CTA */}
        <motion.div
          className="absolute bottom-10 left-8 z-[9] flex flex-col gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C2776A]">
            🧱 Personalized LEGO Figure
          </p>
          <h2 className="text-[2rem] font-extrabold text-[#2A1A14] leading-tight">
            Nhân vật LEGO<br />
            <span className="text-[#E8734A]">của riêng bạn.</span>
          </h2>
          <Link
            to="/order"
            className="mt-1 w-fit inline-flex items-center gap-2 px-5 py-3 rounded-full
                       bg-[#2A1A14] text-white text-sm font-bold tracking-wide
                       hover:bg-[#E8734A] transition-all duration-300 hover:scale-105 shadow-lg shadow-black/20"
          >
            Đặt ngay
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 z-[8] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,245,242,0.7))" }}
        />
      </section>
    </>
  );
}
