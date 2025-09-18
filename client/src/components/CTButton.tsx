import React, { useRef } from "react";

interface CTButtonProps {
  iconUrl: string;
  cooldown: number;
}

const CTButton: React.FC<CTButtonProps> = ({ iconUrl, cooldown }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCoolingRef = useRef(false);
  const startTimeRef = useRef(0);

  const handleClick = () => {
    if (!isCoolingRef.current) {
      isCoolingRef.current = true;
      startTimeRef.current = performance.now();

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFrame = () => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / cooldown, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 기본 어둠 덮기
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
