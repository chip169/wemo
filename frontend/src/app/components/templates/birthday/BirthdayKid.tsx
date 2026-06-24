import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Camera,
  Music,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
} from "lucide-react";

type TemplateProps = {
  recipientName: string;
  title: string;
  message: string;
  photos: string[]; // Hỗ trợ mảng nhiều ảnh cho phần Album
  eventDate?: string; // "2027-05-20T11:45:00"
  locationName?: string;
  locationAddress?: string;
  poemLines?: string[];
  isEditing?: boolean;
  onUpdate?: (fields: {
    title?: string;
    recipientName?: string;
    message?: string;
    photos?: string[];
    eventDate?: string;
    locationName?: string;
    locationAddress?: string;
    poemLines?: string[];
  }) => void;
};

export default function BirthdayKid({
  recipientName,
  title,
  message,
  photos = [],
  eventDate = "2027-05-20T11:45:00",
  locationName = "Khách sạn Thanh Hải",
  locationAddress = "Tại Sảnh lớn Orchid",
  poemLines = [
    "Tuổi thơ là những năm tháng hạnh phúc,",
    "Tuổi thơ là thời gian vui vẻ,",
    "Tuổi thơ là những kỷ niệm tuyệt vời,",
    "Tuổi thơ là niềm mong ước vĩnh cửu.",
    "Chúc con giữ mãi trái tim ngây thơ,",
    "Dancing with the steps of birthday.",
  ],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  // --- STATE CHO BỘ ĐẾM NGƯỢC (COUNTDOWN) ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const target = new Date(eventDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  // --- MOCK HÀM ĐỔI ẢNH ---
  const handlePhotoUpdate = (index: number) => {
    if (!isEditing || !onUpdate) return;
    const newPhotos = [...photos];
    const pool = [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80",
      "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=600&q=80",
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80",
      "https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=600&q=80",
      "https://images.unsplash.com/photo-1464349172961-10442b37710e?w=600&q=80",
    ];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] ||
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    photos[1] ||
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80",
    photos[2] ||
      "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=600&q=80",
    photos[3] ||
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80",
    photos[4] ||
      "https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=600&q=80",
    photos[5] ||
      "https://images.unsplash.com/photo-1464349172961-10442b37710e?w=600&q=80",
  ];

  return (
    <div className="w-full select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&display=swap');
        .font-sans-card { font-family: 'Quicksand', sans-serif; }
        .font-serif-elegant { font-family: 'Playfair Display', serif; }
        .card-bg-texture {
          background-color: #FBEAEB;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cpath d='M10 10 H 90 V 90 H 10 Z' fill='none' stroke='%23dfb1b6' stroke-width='0.25' stroke-dasharray='2 6'/%3E%3C/svg%3E");
        }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
      `}</style>

      <div className="w-full card-bg-texture overflow-hidden rounded-3xl shadow-2xl relative font-sans-card text-stone-800">
        {/* ĐĨA NHẠC XOAY */}
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 bg-black rounded-full border border-white/80 shadow-lg flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "8s" }}
          >
            <Music className="w-4 h-4 text-pink-200" />
          </button>
        </div>

        {/* ================= SECTION 1: COVER ================= */}
        <section className="relative p-6 pb-4 flex flex-col items-center">
          <div className="w-12 h-3 border-t-4 border-pink-300 rounded-full opacity-60 mb-3" />

          <div
            className="w-[85%] aspect-[4/5] border border-pink-300 rounded-t-full p-2 bg-white/40 backdrop-blur-sm relative cursor-pointer group"
            onClick={() => handlePhotoUpdate(0)}
          >
            <div className="w-full h-full rounded-t-full overflow-hidden relative bg-stone-100">
              <img
                src={activePhotos[0]}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-[-14px_14px_0_0_rgba(255,255,255,0.75)] pointer-events-none" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-white/90 rounded-2xl p-5 mt-4 text-center shadow-sm border border-white/60 space-y-3 z-10">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdate?.({ title: e.target.value })}
                className="w-full text-center text-lg font-serif-elegant tracking-widest text-stone-700 bg-pink-50/50 border-b border-dashed border-pink-300 focus:outline-none uppercase"
              />
            ) : (
              <h2 className="font-serif-elegant text-xl tracking-[0.2em] text-gray-700 uppercase">
                {title || "Tiệc Sinh Nhật"}
              </h2>
            )}

            <div className="text-3xl font-serif-elegant font-bold text-neutral-600 flex items-center justify-center gap-1">
              12 <span className="text-sm align-super">TH</span>
            </div>

            {isEditing ? (
              <textarea
                value={message}
                onChange={(e) => onUpdate?.({ message: e.target.value })}
                className="w-full text-center text-xs text-stone-500 bg-pink-50/50 border border-dashed border-pink-300 rounded p-1 focus:outline-none h-12 resize-none"
              />
            ) : (
              <p className="text-[11px] text-gray-500 max-w-[90%] mx-auto leading-relaxed">
                {message ||
                  "Trân trọng mời bạn đến tham dự tiệc sinh nhật lần thứ 12 của mình!"}
              </p>
            )}

            <div className="text-xs text-amber-900 font-medium space-y-1 py-2 border-y border-pink-100/80">
              <p className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-pink-400" /> Ngày 20 tháng 05 năm
                2027
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => onUpdate?.({ locationName: e.target.value })}
                  className="w-4/5 text-center text-[11px] text-stone-500 bg-pink-50/50 focus:outline-none"
                />
              ) : (
                <p className="text-gray-500 text-[11px]">Tại {locationName}</p>
              )}
            </div>

            <div className="flex flex-col items-center pt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) =>
                    onUpdate?.({ recipientName: e.target.value })
                  }
                  className="text-center font-serif-elegant text-xl font-semibold text-gray-800 bg-pink-50/50 border-b border-pink-400 focus:outline-none"
                />
              ) : (
                <h3 className="font-serif-elegant text-xl font-semibold text-gray-800 tracking-wide">
                  {recipientName || "Nguyễn Hải Anh"}
                </h3>
              )}
              <p className="text-[9px] text-gray-400 tracking-widest pt-1 uppercase">
                Trân trọng kính mời bạn đến tham dự
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: COUNTDOWN & CALENDAR ================= */}
        <section className="p-6 pt-2 flex flex-col items-center space-y-4">
          <div
            className="w-full aspect-[4/3] bg-white p-1.5 shadow-sm rounded-xl cursor-pointer group relative overflow-hidden"
            onClick={() => handlePhotoUpdate(1)}
          >
            <img
              src={activePhotos[1]}
              alt="Decor 1"
              className="w-full h-full object-cover rounded"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="w-full bg-white/90 rounded-2xl p-5 text-center shadow-sm border border-white/60 space-y-4">
            <span className="text-xs font-serif-elegant text-stone-400 tracking-widest block">
              // Thời gian buổi tiệc //
            </span>

            {/* Countdown widget */}
            <div className="flex justify-center gap-2 text-white">
              <div className="bg-stone-900 px-2.5 py-1.5 rounded-lg text-center min-w-[52px]">
                <div className="text-sm font-bold font-mono">
                  {timeLeft.days}
                </div>
                <div className="text-[8px] text-stone-400">ngày</div>
              </div>
              <div className="bg-stone-900 px-2.5 py-1.5 rounded-lg text-center min-w-[52px]">
                <div className="text-sm font-bold font-mono">
                  {timeLeft.hours}
                </div>
                <div className="text-[8px] text-stone-400">giờ</div>
              </div>
              <div className="bg-stone-900 px-2.5 py-1.5 rounded-lg text-center min-w-[52px]">
                <div className="text-sm font-bold font-mono">
                  {timeLeft.minutes}
                </div>
                <div className="text-[8px] text-stone-400">phút</div>
              </div>
              <div className="bg-stone-900 px-2.5 py-1.5 rounded-lg text-center min-w-[52px]">
                <div className="text-sm font-bold font-mono">
                  {timeLeft.seconds}
                </div>
                <div className="text-[8px] text-stone-400">giây</div>
              </div>
            </div>

            {/* Calendar widget */}
            <div className="border border-stone-200 rounded-xl overflow-hidden max-w-[230px] mx-auto bg-white shadow-inner">
              <div className="bg-stone-900 text-white py-1 font-bold text-[10px] tracking-wider">
                5.2027
              </div>
              <div className="grid grid-cols-7 text-[9px] p-2 gap-y-1 text-stone-500 font-mono">
                <span className="font-bold text-stone-400">M</span>
                <span className="font-bold text-stone-400">T</span>
                <span className="font-bold text-stone-400">W</span>
                <span className="font-bold text-stone-400">T</span>
                <span className="font-bold text-stone-400">F</span>
                <span className="font-bold text-stone-400">S</span>
                <span className="font-bold text-stone-400">S</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span className="text-gray-300">1</span>
                <span className="text-gray-300">2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span className="relative flex items-center justify-center text-red-600 font-bold">
                  20
                  <span className="absolute text-red-500/20 text-sm scale-150">
                    ❤️
                  </span>
                </span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 space-y-0.5 pt-1 border-t border-stone-100">
              <p className="font-semibold flex items-center justify-center gap-1 text-stone-700">
                <CalendarIcon className="w-3 h-3 text-pink-400" /> Thứ Năm, 20
                Tháng 5, 2027
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) =>
                    onUpdate?.({ locationAddress: e.target.value })
                  }
                  className="w-full text-center text-[10px] text-stone-400 bg-pink-50/50 focus:outline-none"
                />
              ) : (
                <p className="text-stone-400 text-[10px] flex items-center justify-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {locationAddress}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: ALBUM GALLERY ================= */}
        <section className="p-6 pt-2 space-y-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div
              className="w-2/3 bg-white p-1.5 shadow-sm rounded-lg transform -rotate-1 cursor-pointer group relative"
              onClick={() => handlePhotoUpdate(2)}
            >
              <img
                src={activePhotos[2]}
                alt="Album 1"
                className="w-full h-auto object-cover rounded-sm"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="vertical-text text-[9px] tracking-[0.3em] text-stone-400 font-serif-elegant pt-4 uppercase">
              Một ngày đặc biệt, Một lời chúc đặc biệt
            </div>
          </div>

          <div className="relative flex flex-col items-end w-full pr-4">
            <div
              className="w-[55%] bg-white p-1 shadow-md rounded-lg z-10 transform rotate-2 cursor-pointer group relative"
              onClick={() => handlePhotoUpdate(3)}
            >
              <img
                src={activePhotos[3]}
                alt="Album 2"
                className="w-full h-auto rounded-sm"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="w-full flex justify-start items-center -mt-8">
              <div className="text-center w-[60%]">
                <span className="text-[9px] tracking-[0.4em] text-stone-400 font-serif-elegant block mb-1 uppercase">
                  Em Bé Dễ Thương
                </span>
                <div
                  className="bg-white p-1 shadow-md rounded-lg transform -rotate-2 cursor-pointer group relative"
                  onClick={() => handlePhotoUpdate(4)}
                >
                  <img
                    src={activePhotos[4]}
                    alt="Album 3"
                    className="w-full h-auto rounded-sm"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute right-4 top-24 w-4 h-4 bg-pink-300 rounded-full opacity-40 pointer-events-none" />
          </div>
        </section>

        {/* ================= SECTION 4: POEM & FOOTER ================= */}
        <section className="p-6 pt-2 pb-12 space-y-6">
          <div className="w-full bg-white/95 rounded-2xl p-5 text-center shadow-sm border border-white/60">
            <div className="text-[11px] text-stone-600 font-medium leading-loose space-y-1 italic">
              {isEditing ? (
                <textarea
                  value={poemLines.join("\n")}
                  onChange={(e) =>
                    onUpdate?.({ poemLines: e.target.value.split("\n") })
                  }
                  className="w-full h-32 text-center text-xs p-2 bg-pink-50/50 border border-dashed border-pink-200 rounded focus:outline-none font-mono"
                  placeholder="Mỗi hàng tương đương một câu thơ..."
                />
              ) : (
                poemLines.map((line, idx) => <p key={idx}>"{line}"</p>)
              )}
              <div className="text-xs font-semibold font-serif-elegant text-stone-800 not-italic pt-3 border-t border-pink-100 mt-2">
                Cô gái của tôi, chúc mừng sinh nhật 12 tuổi.
              </div>
            </div>
          </div>

          <div
            className="w-full bg-white p-1.5 shadow-md rounded-xl transform rotate-1 cursor-pointer group relative"
            onClick={() => handlePhotoUpdate(5)}
          >
            <img
              src={activePhotos[5]}
              alt="Footer"
              className="w-full h-auto object-cover rounded"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <p className="text-center text-[9px] text-stone-400 tracking-widest uppercase pt-2">
            © Thiết kế bằng cả trái tim
          </p>
        </section>
      </div>
    </div>
  );
}
