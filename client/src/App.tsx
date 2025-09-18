// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Mypage from "./pages/Mypage";
import CoolTimeSetting from "./pages/CoolTimeSetting";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/cooltime" element={<CoolTimeSetting user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
