import { useMemo } from "react";
import { GiftData } from "../../pages/GiftWizard";

interface Props {
  gift?: GiftData;
}

export function HeartImageGiftView({ gift }: Props) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    if (gift?.recipientName) params.set("recipient", gift.recipientName);
    if (gift?.message) params.set("message", gift.message);
    if (gift?.photos && gift.photos.length > 0) {
      params.set("photos", JSON.stringify(gift.photos));
    }
    const qs = params.toString();
    return "/templates/heart-image/index.html" + (qs ? `?${qs}` : "");
  }, [gift]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      <iframe
        src={iframeSrc}
        title="Trái Tim Ảnh 3D"
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
