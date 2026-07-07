import { motion } from "motion/react";
import { useState } from "react";
import { Nfc, Heart, Image, Music } from "lucide-react";

export function LiveDemo() {
  const [step, setStep] = useState(0);

  const demoSteps = [
    { icon: Nfc, label: "Đang quét NFC...", color: "#FFD4D4" },
    { icon: Heart, label: "Đang tải trải nghiệm...", color: "#E8B4A8" },
    { icon: Image, label: "Hiển thị ký ức...", color: "#D4AF78" },
    { icon: Music, label: "Đang phát tin nhắn...", color: "#FFD4D4" },
  ];

  return (
    <section className="relative py-24 overflow-hidden webo-animated-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="mb-4"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                color: '#1A1818',
              }}
            >
              Xem Phép Màu Trong Thực Tế
            </h2>
            <p
              className="mb-8"
              style={{
                fontSize: '1.125rem',
                color: '#6B6B6B',
                lineHeight: 1.6,
              }}
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
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: step === index ? 'var(--webo-glass-white)' : 'transparent',
                    backdropFilter: step === index ? 'blur(10px)' : 'none',
                    border: step === index ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: demoStep.color,
                      boxShadow: step === index ? `0 8px 20px ${demoStep.color}60` : 'none',
                    }}
                  >
                    <demoStep.icon className="w-6 h-6 text-white" />
                  </div>
                  <span 
                    className="font-semibold"
                    style={{
                      color: step === index ? '#1A1818' : '#6B6B6B',
                    }}
                  >
                    {demoStep.label}
                  </span>
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
                className="relative rounded-[3rem] overflow-hidden shadow-2xl webo-glow"
                style={{
                  background: '#1A1818',
                  padding: '1rem',
                  aspectRatio: '9/19.5',
                }}
              >
                {/* Phone screen */}
                <div 
                  className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                  style={{ background: 'white' }}
                >
                  {/* Animated content based on step */}
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full h-full flex flex-col items-center justify-center p-6"
                    style={{
                      background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EDE4 100%)',
                    }}
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
                        <p className="text-center font-semibold" style={{ color: '#1A1818' }}>
                          Chạm để mở khóa món quà
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
                        <p className="text-center font-semibold" style={{ color: '#1A1818' }}>
                          Đang chuẩn bị ký ức của bạn...
                        </p>
                      </>
                    )}

                    {step === 2 && (
                      <div className="w-full space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full h-32 rounded-2xl overflow-hidden"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1706200637521-b446bd05df0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbW90aW9uYWwlMjBmYW1pbHklMjBtb21lbnQlMjBtZW1vcmllc3xlbnwxfHx8fDE3Nzk2MTE4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Memory"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="font-bold mb-2" style={{ color: '#E8B4A8' }}>
                            Chúc Mừng Sinh Nhật! 🎉
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                            Chúc mừng tất cả những ký ức tuyệt vời chúng ta đã chia sẻ...
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
                        <p className="text-center font-semibold mb-4" style={{ color: '#1A1818' }}>
                          Tin nhắn đặc biệt của bạn
                        </p>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F5EDE4' }}>
                          <motion.div
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
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
                  className="absolute w-4 h-4 rounded-full"
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
