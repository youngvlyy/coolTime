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
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium border rounded-md p-2 text-gray-600 hover:bg-gray-100 transition"
        >
          홈으로
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          마이페이지
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        
        {/* 키 */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="height" className="text-sm text-gray-600">
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
            className="px-4 py-3 rounded-lg border border-gray-300 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition"
          />
        </div>

        {/* 몸무게 */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="weight" className="text-sm text-gray-600">
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
             className="px-4 py-3 rounded-lg border border-gray-300 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition"
          />
        </div>

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg border border-blue-500  text-blue-500 
                     font-medium hover:bg-blue-600 hover:text-white
                     active:scale-95 transition-all"
        >
          {hasBody ? "수정하기" : "등록하기"}
        </button>
      </form>

      {bmi && (
        <div className="text-center text-gray-700 bg-gray-100 py-3 rounded-lg font-medium">
          현재 BMI: <span className="font-semibold">{bmi.toFixed(2)}</span>
        </div>
      )}

    </div>
  </div>
);

};

export default Mypage;
