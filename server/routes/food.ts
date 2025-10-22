// import { Router } from "express";
// import axios from "axios";

// const router = Router();

// // 공공 API 음식 검색
// router.get("/", async (req, res) => {
//   const { foodNm } = req.query as { foodNm: string };
//   const servicekey = process.env.SERVICE_KEY;

//   if (!foodNm) return res.status(400).json({ error: "foodNm 필요" });

//   try {
//     const response = await axios.get(
//       "http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api",
//       {
//         params: { ServiceKey: servicekey, type: "json", foodNm },
//       }
//     );

//     const items = response.data?.response?.body?.items ?? [];
//     const result = items.map((item: any) => ({
//       foodName: item.FOOD_NM,
//       calories: item.NUTR_CONT1,
//       carbs: item.NUTR_CONT2,
//       protein: item.NUTR_CONT3,
//       fat: item.NUTR_CONT4,
//     }));

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: "공공 API 호출 실패" });
//   }
// });

// export default router;
