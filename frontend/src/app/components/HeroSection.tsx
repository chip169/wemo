import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

const BASE_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560";
const REVEAL_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536";

const SPOTLIGHT_R = 270;

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer  = revealRef.current;
    if (!canvas || !layer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const mouse  = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const loop = () => {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, SPOTLIGHT_R);
      g.addColorStop(0,    "rgba(255,255,255,1)");
      g.addColorStop(0.4,  "rgba(255,255,255,1)");
      g.addColorStop(0.6,  "rgba(255,255,255,0.75)");
      g.addColorStop(0.75, "rgba(255,255,255,0.4)");
      g.addColorStop(0.88, "rgba(255,255,255,0.12)");
      g.addColorStop(1,    "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      const url = canvas.toDataURL();
      layer.style.webkitMaskImage = `url(${url})`;
      layer.style.maskImage        = `url(${url})`;
      layer.style.webkitMaskSize  = "100% 100%";
      layer.style.maskSize         = "100% 100%";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const bricks = [
    { w:28, h:28, top:"12%", left:"8%",   right:"",    bg:"#E8734A", delay:0,   dur:6  },
    { w:16, h:16, top:"22%", left:"14%",  right:"",    bg:"#D4AF78", delay:0.5, dur:8  },
    { w:20, h:20, top:"8%",  left:"23%",  right:"",    bg:"#E8B4A8", delay:1,   dur:7  },
    { w:12, h:12, top:"38%", left:"6%",   right:"",    bg:"#E8734A", delay:1.5, dur:9  },
    { w:24, h:24, top:"14%", left:"",     right:"8%",  bg:"#D4AF78", delay:0.3, dur:7  },
    { w:14, h:14, top:"30%", left:"",     right:"5%",  bg:"#E8B4A8", delay:0.8, dur:6  },
    { w:18, h:18, top:"58%", left:"",     right:"10%", bg:"#E8734A", delay:1.2, dur:10 },
    { w:10, h:10, top:"72%", left:"5%",   right:"",    bg:"#D4AF78", delay:0.6, dur:8  },
  ];

  const dots = [
    { size:6,  top:"48%", left:"4%",   right:"" },
    { size:4,  top:"62%", left:"18%",  right:"" },
    { size:8,  top:"22%", left:"",     right:"4%" },
    { size:5,  top:"76%", left:"",     right:"15%" },
    { size:4,  top:"82%", left:"28%",  right:"" },
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#FFF5F2]">
      <style>{`
        .wemo-splash {
          position:fixed; inset:0; z-index:9999;
          pointer-events:none; overflow:hidden;
          animation:splashHide 0.3s ease forwards;
          animation-delay:1.35s;
        }
        .splash-row { display:flex; width:100%; height:50%; }
        .splash-box { width:20%; height:100%; background:#D4957F; }
        .splash-row-top    .splash-box { animation:splashTop    1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
        .splash-row-bottom .splash-box { animation:splashBottom 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
        .splash-box:nth-child(1){animation-delay:0s;}
        .splash-box:nth-child(2){animation-delay:0.05s;}
        .splash-box:nth-child(3){animation-delay:0.1s;}
        .splash-box:nth-child(4){animation-delay:0.15s;}
        .splash-box:nth-child(5){animation-delay:0.2s;}
        @keyframes splashTop    { from{transform:translateY(0%)} to{transform:translateY(-100%)} }
        @keyframes splashBottom { from{transform:translateY(0%)} to{transform:translateY(100%)}  }
        @keyframes splashHide   { to{opacity:0;visibility:hidden} }
        @media(prefers-reduced-motion:reduce){
          .wemo-splash{ animation:splashHide 0.01s linear forwards; }
          .splash-box{ animation:none !important; }
        }
      `}</style>

      {/* Splash */}
      <div className="wemo-splash">
        <div className="splash-row splash-row-top">
          {[0,1,2,3,4].map(i => <div key={i} className="splash-box" />)}
        </div>
        <div className="splash-row splash-row-bottom">
          {[0,1,2,3,4].map(i => <div key={i} className="splash-box" />)}
        </div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x:[0,30,-20,0], y:[0,-40,20,0] }}
          transition={{ duration:18, repeat:Infinity, ease:"easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(232,180,168,0.55) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x:[0,-40,25,0], y:[0,30,-50,0] }}
          transition={{ duration:22, repeat:Infinity, ease:"easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(212,175,120,0.4) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale:[1,1.4,1], opacity:[0.25,0.5,0.25] }}
          transition={{ duration:8, repeat:Infinity, ease:"easeInOut" }}
          className="absolute top-[40%] left-[20%] w-52 h-52 rounded-full"
          style={{ background:"radial-gradient(circle, rgba(232,115,74,0.2) 0%, transparent 70%)" }}
        />
      </div>

      {/* LEGO bricks */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {bricks.map((s, i) => (
          <motion.div
            key={i}
            animate={{ y:[0,-18,0], rotate:[0,12,0], opacity:[0.7,1,0.7] }}
            transition={{ duration:s.dur, repeat:Infinity, ease:"easeInOut", delay:s.delay }}
            className="absolute rounded-[5px]"
            style={{
              width:s.w, height:s.h, top:s.top,
              left: s.left || undefined, right: s.right || undefined,
              background:s.bg, boxShadow:`0 4px 14px ${s.bg}99`,
            }}
          />
        ))}
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {dots.map((d, i) => (
          <motion.div
            key={i}
            animate={{ y:[0,-12,0], opacity:[0.4,0.9,0.4] }}
            transition={{ duration:5+i, repeat:Infinity, ease:"easeInOut", delay:i*0.4 }}
            className="absolute rounded-full bg-[#C2776A]"
            style={{ width:d.size, height:d.size, top:d.top, left:d.left||undefined, right:d.right||undefined }}
          />
        ))}
      </div>

      {/* Base image */}
      <motion.div
        initial={{ opacity:0, scale:1.5, rotate:3 }}
        animate={{ opacity:1, scale:1,   rotate:0 }}
        transition={{ duration:1.2, ease:[0.25,0.46,0.45,0.94], delay:1 }}
        className="absolute inset-0 z-[5] bg-no-repeat"
        style={{ backgroundImage:`url('${BASE_IMG}')`, backgroundSize:"85% auto", backgroundPosition:"center 80px" }}
      />

      {/* Canvas mask */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display:"none" }} />

      {/* Reveal image */}
      <div
        ref={revealRef}
        className="absolute inset-0 z-[7] pointer-events-none bg-no-repeat"
        style={{ backgroundImage:`url('${REVEAL_IMG}')`, backgroundSize:"85% auto", backgroundPosition:"center 80px" }}
      />

      {/* Tagline + CTA bottom-left */}
      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, delay:1.8 }}
        className="absolute bottom-10 left-8 z-[9] flex flex-col gap-3"
      >
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C2776A]">
          🧱 Personalized LEGO Figure
        </p>
        <h2 className="text-2xl md:text-[2rem] font-extrabold text-[#2A1A14] leading-tight">
          Nhân vật LEGO<br/>
          <span className="text-[#E8734A]">của riêng bạn.</span>
        </h2>
        <Link
          to="/order"
          className="mt-1 w-fit inline-flex items-center gap-2 px-5 py-3 rounded-full
                     bg-[#2A1A14] text-white text-sm font-bold tracking-wide
                     hover:bg-[#E8734A] transition-all duration-300 hover:scale-105
                     shadow-lg shadow-black/20 hover:shadow-[#E8734A]/30"
        >
          Đặt ngay
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>




      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 z-[8] pointer-events-none"
           style={{ background:"linear-gradient(to bottom, transparent, rgba(252,225,218,0.7))" }} />
    </section>
  );
}
