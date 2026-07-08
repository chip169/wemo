import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Nfc, Heart, Image, Music } from "lucide-react";

const INTERVALS = [3500, 3000, 5000, 5000]; // Duration for each step in ms

const demoSteps = [
  { icon: Nfc, label: "Bước 1: Chạm điện thoại nhận tín hiệu NFC", color: "#FFD4D4" },
  { icon: Heart, label: "Bước 2: Mở khóa trang trải nghiệm 3D độc bản", color: "#E8B4A8" },
  { icon: Image, label: "Bước 3: Tải ảnh kỷ niệm cùng thông điệp yêu thương", color: "#D4AF78" },
  { icon: Music, label: "Bước 4: Phát nhạc nền và tin nhắn âm thanh xúc động", color: "#FFD4D4" },
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
    "data:image/jpeg;base64,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";
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
