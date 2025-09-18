// src/pages/CoolTimeSetting.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface CoolTimeSettingProps {
  user: any;
}

const CoolTimeSetting: React.FC<CoolTimeSettingProps> = ({ user }) => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCooltime = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const docRef = doc(db, "cooltimes", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSeconds(docSnap.data().seconds);
      }
      setLoading(false);
    };
    fetchCooltime();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    await setDoc(doc(db, "cooltimes", user.uid), { seconds });
    navigate("/mypage");
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4">
      <h1 className="text-4xl font-bold mb-6">쿨타임 설정</h1>
      
      <input
        type="number"
        min={1}
        value={seconds}
        onChange={e => setSeconds(Number(e.target.value))}
        className="mb-6 p-2.5 rounded-lg text-black"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium transition-colors button"
      >
        저장
      </button>

      <button
        onClick={() => navigate("/mypage")}
        className="mt-4 bg-gray-600 hover:bg-gray-700 py-2.5 rounded-lg font-medium transition-colors button"
      >
        마이페이지로 돌아가기
      </button>
    </div>
  );
};

export default CoolTimeSetting;
