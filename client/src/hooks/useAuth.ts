import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      const uid = firebaseUser.uid;
      const email = firebaseUser.email || "";
      setUser({ uid, email });

      try {
        // 먼저 유저가 DB에 존재하는지 확인
        const res = await axios.get(`/api/user/${uid}/${email}`);
        console.log(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          // 유저 자체가 없으면 새로 생성
          await axios.post(`/api/user/${uid}/${email}`, { uid, email });
          console.warn("위 에러 무시 => 새 유저 db 생성 과정");
        } else {
          console.error("유저 확인 중 오류:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};
