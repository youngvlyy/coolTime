import React, { useEffect, useState } from "react";
import axios from "axios";
import CTButton from "../components/CTButton";
import { calcCooldown } from "../utils/cooldown";
import type { BodyProfile, User, Food } from "../models/db";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [body, setBody] = useState<BodyProfile | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const navigate = useNavigate();

  /** 유저 정보 로드 */
  useEffect(() => {
    axios.get(`/api/user/${user.uid}/${user.email}`).then((res) => {
      setBody(res.data?.body[0] ?? {});
      setFoods(res.data?.food ?? []);
    });
  }, [user]);

  /** 쿨타임 버튼 클릭 */
  const handleEat = async (foodId: string) => {
    if (!body) return;

    const food = foods.find((f) => f._id === foodId);
    if (!food) return;

    const newCooldown = calcCooldown(food.name, body.bmi);

    const res = await axios.patch(`/api/user/${user.uid}/food/${foodId}`, {
      lastEaten: new Date().toISOString(),
      cooldown: newCooldown,
    });

    setFoods((prev) => prev.map((f) => (f._id === foodId ? res.data : f)));
  };

  /** 로그아웃 */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  /** 마이페이지 이동 */
  const goToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="p-4">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">음식 쿨타임</h1>
        <div className="flex gap-2">
          <button
            onClick={goToMyPage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            마이페이지
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* BMI 정보 */}
      {body?.bmi ? (
        <div className="bg-gray-200 px-3 py-2 rounded-xl shadow-inner">
          <span>키: <b>{body.height}cm</b></span>, 
          <span> 몸무게: <b>{body.weight}kg</b></span>, 
          <span> BMI: <b>{body.bmi}</b></span> 
        </div>
      ) : (
       <div className="bg-gray-200 px-3 py-2 rounded-xl shadow-inner">마이페이지에서 정보를 입력해주세요</div>
      )}


      {/* 음식 버튼 목록 */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods && foods.map((food) => (
          <CTButton key={food.name} onEat={handleEat} {...food} />
        ))}
      </div>
    </div>
  );
};

export default Home;
