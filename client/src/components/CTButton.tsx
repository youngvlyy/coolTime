// src/components/CTButton.tsx
import React, { useRef } from "react";

interface CTButtonProps {
  iconUrl: string;
  cooldown: number;          // 쿨타임(초 단위)
  onClick?: () => void;      // 클릭 시 호출할 함수 (API 호출 등)
}

const CTButton: React.FC<CTButtonProps> = ({ iconUrl, cooldown, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCoolingRef = useRef(false);
  const startTimeRef = useRef(0);

  const handleClick = () => {
    if (!isCoolingRef.current) {
      isCoolingRef.current = true;
      startTimeRef.current = performance.now();

      // 캔버스 쿨타임 시각화
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFrame = () => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / cooldown, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 어둡게 덮기
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        const angle = -Math.PI / 2 + progress * 2 * Math.PI;
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, -Math.PI / 2, true);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fill();

        if (progress < 1) {
          requestAnimationFrame(drawFrame);
        } else {
          isCoolingRef.current = false;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      drawFrame();

      // 클릭 시 전달된 함수 실행 (API 호출 등)
      if (onClick) onClick();
    }
  };

  return (
    <div className="relative w-16 h-16 cursor-pointer" onClick={handleClick}>
      <img src={iconUrl} alt="Skill" className="w-full h-full rounded" />
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        className="absolute top-0 left-0 w-full h-full rounded pointer-events-none"
      />
    </div>
  );
};

export default CTButton;
