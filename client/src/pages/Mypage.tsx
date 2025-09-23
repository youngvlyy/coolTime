import React, { useEffect, useState } from "react";
import axios from "axios";

interface ICoolFood {
  _id: string;
  name: string;
  calories: number;
  cooldown: number;
  lastEaten: string | null;
  savedCalories: number;
  startDate?: string; // 쿨타임 시작일
  endDate?: string; // 쿨타임 종료일
}

interface IUser {
  uid: string;
  email: string;
  coolFoods: ICoolFood[];
}

interface MyPageProps {
  user: { uid: string; email: string } | null;
}

const MyPage: React.FC<MyPageProps> = ({ user }) => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [selectedFood, setSelectedFood] = useState<ICoolFood | null>(null);
  const [cooldownDays, setCooldownDays] = useState(1);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`/api/user/${user.uid}/${encodeURIComponent(user.email)}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  // 음식 선택 → 쿨타임 입력
  const handleSelectFood = (food: ICoolFood) => {
    setSelectedFood(food);
    setCooldownDays(food.cooldown);
  };

  // 쿨타임 시작
  const startCooldown = async () => {
    if (!user || !selectedFood) return;

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + cooldownDays);

    try {
      const res = await axios.patch(
        `/api/user/${user.uid}/food/${selectedFood._id}/eat`,
        { startDate: today.toISOString(), endDate: endDate.toISOString() }
      );
      // 서버에서 savedCalories, lastEaten 업데이트
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              coolFoods: prev.coolFoods.map((f) =>
                f._id === selectedFood._id ? { ...res.data, startDate: today.toISOString(), endDate: endDate.toISOString() } : f
              ),
            }
          : null
      );
      setSelectedFood(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 날짜별 절약 칼로리 계산
  const calculateSavedCalories = (food: ICoolFood) => {
    if (!food.startDate) return food.savedCalories;

    const start = new Date(food.startDate);
    const today = new Date();
    const diffDays = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return diffDays * food.calories;
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-4xl font-bold mb-6">My Cool Foods</h1>

      {/* 음식 버튼 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {userData.coolFoods.map((food) => (
          <button
            key={food._id}
            onClick={() => handleSelectFood(food)}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            {food.name} ({food.calories} kcal)
          </button>
        ))}
      </div>

      {/* 쿨타임 입력 모달 */}
      {selectedFood && (
        <div className="p-4 bg-white/10 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Set Cooldown for {selectedFood.name}</h2>
          <input
            type="number"
            value={cooldownDays}
            min={1}
            onChange={(e) => setCooldownDays(Number(e.target.value))}
            className="input p-2 mr-2 text-center"
          />
          <button
            onClick={startCooldown}
            className="button  mt-5"
          >
            Start Cooldown
          </button>
        </div>
      )}

      {/* 쿨타임 진행 현황 */}
      <div className="flex flex-col gap-3">
        {userData.coolFoods.map((food) => (
          <div key={food._id} className="p-3 rounded bg-white/10">
            <p className="font-semibold">{food.name}</p>
            <p>Calories per session: {food.calories}</p>
            <p>
              Saved Calories: {calculateSavedCalories(food)}
            </p>
            {food.startDate && food.endDate && (
              <p>
                Cooldown: {new Date(food.startDate).toLocaleDateString()} ~ {new Date(food.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
