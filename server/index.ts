// serve/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import cooltimeRoutes from "./routes/coolTime";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cooltime", cooltimeRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cooltimeDB";

// MongoDB 연결
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// 기본 라우터
app.get("/", (req, res) => res.send("서버 정상 실행 중"));

app.listen(4000, "0.0.0.0", () => console.log(`Server running on ${PORT}`));




//기본 라우터
app.get("/", (req, res) => {
  res.send("서버 정상 실행 중");
});

const searchFoodNm = (foodNm: string, target: string): boolean => {
  // 공통 글자 찾기
  const searchnm = [...foodNm].filter(ch => target.includes(ch));

  console.log("searchnm:", searchnm);

  // 2글자 이상 같으면 true 리턴
  return searchnm.length >= 2;
};

// 음식 이름으로 공공 API 호출
app.get("/api/food", async (req, res) => {
  const { foodNm } = req.query as { foodNm: string };
  const servicekey = process.env.SERVICE_KEY;

  if (!foodNm) return res.status(400).json({ error: "foodNm 필요" });
  if (!servicekey) return res.status(400).json({ error: "apikey 필요" });

  try {
    const response = await axios.get(
      "http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api",
      {
        params: {
          ServiceKey: process.env.SERVICE_KEY, // decode키 사용
          type: "json",
          foodNm
        }
      }
    );

    //const items = response.data?.response?.body?.items ?? [];
    // foodNm 비교 필터링
    // const matched = items.filter((item: any) =>
    //   searchFoodNm(foodNm, item.foodNm)
    // );
    console.log("공공 API 원본 응답:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error("공공 API 호출 실패:", error);
    res.status(500).json({ error: "공공 API 호출 실패" });
  }
});



app.listen(4000,'0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});


//로그인
// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

