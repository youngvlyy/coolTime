import React, { useEffect, useState } from "react";
import type { Food } from "../models/db";
import { FOOD_LIST } from "../models/db";

interface CTButtonProps extends Food {
  onEat: (foodId: string) => void;
  cooldown?: number;
  _id?: string;
}

/**
 * 🍽️ CTButton
 * 음식별로 쿨타임과 먹기 버튼을 관리하는 컴포넌트
 */
const CTButton: React.FC<CTButtonProps> = ({
  onEat,
  lastEaten,
  cooldown,
  _id,
  name
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!lastEaten) {
      setRemainingTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eatenTime = new Date(lastEaten).getTime();
      const safeCooldown = cooldown ?? 0;
      const diffMs = safeCooldown * 24 * 60 * 60 * 1000 - (now - eatenTime);
      setRemainingTime(diffMs > 0 ? diffMs : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastEaten, cooldown]);

  const formatRemaining = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const day = Math.floor(hours/24); 
    const remain = hours>24? `${day}일 남음 `:  `${hours}시간 ${minutes}분 ${seconds}초 남음`
    if (hours + minutes + seconds === 0) return "쿨타임 종료!";
    return remain;
  };

  const handleClick = () => {
    if (remainingTime > 0 || !_id) return;
    onEat(_id);
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius; //원 둘레
  const totalMs = (cooldown ?? 0) * 24 * 60 * 60 * 1000;
  const progress = totalMs > 0 ? remainingTime / totalMs : 0;
  const dashOffset = circumference * progress; //남은 시간 원 비율

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <button
          onClick={handleClick}
          disabled={remainingTime > 0}
          className={`bg-${FOOD_LIST.find((food) => food.name === name)?.img ?? "blue-600"} relative w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all duration-100 shadow-lg border-2
            ${remainingTime > 0
              ? "border-gray-700 cursor-not-allowed hover:shadow-none"
              : `border-blue-400 shadow-blue-400/50 animate-pulse hover:animate-none hover:shadow-blue-400/10`
            }`}
        >
          {/* 쿨타임 원형 링 */}
          {cooldown ? (
            <svg
              className="absolute top-0 left-0 w-full h-full rotate-[-90deg]"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="10"
                fill="none"
              />
              {remainingTime > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              )}
            </svg>
          ) : <div/>}
        </button>
      </div>

      {/* 칼로리 & 남은시간 표시 */}
      <div className="mt-3 bg-gray-800 text-white px-3 py-2 rounded-xl shadow-inner min-w-40">
        <h2 className="text-sm font-semibold mb-1">{name}</h2>
        <p className="text-xs text-gray-300 mb-1">칼로리: {FOOD_LIST.find((food) => food.name === name)?.calories ?? "??"} kcal</p>
        {remainingTime > 0 ? (
          <p className="text-red-400 text-xs">{formatRemaining(remainingTime)}</p>
        ) : (
          <div>
            <p className="text-green-400 text-xs">지금 먹을 수 있어요!</p>
            <p className="text-gray-400 text-xs">음식을 드신 후 클릭해주세요!</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default CTButton;
