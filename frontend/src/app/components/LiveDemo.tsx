import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Nfc, Heart, Image, Music, Sparkles } from "lucide-react";

export function LiveDemo() {
  const [step, setStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Auto transition demo steps
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const demoSteps = [
    { icon: Nfc, label: "Đang quét NFC...", color: "#E8B4A8", desc: "Đưa điện thoại lại gần thẻ NFC ẩn trên mô hình Figure Chibi." },
    { icon: Heart, label: "Đang tải trải nghiệm...", color: "#D4AF78", desc: "Hệ thống tự động kích hoạt trang thiệp điện tử trong 2 giây." },
    { icon: Image, label: "Hiển thị ký ức...", color: "#E8B4A8", desc: "Mở ra những album ảnh kỷ niệm, video và những câu chuyện ngọt ngào." },
    { icon: Music, label: "Đang phát tin nhắn...", color: "#D4AF78", desc: "Nhạc nền cất lên cùng với tin nhắn thoại ghi âm đầy bất ngờ." },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 12);
    setRotateY((x - xc) / 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="relative py-24 md:py-32 bg-[#0A0A0A] overflow-hidden text-white">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(232,180,168,0.05),transparent_70%)] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left side - Text & Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h2 
              className="mb-4 font-black tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              }}
            >
              Xem Phép Màu <br />
              Trong Thực Tế
            </h2>
            <p className="mb-12 text-stone-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Xem cách một cú chạm đơn giản biến thành hành trình cảm xúc khó quên. Người nhận sẽ bị ấn tượng sâu sắc bởi trải nghiệm mượt mà và tuyệt đẹp.
            </p>

            {/* Demo steps list */}
            <div className="space-y-4 max-w-md">
              {demoSteps.map((demoStep, index) => {
                const isActive = step === index;
                return (
                  <div
                    key={index}
                    onClick={() => setStep(index)}
                    className="flex gap-4 p-4.5 rounded-2xl cursor-pointer transition-all duration-350 border"
                    style={{
                      background: isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                      borderColor: isActive ? 'rgba(232, 180, 168, 0.25)' : 'transparent',
                    }}
                  >
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-350"
                      style={{
                        background: isActive ? demoStep.color : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <demoStep.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-stone-400'}`} />
                    </div>
                    <div>
                      <span 
                        className="font-bold text-sm block transition-all"
                        style={{ color: isActive ? '#FFFFFF' : '#8E8E93' }}
                      >
                        {demoStep.label}
                      </span>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-stone-400 text-xs mt-1.5 leading-relaxed"
                        >
                          {demoStep.desc}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - 3D Phone Mockup (take 6 cols) */}
          <div className="lg:col-span-6 flex justify-center items-center h-[520px]">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="webo-3d-scene w-full max-w-sm flex items-center justify-center select-none"
            >
              <div
                className="webo-3d-card relative w-[265px] aspect-[9/18.5] bg-[#161618] rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-4 border-stone-800"
                style={{
                  transform: `perspective(800px) rotateY(${rotateY - 15}deg) rotateX(${rotateX}deg)`,
                  transition: "transform 0.1s ease-out"
                }}
              >
                {/* Dynamic Screen */}
                <div className="w-full h-full bg-[#FAF8F5] rounded-[34px] overflow-hidden flex flex-col relative text-stone-800">
                  
                  {/* Phone Notch/Dynamic Island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30" />

                  {/* App Screen Content based on current auto/manual step */}
                  <div className="w-full h-full pt-8 p-4 flex flex-col items-center justify-between">
                    
                    {/* Header */}
                    <div className="w-full flex items-center justify-between text-[9px] font-bold text-stone-400 tracking-wider">
                      <span>WEMO READER</span>
                      <span>100% ✓</span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center py-4">
                      {step === 0 && (
                        <div className="text-center flex flex-col items-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-16 h-16 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/40 flex items-center justify-center mb-4"
                          >
                            <Nfc className="w-8 h-8 text-[#E8B4A8]" />
                          </motion.div>
                          <h4 className="font-bold text-sm text-stone-900 mb-1">Chạm NFC Để Mở</h4>
                          <p className="text-[10px] text-stone-500 max-w-[160px] leading-relaxed">Đang quét thẻ từ bên dưới chân mô hình Figure của bạn.</p>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="text-center flex flex-col items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center mb-4"
                          >
                            <Heart className="w-7 h-7 text-white" />
                          </motion.div>
                          <h4 className="font-bold text-sm text-stone-900 mb-1">Đang Kết Nối...</h4>
                          <p className="text-[10px] text-stone-500 max-w-[160px] leading-relaxed">Đang tải những kỷ niệm ngọt ngào nhất được chuẩn bị riêng.</p>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="w-full space-y-3">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=300"
                              alt="Romantic Memory"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                          >
                            <h4 className="font-serif italic text-sm font-bold text-stone-900 leading-tight">Món Quà Vĩnh Hằng</h4>
                            <p className="text-[9px] text-stone-500 mt-1 leading-normal">Lưu giữ trọn vẹn những album ảnh kỷ niệm theo năm tháng.</p>
                          </motion.div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="text-center flex flex-col items-center w-full">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-14 h-14 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/40 flex items-center justify-center mb-4"
                          >
                            <Music className="w-7 h-7 text-[#E8B4A8]" />
                          </motion.div>
                          <h4 className="font-bold text-sm text-stone-900 mb-1">Đang Phát Lời Chúc</h4>
                          <p className="text-[10px] text-stone-500 mb-3 leading-relaxed">Giọng nói ấm áp cất lên kèm nhạc nền lãng mạn.</p>
                          
                          {/* Audio visualizer bar */}
                          <div className="w-full h-1.5 rounded-full bg-stone-150 overflow-hidden relative">
                            <motion.div
                              animate={{ width: ['0%', '100%'] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="h-full bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* App footer CTA */}
                    <div className="w-full py-2 rounded-xl bg-stone-900 text-white text-[9px] font-bold text-center uppercase tracking-widest flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF78]" />
                      Trải nghiệm ngay
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
