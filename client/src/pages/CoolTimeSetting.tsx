import React, { useState } from "react";
import { auth } from "../firebaseConfig";

const CoolTimeSetting: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  const saveCooltime = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    await fetch("/cooltime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seconds }),
    });
    alert("쿨타임 저장 완료");
  };

  return (
    <div>
      <h1>쿨타임 설정</h1>
      <input
        type="number"
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
      />
      <button onClick={saveCooltime}>저장</button>
    </div>
  );
};

export default CoolTimeSetting;
