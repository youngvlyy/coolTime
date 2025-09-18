// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import CTButton from "../components/CTButton";
import Cool from "../assets/react.svg";

interface HomeProps {
  user: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* 상단 오른쪽 버튼 */}
      <div className="w-full flex justify-end p-4">
        {user ? (
          <div>
            <button
              onClick={()=>navigate("/mypage")}
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

      {user && (
        <div className="mt-10">
          <CTButton iconUrl={Cool} cooldown={5} />
        </div>
      )}
    </div>
  );
};

export default Home;
