// src/pages/MyPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [cooltime, setCooltime] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    setUser(currentUser);

    const fetchCooltime = async () => {
      const docRef = doc(db, "cooltimes", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCooltime(docSnap.data().seconds);
      }
      setLoading(false);
    };

    fetchCooltime();
  });

  return () => unsubscribe();
}, [navigate]);


  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4">
      <h1 className="text-4xl font-bold mb-6">마이페이지</h1>
      <p className="mb-4">환영합니다, {user.email}님!</p>
      <p className="mb-6">현재 설정된 쿨타임: {cooltime ? cooltime + "초" : "설정되지 않음"}</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button onClick={() => navigate("/cooltime")} className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium transition-colors button">
          쿨타임 설정 변경
        </button>
        <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-lg font-medium transition-colors button">
          로그아웃
        </button>
        <button onClick={() => navigate("/")} className="w-full bg-gray-600 hover:bg-gray-700 py-2.5 rounded-lg font-medium transition-colors button">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default MyPage;
