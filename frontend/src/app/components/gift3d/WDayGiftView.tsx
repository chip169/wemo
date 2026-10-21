import { useMemo } from "react";
import { GiftData } from "../../pages/GiftWizard";

interface Props {
  gift?: GiftData;
}

export function WDayGiftView({ gift }: Props) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    if (gift?.recipientName) params.set("recipient", gift.recipientName);
    if (gift?.title) params.set("title", gift.title);
    if (gift?.message) params.set("message", gift.message);
    if (gift?.photos && gift.photos.length > 0) {
      params.set("photos", JSON.stringify(gift.photos));
    }
    const qs = params.toString();
    return "/templates/gift-wday/index.html" + (qs ? `?${qs}` : "");
  }, [gift]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#FFE5EC] select-none">
      <iframe
        src={iframeSrc}
        title="Ngày Yêu Thương & Phái Đẹp 20/10"
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen; accelerometer; gyroscope"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
