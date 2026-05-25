import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 webo-animated-gradient" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#E8B4A8' : i % 3 === 1 ? '#FFD4D4' : '#D4AF78',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ 
                background: 'var(--webo-glass-white)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#E8B4A8' }} />
              <span className="text-sm font-medium" style={{ color: '#1A1818' }}>
                Tương Lai Của Món Quà Cảm Xúc
              </span>
            </motion.div>

            <h1 
              className="mb-6 leading-tight"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 700,
                color: '#1A1818',
              }}
            >
              Biến Mỗi Món Quà Thành{' '}
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ký Ức Số
              </span>
            </h1>

            <p 
              className="mb-8 max-w-2xl mx-auto lg:mx-0"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#4A4A4A',
              }}
            >
              WEBO sử dụng công nghệ NFC và trải nghiệm web động để tạo ra những món quà cảm xúc cá nhân hóa với ảnh, video, tin nhắn giọng nói và các mẫu tương tác.
            </p>


            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              {[
                { value: '50K+', label: 'Ký Ức Được Tạo' },
                { value: '4.9★', label: 'Đánh Giá' },
                { value: '95%', label: 'Hài Lòng' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div 
                    className="font-bold mb-1"
                    style={{ fontSize: '1.5rem', color: '#E8B4A8' }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - 3D Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main gift box mockup */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 rounded-3xl overflow-hidden shadow-2xl webo-glow"
              style={{
                background: 'var(--webo-glass-white)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1759563871371-eb0ec31824a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm94JTIwZWxlZ2FudCUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3Nzk2MTE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Luxury NFC Gift Box"
                className="w-full h-auto rounded-3xl"
              />
            </motion.div>

            {/* Floating template cards */}
            {[
              {
                title: 'Sinh Nhật',
                color: '#FFD4D4',
                img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
                position: { top: '10%', right: '-10%' }
              },
              {
                title: 'Lãng Mạn',
                color: '#E8B4A8',
                img: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400',
                position: { top: '50%', right: '-15%' }
              },
              {
                title: 'Giáng Sinh',
                color: '#D4AF78',
                img: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400',
                position: { bottom: '10%', right: '-10%' }
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -15, 0],
                }}
                transition={{ 
                  opacity: { delay: 0.5 + i * 0.2 },
                  y: { 
                    duration: 3 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }
                }}
                className="absolute hidden lg:block w-32 h-40 rounded-2xl overflow-hidden shadow-xl"
                style={{
                  ...card.position,
                  background: 'var(--webo-glass-white)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <img 
                  src={card.img} 
                  alt={card.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 text-center">
                  <div 
                    className="text-xs font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Smartphone scanning NFC */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-10 bottom-10 hidden md:block w-48 h-auto rounded-3xl shadow-2xl overflow-hidden"
              style={{
                background: 'var(--webo-glass-white)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbmZjJTIwcGF5bWVudCUyMGNvbnRhY3RsZXNzfGVufDF8fHx8MTc3OTYxMTgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="NFC Scanning"
                className="w-full h-auto"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                style={{
                  background: 'rgba(232, 180, 168, 0.3)',
                  border: '2px solid #E8B4A8',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
