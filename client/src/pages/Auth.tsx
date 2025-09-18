// src/pages/Auth.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4">
      <h1 className="text-4xl font-bold mb-6">{isRegister ? "회원가입" : "로그인"}</h1>
      <form className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium transition-colors button">
          {isRegister ? "회원가입" : "로그인"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-400">
          {isRegister ? "계정이 이미 있나요?" : "계정이 없으신가요?"}{" "}
          <button type="button" className="text-blue-400 hover:underline" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "로그인" : "회원가입"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
