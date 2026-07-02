/**
 * SolidHeartDemoPage.tsx
 * Standalone demo page to view the new SolidHeartCanvas3D template.
 * URL: http://localhost:5173/demo-thiep-3d
 */
import { SolidHeartCanvas3D } from "../components/gift3d/SolidHeartCanvas3D";

const DEMO_GIFT = {
  recipientName: "Khánh Ly",
  senderName: "Kim Xuân Hiếu",
  title: "Happy Anniversary 🥂",
  message:
    "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Mỗi khoảnh khắc bên em đều là một kỷ niệm đáng nhớ mà anh sẽ giữ mãi trong tim. Cảm ơn em vì đã luôn ở bên anh, cảm ơn nụ cười của em mỗi sáng thức dậy, cảm ơn em vì đã là em. Anh yêu em rất nhiều! 💖",
  photos: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
  ],
  theme: "tinh-yeu",
  templateId: "solid-heart",
  music: "romantic",
};

export function SolidHeartDemoPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <SolidHeartCanvas3D gift={DEMO_GIFT} />
    </div>
  );
}
