import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);

      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
      switch (error.code) {
        case "auth/invalid-credential":
          alert("아이디/비밀번호를 잘못 입력하셨습니다");
          break;
        case "auth/user-not-found":
          alert("가입되지 않은 계정입니다");
          break;
        case "auth/email-already-in-use":
          alert("이미 가입된 계정입니다");
          break;
      }


    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b ">
      <h1 className="text-4xl font-bold mb-6">{isLogin ? "로그인" : "회원가입"}</h1>
      <form onSubmit={handleSubmit} className="w-80 flex flex-col space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded text-black"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {isLogin ? "로그인" : "회원가입"}
        </button>
      </form>
      <p className="mt-4">
        {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="new">
          {isLogin ? "회원가입" : "로그인"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
