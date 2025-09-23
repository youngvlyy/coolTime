import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Auth from "./pages/Auth";
import { useAuth } from "./hooks/useAuth";

function App() {
  const user = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/mypage" element={<Mypage user={user}/>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
