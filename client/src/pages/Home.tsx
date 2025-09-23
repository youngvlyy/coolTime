import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import CTButton from "../components/CTButton";
import Cool from "../assets/react.svg";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ICoolFood {
  _id: string;
  name: string;
  calories: number;
  cooldown: number; // 일 단위
  lastEaten: string | null;
  savedCalories: number;
}

interface IUser {
  uid: string;
  email: string;
  coolFoods: ICoolFood[];
}

interface HomeProps {
  user: { uid: string; email: string } | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUser | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  // 유저 정보 가져오기 (자동 생성 + 조회)
  useEffect(() => {
    if (!user) return;

    axios
      .get(`/api/user/${user.uid}/${encodeURIComponent(user.email)}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  // 쿨타임 시작 및 서버 PATCH
  const startCooldown = async (food: ICoolFood) => {
    if (!user) return;
    try {
      const res = await axios.patch(
        `/api/user/${user.uid}/food/${food._id}/eat`
      );
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              coolFoods: prev.coolFoods.map((f) =>
                f._id === food._id ? res.data : f
              ),
            }
          : null
      );
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="w-full flex justify-end p-4">
        {user ? (
          <div>
            <button
              onClick={() => navigate("/mypage")}
              className="px-4 py-2 button mr-5"
            >
              Mypage
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors button"
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/auth")} className="button">
            Login
          </button>
        )}
      </div>

      <h1 className="text-5xl font-bold mt-10">Cool Time Goal</h1>

      {user && userData && (
        <div className="mt-10 grid grid-cols-3 gap-6">
          {userData.coolFoods.map((food) => (
            <div key={food._id} className="flex flex-col items-center">
              <p className="mb-2 font-semibold text-lg">
                {food.name} ({food.calories} kcal)
              </p>
              <CTButton
                iconUrl={Cool}
                cooldown={food.cooldown * 24 * 60 * 60} // 초 단위
                onClick={() => startCooldown(food)}
              />
              <p className="mt-2 text-sm">
                Saved: {food.savedCalories} kcal
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
