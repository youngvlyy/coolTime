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
        console.log(password.length);
        if (password.length < 6) {
          alert("비밀번호를 6자리 이상 눌러주세요");
          return;
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          {isLogin ? "로그인" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">

          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg border bg-blue-500  text-white 
                     font-medium
                     transition-all"        >
            {isLogin ? "로그인" : "회원가입"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-medium text-black hover:underline"
          >
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </p>

      </div>
    </div>
  );


};

export default Auth;
