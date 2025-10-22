// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Auth from "./pages/Auth";
import { useAuth } from "./hooks/useAuth";

function App() {
  const user = useAuth();

  if (user === null) {
    // 로그인 안 된 상태라면 로그인 페이지로 이동
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      </Router>
    );
  }else{
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
  
  
}

export default App;
