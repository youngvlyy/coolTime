"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// 공공 API 음식 검색
router.get("/", async (req, res) => {
    const { foodNm } = req.query;
    const servicekey = process.env.SERVICE_KEY;
    if (!foodNm)
        return res.status(400).json({ error: "foodNm 필요" });
    try {
        const response = await axios_1.default.get("http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api", {
            params: { ServiceKey: servicekey, type: "json", foodNm },
        });
        const items = response.data?.response?.body?.items ?? [];
        const result = items.map((item) => ({
            foodName: item.FOOD_NM,
            calories: item.NUTR_CONT1,
            carbs: item.NUTR_CONT2,
            protein: item.NUTR_CONT3,
            fat: item.NUTR_CONT4,
        }));
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: "공공 API 호출 실패" });
    }
});
exports.default = router;
