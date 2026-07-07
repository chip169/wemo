import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Nfc, Heart, Image, Music } from "lucide-react";

const INTERVALS = [3500, 3000, 5000, 5000]; // Duration for each step in ms

const demoSteps = [
  { icon: Nfc, label: "Bước 1: Chạm điện thoại nhận tín hiệu NFC", color: "#FFD4D4" },
  { icon: Heart, label: "Bước 2: Mở khóa trang trải nghiệm 3D độc bản", color: "#E8B4A8" },
  { icon: Image, label: "Bước 3: Tải ảnh kỷ niệm & thông điệp yêu thương", color: "#D4AF78" },
  { icon: Music, label: "Bước 4: Phát nhạc nền & tin nhắn âm thanh xúc động", color: "#FFD4D4" },
];

export function LiveDemo() {
  const [step, setStep] = useState(0);

  // Auto play sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, INTERVALS[step]);

    return () => clearTimeout(timer);
  }, [step]);

  const handleStepClick = (index: number) => {
    setStep(index);
  };

  // Base image for unboxing demo screen
  const baseImg =
    "https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_h%C3%ACnh_%E1%BA%A3nh_1_s%E1%BA%A3n_202606011509.jpeg";
  const optimizedImg = `${baseImg}?w=600&auto=format,compress&q=90`;

  return (
    <section className="relative py-24 overflow-hidden webo-animated-gradient">
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#E8B4A8]/15 to-[#D4AF78]/15 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="mb-4 font-bold text-[#1A1818]"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.2,
              }}
            >
              Xem Phép Màu Trong Thực Tế
            </h2>
            <p
              className="mb-8 text-stone-600 text-sm sm:text-base leading-relaxed"
            >
              Xem cách một cú chạm đơn giản biến thành hành trình cảm xúc khó quên.
              Người nhận sẽ bị ấn tượng bởi trải nghiệm mượt mà và tuyệt đẹp.
            </p>

            {/* Demo steps list */}
            <div className="space-y-4">
              {demoSteps.map((demoStep, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleStepClick(index)}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border"
                  style={{
                    background: step === index ? 'rgba(255, 255, 255, 0.45)' : 'transparent',
                    backdropFilter: step === index ? 'blur(10px)' : 'none',
                    borderColor: step === index ? 'rgba(255,255,255,0.4)' : 'transparent',
                    boxShadow: step === index ? '0 10px 30px -10px rgba(232, 180, 168, 0.2)' : 'none',
                  }}
                >
                  {/* Icon container */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: demoStep.color,
                      boxShadow: step === index ? `0 8px 20px ${demoStep.color}60` : 'none',
                    }}
                  >
                    <demoStep.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Step Info & Progress bar */}
                  <div className="flex-1 flex flex-col">
                    <span 
                      className="font-bold text-sm sm:text-base"
                      style={{
                        color: step === index ? '#1A1818' : '#6B6B6B',
                      }}
                    >
                      {demoStep.label}
                    </span>
                    {step === index && (
                      <div className="w-full h-1 bg-stone-200/50 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          key={step}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: INTERVALS[step] / 1000, ease: "linear" }}
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #E8B4A8 0%, #D4AF78 100%)' }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Phone frame */}
            <div className="relative mx-auto w-full max-w-sm">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative rounded-[3rem] overflow-hidden shadow-2xl webo-glow border-4 border-stone-800"
                style={{
                  background: '#1A1818',
                  padding: '1rem',
                  aspectRatio: '9/19.5',
                }}
              >
                {/* Phone screen */}
                <div 
                  className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-[#FFF0EC]"
                >
                  {/* Animated content based on step */}
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                  >
                    {step === 0 && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-24 h-24 rounded-full mb-6"
                          style={{
                            background: 'rgba(232, 180, 168, 0.2)',
                            border: '3px solid #E8B4A8',
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Nfc className="w-12 h-12" style={{ color: '#E8B4A8' }} />
                          </div>
                        </motion.div>
                        <p className="font-bold text-[#1A1818] text-base leading-snug">
                          Chạm hộp gỗ NFC để kích hoạt bất ngờ
                        </p>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)',
                          }}
                        >
                          <Heart className="w-12 h-12 text-white" />
                        </motion.div>
                        <p className="font-bold text-[#1A1818] text-base leading-snug">
                          Đang chuẩn bị hành trình ký ức...
                        </p>
                      </>
                    )}

                    {step === 2 && (
                      <div className="w-full space-y-4 text-left">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full h-36 rounded-2xl overflow-hidden"
                        >
                          <img
                            src={optimizedImg}
                            alt="Memory"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="px-1"
                        >
                          <h3 className="font-black text-lg mb-1 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] bg-clip-text text-transparent">
                            Kỷ Niệm Yêu Thương ❤️
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            Mỗi bức ảnh, mỗi thước phim lưu lại những nụ cười và hành trình ấm áp của chúng mình...
                          </p>
                        </motion.div>
                      </div>
                    )}

                    {step === 3 && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #FFD4D4 0%, #E8B4A8 100%)',
                          }}
                        >
                          <Music className="w-12 h-12 text-white" />
                        </motion.div>
                        <p className="font-bold text-[#1A1818] text-base mb-3 leading-snug">
                          Phát lời chúc thoại cá nhân hóa
                        </p>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-stone-200/50">
                          <motion.div
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #E8B4A8 0%, #D4AF78 100%)' }}
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full pointer-events-none"
                  style={{
                    background: i % 2 === 0 ? '#FFD4D4' : '#E8B4A8',
                    top: `${20 + Math.random() * 60}%`,
                    left: `${i < 3 ? -10 : 110}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: i < 3 ? [0, 20, 0] : [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
