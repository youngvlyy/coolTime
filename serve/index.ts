import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
const PORT = 4000;
app.use(cors());

//코드에 직접 쓰기 민감한 값들
dotenv.config();


//기본 라우터
app.get("/", (req, res) => {
  res.send("서버 정상 실행 중");
});

// 음식 이름으로 공공 API 호출
app.get("/api/food", async (req, res) => {
  const { foodNm } = req.query as { foodNm: string };


  if (!foodNm) return res.status(400).json({ error: "foodNm 필요" });

  try {
    const response = await axios.get(
      "http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api",
      {
        params: {
          ServiceKey: process.env.SERVICE_KEY, // decode키 사용
          type: "json",
          foodNm
        }
      });
    console.log("공공 API 원본 응답:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error("공공 API 호출 실패:", error);
    res.status(500).json({ error: "공공 API 호출 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

