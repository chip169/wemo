import React, { Suspense, lazy, useState } from "react";
import { WalkingBot3D, WalkingBot3DProps } from "./WalkingBot3D";

// Lazy load Spline to keep initial bundle size fast & light
const Spline = lazy(() => import("@splinetool/react-spline"));

export interface SplineBot3DProps extends WalkingBot3DProps {
  /**
   * Optional public Spline scene URL exported from https://spline.design
   * e.g. "https://prod.spline.design/your-scene-id/scene.splinecode"
   */
  splineSceneUrl?: string;
}

/**
 * SplineBot3D:
 * Renders interactive Spline 3D scenes with full animation & physics,
 * seamlessly falling back to the native high-gloss Three.js Pink LEGO Butler
 * if no URL is provided or while loading.
 */
export function SplineBot3D({
  splineSceneUrl,
  onOpenChat,
  className = "",
}: SplineBot3DProps) {
  const [hasError, setHasError] = useState(false);

  if (splineSceneUrl && !hasError) {
    return (
      <div className={`fixed bottom-3 right-3 z-50 select-none ${className}`}>
        <div
          onClick={onOpenChat}
          className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ width: 140, height: 165 }}
          title="Nhấn để trò chuyện cùng Quản Gia WEMO 🎩✨"
        >
          <Suspense fallback={<WalkingBot3D onOpenChat={onOpenChat} />}>
            <Spline
              scene={splineSceneUrl}
              onError={() => setHasError(true)}
              style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
            />
          </Suspense>
          {/* Online green indicator dot */}
          <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse pointer-events-none" />
        </div>
      </div>
    );
  }

  // Native Three.js LEGO Butler
  return <WalkingBot3D onOpenChat={onOpenChat} className={className} />;
}

export default SplineBot3D;
