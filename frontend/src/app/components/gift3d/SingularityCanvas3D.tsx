import { useMemo } from "react";
import { GiftData } from "../../pages/GiftWizard";

interface Props {
  gift?: GiftData;
}

export function SingularityCanvas3D({ gift }: Props) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    if (gift?.recipientName) params.set("recipient", gift.recipientName);
    if (gift?.title) params.set("title", gift.title);
    if (gift?.message) params.set("message", gift.message);
    const qs = params.toString();
    return "/templates/singularity/index.html" + (qs ? `?${qs}` : "");
  }, [gift]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#010103] select-none">
      <iframe
        src={iframeSrc}
        title="The Life of a Singularity"
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
