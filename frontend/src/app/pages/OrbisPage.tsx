import { Mail, Twitter, Github, ChevronRight } from "lucide-react";

export function OrbisPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#010828] text-[#EFF4FF] overflow-x-hidden">
      {/* 1. CSS Styles for Liquid Glass & Texture Overlay */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .font-grotesk {
          font-family: 'Anton', sans-serif;
        }
        .font-condiment {
          font-family: 'Condiment', cursive;
        }
        .liquid-glass {
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
            rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
            rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .texture-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          pointer-events: none;
          mix-blend-mode: lighten;
          opacity: 0.6;
          background-image: url('/texture.png'), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.45'/%3E%3C/svg%3E");
          background-size: cover;
        }
        `
      }} />

      {/* Full screen fixed texture overlay */}
      <div className="texture-overlay" />

      {/* SECTION 1: HERO (Full viewport) */}
      <section className="relative w-full h-screen overflow-hidden rounded-b-[32px]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4" type="video/mp4" />
        </video>

        {/* Video Dark Overlay to enhance text readability */}
        <div className="absolute inset-0 bg-black/25 z-0" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1831px] mx-auto px-4 sm:px-8 h-full flex flex-col justify-between py-6 sm:py-8">
          {/* Header */}
          <header className="w-full flex items-center justify-between">
            {/* Logo */}
            <div className="font-grotesk text-base tracking-wider text-[#EFF4FF] uppercase z-20">
              Orbis.Nft
            </div>

            {/* Navigation Bar */}
            <nav className="liquid-glass rounded-[28px] px-8 sm:px-[52px] py-4 sm:py-[24px] hidden lg:flex items-center gap-8 z-20">
              {["Homepage", "Gallery", "Buy NFT", "FAQ", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-grotesk text-[13px] text-[#EFF4FF] hover:text-[#6FFF00] transition-colors uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Placeholder to balance logo */}
            <div className="w-[80px] lg:block hidden" />
          </header>

          {/* Social Icons Stack (Desktop) */}
          <div className="absolute top-24 right-8 hidden lg:flex flex-col gap-3 z-20">
            {[Mail, Twitter, Github].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center text-[#EFF4FF] hover:bg-white/10 transition-all hover:scale-105"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Main Hero Content */}
          <div className="my-auto lg:ml-32 relative max-w-[780px] z-10 mt-24 sm:mt-32">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] text-[#EFF4FF] uppercase leading-[1.05] md:leading-[1] tracking-tight relative">
              Beyond earth <br className="hidden sm:inline" />
              and ( its ) familiar boundaries
              
              {/* Overlaid Cursive Accent */}
              <span 
                className="font-condiment text-[24px] sm:text-[36px] md:text-[44px] lg:text-[48px] text-[#6FFF00] absolute right-[-20px] bottom-[-20px] sm:bottom-[-10px] -rotate-1 opacity-90 mix-blend-exclusion select-none whitespace-nowrap"
              >
                Nft collection
              </span>
            </h1>
          </div>

          {/* Social Icons (Mobile) */}
          <div className="flex lg:hidden justify-center gap-4 pb-6 z-20">
            {[Mail, Twitter, Github].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center text-[#EFF4FF] hover:bg-white/10 transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT / INTRO (Full viewport) */}
      <section className="relative w-full h-screen overflow-hidden mt-6 rounded-[32px]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4" type="video/mp4" />
        </video>

        {/* Muted overlay for readability */}
        <div className="absolute inset-0 bg-black/15 z-0" />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1831px] mx-auto px-4 sm:px-8 h-full flex flex-col justify-between py-16 sm:py-24">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 w-full mt-8">
            {/* Left Column - Heading */}
            <div className="relative inline-block">
              <h2 className="font-grotesk text-[32px] sm:text-[45px] md:text-[52px] lg:text-[60px] text-[#EFF4FF] uppercase leading-[1] tracking-wide pr-12">
                Hello! <br />
                I'm orbis
              </h2>
              {/* Overlaid Cursive Accent */}
              <span className="font-condiment text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px] text-[#6FFF00] absolute bottom-[-16px] right-[-10px] sm:right-[-20px] -rotate-1 opacity-90 mix-blend-exclusion select-none whitespace-nowrap">
                Orbis
              </span>
            </div>

            {/* Right Column - Paragraph */}
            <p className="font-mono text-sm sm:text-base text-[#EFF4FF] uppercase max-w-[266px] leading-relaxed tracking-wider">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row justify-between w-full gap-8 mt-12 pb-8">
            {/* Left Column (Monospace Paragraphs) */}
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-16 max-w-2xl">
              <p className="font-mono text-xs sm:text-sm text-[#EFF4FF] lg:text-[#EFF4FF]/10 text-opacity-10 lg:text-opacity-100 uppercase leading-relaxed tracking-wide">
                A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
              </p>
              <p className="font-mono text-xs sm:text-sm text-[#EFF4FF] lg:text-[#EFF4FF]/10 text-opacity-10 lg:text-opacity-100 uppercase leading-relaxed tracking-wide">
                A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
              </p>
            </div>

            {/* Right Column (Monospace Paragraphs - hidden on mobile, dark on mobile) */}
            <div className="hidden lg:flex gap-16 max-w-2xl text-[#EFF4FF]/10">
              <p className="font-mono text-sm uppercase leading-relaxed tracking-wide">
                A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
              </p>
              <p className="font-mono text-sm uppercase leading-relaxed tracking-wide">
                A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NFT COLLECTION GRID */}
      <section className="relative w-full bg-[#010828] py-24 sm:py-32">
        <div className="max-w-[1831px] mx-auto px-4 sm:px-8">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            {/* Left Heading */}
            <div>
              <h2 className="font-grotesk text-[32px] sm:text-[45px] md:text-[52px] lg:text-[60px] text-[#EFF4FF] uppercase leading-[1.05] tracking-wide">
                Collection of <br />
                <span className="inline-block ml-12 sm:ml-24 lg:ml-32">
                  <span className="font-condiment text-[#6FFF00] normal-case mr-4">Space</span>
                  objects
                </span>
              </h2>
            </div>

            {/* Right Button */}
            <button className="flex flex-col self-start sm:self-auto group tracking-tighter">
              <div className="flex items-end gap-2 text-[#EFF4FF]">
                <span className="font-grotesk text-[32px] sm:text-[48px] md:text-[60px] uppercase leading-none">
                  SEE
                </span>
                <div className="flex flex-col text-left font-grotesk text-[20px] sm:text-[28px] md:text-[36px] uppercase leading-[0.8] mb-1">
                  <span>ALL</span>
                  <span>CREATORS</span>
                </div>
              </div>
              {/* Underline Bar */}
              <div className="w-full h-[6px] sm:h-[8px] md:h-[10px] bg-[#6FFF00] mt-1 transition-transform group-hover:scale-x-105 origin-left" />
            </button>
          </div>

          {/* NFT Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4",
                score: "8.7/10"
              },
              {
                src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4",
                score: "9/10"
              },
              {
                src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4",
                score: "8.2/10"
              }
            ].map((card, i) => (
              <div
                key={i}
                className="liquid-glass rounded-[32px] p-[18px] flex flex-col justify-between hover:bg-white/10 transition-colors duration-300"
              >
                {/* Square Video Container */}
                <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden bg-black/40">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={card.src} type="video/mp4" />
                  </video>
                </div>

                {/* Overlay Bar */}
                <div className="liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#EFF4FF]/70 tracking-wider font-mono">
                      RARITY SCORE:
                    </span>
                    <span className="text-[16px] font-grotesk tracking-wide mt-0.5 text-[#EFF4FF]">
                      {card.score}
                    </span>
                  </div>

                  {/* Circular Chevron Button */}
                  <button
                    className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform"
                    aria-label="View Details"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: CTA / FINAL SECTION */}
      <section className="relative w-full bg-[#010828] pb-12 sm:pb-24">
        {/* Full-width Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4" type="video/mp4" />
        </video>

        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
          <div className="relative w-full max-w-[1831px] mx-auto px-4 sm:px-8 flex justify-end">
            <div className="relative pl-[15%] lg:pr-[20%] max-w-[800px] text-right pointer-events-auto">
              {/* Cursive Accent */}
              <span className="font-condiment text-[17px] sm:text-[34px] md:text-[50px] lg:text-[68px] text-[#6FFF00] absolute top-[-25px] sm:top-[-45px] lg:top-[-75px] left-0 lg:left-[-40px] -rotate-2 opacity-95 mix-blend-exclusion select-none whitespace-nowrap">
                Go beyond
              </span>

              {/* Heading */}
              <h2 className="font-grotesk text-[16px] sm:text-[32px] md:text-[45px] lg:text-[60px] text-[#EFF4FF] uppercase leading-[1.05] tracking-wide">
                <div className="mb-4 sm:mb-8 lg:mb-12">JOIN US.</div>
                <div>REVEAL WHAT'S HIDDEN.</div>
                <div>DEFINE WHAT'S NEXT.</div>
                <div>FOLLOW THE SIGNAL.</div>
              </h2>
            </div>
          </div>
        </div>

        {/* Social Icons Stack (Bottom-left) */}
        <div className="absolute left-[8%] bottom-[12%] sm:bottom-[15%] lg:bottom-[20%] z-20">
          <div className="liquid-glass rounded-[0.5rem] sm:rounded-[1.25rem] flex flex-col overflow-hidden">
            {[
              { Icon: Mail, label: "Email" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Github, label: "Github" }
            ].map((item, idx) => (
              <a
                key={idx}
                href="#"
                className={`flex items-center justify-center text-[#EFF4FF] hover:bg-white/10 transition-colors w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[50px] sm:h-[64px] md:h-[56px] lg:h-[72px] ${
                  idx !== 2 ? "border-b border-white/10" : ""
                }`}
              >
                <item.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
