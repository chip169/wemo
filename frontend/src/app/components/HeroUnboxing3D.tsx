import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Nfc, Smartphone, Sparkles, Heart } from "lucide-react";

export function HeroUnboxing3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to animations
  // Lid opens from 15% to 50% scroll
  const lidRotateX = useTransform(scrollYProgress, [0.15, 0.45], [0, -135]);
  
  // Front flap folds down from 15% to 45% scroll
  const frontRotateX = useTransform(scrollYProgress, [0.15, 0.45], [0, 95]);
  
  // Figures rise up from 40% to 70% scroll
  const figureY = useTransform(scrollYProgress, [0.35, 0.65], [30, -50]);
  const figureScale = useTransform(scrollYProgress, [0.35, 0.65], [0.75, 1.15]);
  const figureOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0.2, 1]);
  
  // Inside light glow increases as box opens
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.85]);
  
  // NFC wave ripples active from 60% to 90% scroll
  const nfcOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const nfcScale1 = useTransform(scrollYProgress, [0.6, 0.85], [0.5, 2]);
  const nfcScale2 = useTransform(scrollYProgress, [0.65, 0.9], [0.5, 2.5]);
  const rippleOpacity1 = useTransform(scrollYProgress, [0.6, 0.85], [0.8, 0]);
  const rippleOpacity2 = useTransform(scrollYProgress, [0.65, 0.9], [0.6, 0]);

  // Phone mockup slides in from 70% to 95% scroll
  const phoneX = useTransform(scrollYProgress, [0.65, 0.9], [120, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const phoneRotate = useTransform(scrollYProgress, [0.65, 0.9], [15, -8]);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] flex flex-col items-center">
      {/* Sticky container for the scene */}
      <div className="sticky top-24 w-full h-[80vh] flex items-center justify-center overflow-hidden">
        
        {/* Decorative Grid Background to emphasize depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        {/* Main 3D Wrapper */}
        <div className="relative flex items-center justify-center w-full max-w-5xl h-full px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left side: 3D Scene Box (take 7 cols) */}
            <div className="lg:col-span-7 flex justify-center items-center h-[500px] webo-3d-scene select-none">
              
              {/* 3D Box Container with mouse tilt (static tilt for reliability) */}
              <div 
                className="relative w-[340px] h-[340px] transition-transform duration-300"
                style={{
                  transform: "rotateX(20deg) rotateY(-20deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                
                {/* 1. BOTTOM BASE (Fixed) */}
                <div 
                  className="absolute inset-0 bg-[#fbc6be] border-2 border-[#e5a59c] rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{
                    transform: "rotateX(-90deg) translateZ(170px)",
                    transformStyle: "preserve-3d",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Stand for figures */}
                  <div className="w-[200px] h-[200px] rounded-full border border-white/40 bg-white/20 flex items-center justify-center shadow-inner relative">
                    {/* NFC Symbol on Stand */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Nfc className="w-10 h-10 text-white/50" />
                    </div>

                    {/* NFC Ripple Waves */}
                    <motion.div 
                      style={{ scale: nfcScale1, opacity: rippleOpacity1 }}
                      className="absolute w-[180px] h-[180px] border-2 border-[#E8B4A8] rounded-full"
                    />
                    <motion.div 
                      style={{ scale: nfcScale2, opacity: rippleOpacity2 }}
                      className="absolute w-[180px] h-[180px] border-2 border-white/60 rounded-full"
                    />
                  </div>
                </div>

                {/* 2. BACK WALL (Fixed) */}
                <div 
                  className="absolute inset-0 bg-[#fde8e5] border border-[#f0c3bd] rounded-2xl p-4 flex flex-col justify-end items-center"
                  style={{
                    transform: "translateZ(-170px)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Cute internal pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e8b4a8_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-25" />
                  <Heart className="w-16 h-16 text-[#e8b4a8]/30 mb-8 animate-pulse" />
                </div>

                {/* 3. LEFT WALL (Fixed) */}
                <div 
                  className="absolute inset-0 bg-[#fbc6be] border border-[#e5a59c] rounded-2xl p-6 flex flex-col justify-center items-start text-white"
                  style={{
                    transform: "rotateY(90deg) translateZ(-170px)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <p className="font-serif italic text-2xl tracking-wide opacity-90 drop-shadow">Always</p>
                  <p className="font-serif italic text-2xl tracking-wide opacity-90 drop-shadow ml-4">with you</p>
                </div>

                {/* 4. RIGHT WALL (Fixed) */}
                <div 
                  className="absolute inset-0 bg-[#fbc6be] border border-[#e5a59c] rounded-2xl"
                  style={{
                    transform: "rotateY(-90deg) translateZ(-170px)",
                    transformStyle: "preserve-3d"
                  }}
                />

                {/* 5. TOP LID (Rotates UP / BACK) */}
                <motion.div 
                  className="absolute inset-0 bg-[#fbc6be] border-2 border-[#e5a59c] rounded-2xl flex items-center justify-center"
                  style={{
                    transformOrigin: "top center",
                    rotateX: lidRotateX,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden"
                  }}
                >
                  {/* Heart & Cream Decoration on Top of Box */}
                  <div className="relative w-28 h-28 bg-[#faf8f6] rounded-full shadow-lg border border-[#e5a59c]/30 flex items-center justify-center transform translateZ(10px)">
                    {/* Cream dollops border */}
                    <div className="absolute inset-0 border-4 border-dashed border-[#e8b4a8]/30 rounded-full" />
                    {/* Red Heart on top */}
                    <Heart className="w-12 h-12 text-[#e95a47] fill-[#e95a47] drop-shadow-md animate-bounce" />
                  </div>
                </motion.div>

                {/* 6. FRONT FLAP (Rotates DOWN to become a ramp) */}
                <motion.div 
                  className="absolute inset-0 bg-[#fbc6be] border-2 border-[#e5a59c] rounded-2xl flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    transformOrigin: "bottom center",
                    rotateX: frontRotateX,
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Inside side of front flap */}
                  <div 
                    className="absolute inset-0 bg-[#fde8e5] rounded-xl border border-white/40 p-4 flex flex-col items-center justify-center text-[#8A4F43]"
                    style={{
                      transform: "rotateX(180deg) translateZ(1px)",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <Heart className="w-8 h-8 text-[#e8b4a8] mb-2 fill-[#e8b4a8]/20" />
                    <p className="font-serif italic text-xl font-bold tracking-wide">Happy</p>
                    <p className="font-serif italic text-lg tracking-wide">Anniversary</p>
                  </div>

                  {/* Outside side of front flap (seen when closed) */}
                  <div className="w-20 h-20 rounded-full border-2 border-white/60 bg-white/20 flex items-center justify-center shadow-inner">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* --- INNER LIGHT GLOW EFFECT --- */}
                <motion.div 
                  className="absolute inset-0 bg-radial-gradient from-yellow-100/40 via-orange-100/10 to-transparent pointer-events-none rounded-2xl"
                  style={{
                    transform: "translateZ(-80px)",
                    opacity: glowOpacity
                  }}
                />

                {/* --- THE CHIBI COUPLE FIGURE (Rises from bottom) --- */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    y: figureY,
                    scale: figureScale,
                    opacity: figureOpacity,
                    transformStyle: "preserve-3d",
                    transform: "translateZ(-80px)",
                  }}
                >
                  {/* SVG Chibi Figure Couple */}
                  <svg className="w-[240px] h-[240px] filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="boyHair" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4A3B32" />
                        <stop offset="100%" stopColor="#2E241E" />
                      </linearGradient>
                      <linearGradient id="girlHair" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5C4033" />
                        <stop offset="100%" stopColor="#3D2B1F" />
                      </linearGradient>
                      <linearGradient id="pinkDress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FBB6CE" />
                        <stop offset="100%" stopColor="#ED64A6" />
                      </linearGradient>
                      <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFE5D9" />
                        <stop offset="100%" stopColor="#FFD3B6" />
                      </linearGradient>
                    </defs>

                    {/* Circular Base Shadow */}
                    <ellipse cx="200" cy="350" rx="90" ry="15" fill="black" opacity="0.12" />

                    {/* ================= BOY (LEFT) ================= */}
                    <g transform="translate(-10, 0)">
                      {/* Body & Clothes */}
                      {/* Pants */}
                      <path d="M 120 290 L 170 290 L 165 340 L 115 340 Z" fill="#2D3748" />
                      {/* Legs/Shoes */}
                      <rect x="110" y="335" width="22" height="15" rx="7" fill="#FFFFFF" stroke="#CBD5E0" strokeWidth="1" />
                      <rect x="150" y="335" width="22" height="15" rx="7" fill="#FFFFFF" stroke="#CBD5E0" strokeWidth="1" />
                      
                      {/* Shirt (Beige) */}
                      <path d="M 115 230 L 175 230 L 170 300 L 120 300 Z" fill="#F5EDE4" />
                      {/* Buttons & Collar */}
                      <line x1="145" y1="238" x2="145" y2="295" stroke="#D4AF78" strokeWidth="2.5" strokeDasharray="1,6" />
                      <path d="M 130 230 L 145 240 L 160 230" fill="none" stroke="#D4AF78" strokeWidth="2" />
                      {/* Arms */}
                      <path d="M 115 235 Q 95 260 115 285" fill="none" stroke="#F5EDE4" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 175 235 Q 195 260 175 285" fill="none" stroke="#F5EDE4" strokeWidth="14" strokeLinecap="round" />
                      {/* Hands */}
                      <circle cx="112" cy="285" r="9" fill="url(#skin)" />
                      <circle cx="178" cy="285" r="9" fill="url(#skin)" />

                      {/* Head */}
                      <circle cx="145" cy="180" r="48" fill="url(#skin)" />
                      
                      {/* Face Details */}
                      {/* Blush */}
                      <ellipse cx="112" cy="195" rx="8" ry="4" fill="#FF8A8A" opacity="0.5" />
                      <ellipse cx="178" cy="195" rx="8" ry="4" fill="#FF8A8A" opacity="0.5" />
                      {/* Winking Eye (Left) */}
                      <path d="M 115 180 Q 125 170 130 180" fill="none" stroke="#1A1818" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Happy Closed Eye (Right) */}
                      <path d="M 160 180 Q 167 172 175 180" fill="none" stroke="#1A1818" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Mouth (Smile) */}
                      <path d="M 140 200 Q 145 206 150 200" fill="none" stroke="#1A1818" strokeWidth="3" strokeLinecap="round" />

                      {/* Hair (Messy Chibi Boy Hair) */}
                      <path d="M 97 180 C 95 125 145 110 193 140 C 200 160 190 190 185 190 C 180 180 170 165 160 175 C 150 185 145 165 135 170 C 125 175 120 160 110 170 C 102 178 100 182 97 180 Z" fill="url(#boyHair)" />
                      {/* Hair Spikes */}
                      <path d="M 125 130 L 132 118 L 140 128" fill="url(#boyHair)" />
                      <path d="M 150 125 L 158 114 L 165 125" fill="url(#boyHair)" />
                    </g>

                    {/* ================= GIRL (RIGHT) ================= */}
                    <g transform="translate(10, 0)">
                      {/* Body & Clothes */}
                      {/* Legs/Shoes */}
                      <rect x="228" y="336" width="20" height="14" rx="7" fill="#FBB6CE" stroke="#ED64A6" strokeWidth="1" />
                      <rect x="262" y="336" width="20" height="14" rx="7" fill="#FBB6CE" stroke="#ED64A6" strokeWidth="1" />
                      
                      {/* Dress (Pink) */}
                      <path d="M 230 230 L 280 230 L 305 310 C 280 325 230 325 205 310 Z" fill="url(#pinkDress)" />
                      {/* White Collar */}
                      <path d="M 245 230 Q 255 240 265 230" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
                      {/* Puff Sleeves */}
                      <circle cx="226" cy="240" r="11" fill="url(#pinkDress)" />
                      <circle cx="284" cy="240" r="11" fill="url(#pinkDress)" />
                      {/* Arms */}
                      <path d="M 224 242 Q 212 270 235 282" fill="none" stroke="url(#skin)" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 286 242 Q 298 270 275 282" fill="none" stroke="url(#skin)" strokeWidth="8" strokeLinecap="round" />
                      {/* Hands clasping */}
                      <circle cx="238" cy="282" r="7" fill="url(#skin)" />
                      <circle cx="272" cy="282" r="7" fill="url(#skin)" />

                      {/* Head */}
                      <circle cx="255" cy="180" r="46" fill="url(#skin)" />
                      
                      {/* Face Details */}
                      {/* Blush */}
                      <ellipse cx="225" cy="196" rx="8" ry="4" fill="#FF8A8A" opacity="0.55" />
                      <ellipse cx="285" cy="196" rx="8" ry="4" fill="#FF8A8A" opacity="0.55" />
                      {/* Eyes (Anime style big eyes) */}
                      <ellipse cx="232" cy="182" rx="6.5" ry="9" fill="#2E241E" />
                      <ellipse cx="278" cy="182" rx="6.5" ry="9" fill="#2E241E" />
                      {/* Eye Sparkles */}
                      <circle cx="230" cy="178" r="2.5" fill="#FFFFFF" />
                      <circle cx="276" cy="178" r="2.5" fill="#FFFFFF" />
                      <circle cx="234" cy="185" r="1" fill="#FFFFFF" />
                      <circle cx="280" cy="185" r="1" fill="#FFFFFF" />
                      {/* Eyelashes */}
                      <path d="M 223 176 Q 230 171 239 177" fill="none" stroke="#2E241E" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 287 176 Q 280 171 271 177" fill="none" stroke="#2E241E" strokeWidth="2" strokeLinecap="round" />
                      {/* Mouth */}
                      <path d="M 252 201 Q 255 205 258 201" fill="none" stroke="#1A1818" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Hair (Long Brown Hair with Bangs) */}
                      {/* Back Hair */}
                      <path d="M 205 180 C 205 270 215 310 215 310 L 295 310 C 295 310 305 270 305 180 Z" fill="url(#girlHair)" />
                      {/* Front Bangs & Sides */}
                      <path d="M 206 180 C 205 125 255 112 304 150 C 308 170 302 210 298 210 C 295 195 292 185 285 182 C 275 168 268 178 255 174 C 242 178 235 168 225 182 C 218 185 215 195 212 210 C 208 210 207 195 206 180 Z" fill="url(#girlHair)" />
                      {/* Pink Ribbon Bow */}
                      <g transform="translate(285, 142) rotate(15)">
                        <rect x="0" y="4" width="12" height="10" rx="3" fill="#F56565" />
                        <rect x="16" y="4" width="12" height="10" rx="3" fill="#F56565" />
                        <circle cx="14" cy="9" r="4.5" fill="#E53E3E" />
                      </g>
                    </g>
                  </svg>
                </motion.div>

              </div>
            </div>

            {/* Right side: App Phone Mockup + NFC Indicator (take 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
              
              {/* NFC Sensor Tap Trigger Indicator */}
              <motion.div 
                style={{ opacity: nfcOpacity }}
                className="mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E8B4A8] shadow-lg"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full bg-[#E8B4A8] animate-ping" />
                  <div className="relative w-2.5 h-2.5 rounded-full bg-[#E8B4A8]" />
                </div>
                <span className="text-xs font-bold text-stone-700 tracking-wide">
                  ĐANG PHÁT TÍN HIỆU NFC...
                </span>
              </motion.div>

              {/* Smartphone mockup */}
              <motion.div 
                style={{
                  x: phoneX,
                  opacity: phoneOpacity,
                  rotate: phoneRotate
                }}
                className="relative w-[280px] aspect-[9/18.5] bg-[#0A0A0A] rounded-[42px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-stone-800"
              >
                {/* Dynamic Screen */}
                <div className="w-full h-full bg-[#FAF8F5] rounded-[34px] overflow-hidden flex flex-col relative">
                  
                  {/* Phone Notch/Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30" />

                  {/* App Screen Content */}
                  <div className="w-full h-full pt-8 p-4 flex flex-col items-center justify-between text-stone-800">
                    
                    {/* Header of mobile app */}
                    <div className="w-full flex items-center justify-between text-[10px] font-bold text-stone-400">
                      <span>WEMO GIFT</span>
                      <span>100% ✓</span>
                    </div>

                    {/* App Core Display */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center py-4 space-y-3">
                      {/* Photo memory preview */}
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-stone-100"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=300"
                          alt="Romantic Couple Memory"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Music Visualizer Bar */}
                      <div className="w-full py-1.5 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-[#E8B4A8] tracking-widest uppercase mb-1">ĐANG PHÁT NHẠC</span>
                        <div className="flex gap-1 items-center h-4">
                          {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: [6, 16, 6] }}
                              transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity, ease: "easeInOut" }}
                              className="w-0.5 bg-[#E8B4A8] rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Letter content */}
                      <div className="text-center">
                        <h4 className="font-serif italic text-base font-bold text-stone-900 leading-tight">Gửi Cục Cưng Của Anh,</h4>
                        <p className="text-[10px] text-stone-500 leading-relaxed mt-1 line-clamp-3">
                          Kỷ niệm 5 năm bên nhau thật ý nghĩa. Cảm ơn em vì đã luôn đồng hành cùng anh trên mọi chặng đường. Anh yêu em rất nhiều! ❤️
                        </p>
                      </div>
                    </div>

                    {/* App footer CTA */}
                    <div className="w-full py-2.5 rounded-xl bg-[#0A0A0A] text-white text-[10px] font-bold text-center uppercase tracking-wider">
                      Viết thêm lời chúc
                    </div>

                  </div>
                </div>

                {/* Sparkling detail */}
                <div className="absolute -top-3 -right-3">
                  <Sparkles className="w-6 h-6 text-[#D4AF78]" />
                </div>
              </motion.div>

              <h3 className="mt-8 text-xl font-bold text-stone-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#E8B4A8]" />
                Chạm Để Kết Nối
              </h3>
              <p className="mt-2 text-sm text-stone-500 max-w-xs leading-relaxed">
                Khi lướt chuột xuống, hộp quà sẽ tự động unbox. Chỉ cần một chạm NFC trên điện thoại, toàn bộ hình ảnh và lời chúc ngọt ngào nhất sẽ xuất hiện tức thì.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Floating hints to scroll down */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 text-stone-400">
        <span className="text-xs font-bold tracking-widest uppercase">Cuộn chuột để mở hộp</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-stone-300 flex justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-stone-400" />
        </motion.div>
      </div>
    </div>
  );
}
