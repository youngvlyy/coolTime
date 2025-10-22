import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calcBMI } from "../utils/cooldown";
// import { FOOD_LIST } from "../models/db"
import { FOOD_LIST } from "../models/db";

interface MypageProps {
  user: { uid: string; email: string } | null;
}

const Mypage: React.FC<MypageProps> = ({ user }) => {
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [hasBody, setHasBody] = useState<boolean>(false); // ✅ 이미 등록된 body 여부
  const navigate = useNavigate();

  /** ✅ 마운트 시 DB에서 기존 body 존재 여부 확인 */
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

  /** 저장 버튼 클릭 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return alert("키와 몸무게를 입력하세요");
    if (!user) return;

    const calculatedBMI = calcBMI(height, weight);
    setBmi(calculatedBMI);

    try {
      const endpoint = "/api/bodyprofile";
      const method = "patch";

      await axios({
        method,
        url: endpoint,
        data: {
          uid: user.uid,
          email: user.email,
          body: { height, weight, bmi: calculatedBMI },
          food: FOOD_LIST.map((food) => food.name)
        },
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          홈으로
        </button>
        <h2 className="text-xl font-bold">마이페이지</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="height">키:</label>
          <input
            type="number"
            id="height"
            value={height ?? ""}
            onChange={(e) =>
              setHeight(e.target.value ? Number(e.target.value) : null)
            }
            className="border px-2 py-1 rounded"
          />{" "}
          cm
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="weight">몸무게:</label>
          <input
            type="number"
            id="weight"
            value={weight ?? ""}
            onChange={(e) =>
              setWeight(e.target.value ? Number(e.target.value) : null)
            }
            className="border px-2 py-1 rounded"
          />{" "}
          kg
        </div>



        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          {hasBody ? "수정하기" : "등록하기"}
        </button>
      </form>

      {bmi && <p className="mt-4 text-gray-700">현재 BMI: {bmi.toFixed(2)}</p>}
    </div>
  );
};

export default Mypage;
