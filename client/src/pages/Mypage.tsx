import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calcBMI } from "../utils/cooldown";
import { FOOD_LIST } from "../models/db";

interface MypageProps {
  user: { uid: string; email: string } | null;
}

const Mypage: React.FC<MypageProps> = ({ user }) => {
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [hasBody, setHasBody] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios
      .get(`/api/user/${user.uid}/${user.email}`)
      .then((res) => {
        const body = res.data.body?.[0];
        if (body) {
          setHasBody(true);
          setHeight(body.height);
          setWeight(body.weight);
          setBmi(body.bmi);
        }
      })
      .catch(() => setHasBody(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return alert("키와 몸무게를 입력하세요");
    if (!user) return;

    const calculatedBMI = calcBMI(height, weight);
    setBmi(calculatedBMI);

    try {
      await axios.patch("/api/bodyprofile", {
        uid: user.uid,
        email: user.email,
        body: { height, weight, bmi: calculatedBMI },
        food: FOOD_LIST.map((f) => f.name),
      });

      alert(
        hasBody
          ? `수정 완료! 새로운 BMI: ${calculatedBMI.toFixed(2)}`
          : `등록 완료! BMI: ${calculatedBMI.toFixed(2)}`
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded-lg shadow-sm 
             hover:bg-blue-600 hover:border-blue-600 active:scale-95 transition-transform duration-150"
          >
            ← 홈으로
          </button>

          <h2 className="text-xl font-bold text-gray-800">마이페이지</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 키 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="height"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              키 (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height ?? ""}
              onChange={(e) =>
                setHeight(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="예: 175"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          {/* 몸무게 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="weight"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              몸무게 (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight ?? ""}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="예: 68"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full mt-4 py-2.5 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            {hasBody ? "수정하기" : "등록하기"}
          </button>
        </form>

        {bmi && (
          <div className="text-center mt-4 text-gray-700 bg-blue-50 py-3 rounded-lg font-medium">
            현재 BMI: <span className="font-bold">{bmi.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mypage;
