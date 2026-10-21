import { useMemo } from "react";
import { GiftData } from "../../pages/GiftWizard";

interface Props {
  gift?: GiftData;
}

export function LoveCountGiftView({ gift }: Props) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    if (gift?.senderName) params.set("boy", gift.senderName);
    if (gift?.recipientName) params.set("girl", gift.recipientName);
    if (gift?.photos && gift.photos.length > 0) {
      params.set("photos", JSON.stringify(gift.photos));
    }
    const qs = params.toString();
    return "/templates/love-count/index.html" + (qs ? `?${qs}` : "");
  }, [gift]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#ff92ad] select-none">
      <iframe
        src={iframeSrc}
        title="Đếm ngày yêu"
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
