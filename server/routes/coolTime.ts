import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

// 로그인한 사용자 정보 반환 (없으면 생성)
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    let user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name,
        favorites: [],
        cooltimeSeconds: 0,
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /me:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 즐겨찾기 추가
router.post("/favorites", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { item } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(item)) {
      user.favorites.push(item);
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /favorites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 쿨타임 저장
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { seconds } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cooltimeSeconds = seconds;
    await user.save();
    res.json({ message: "쿨타임 저장 완료", cooltime: user.cooltimeSeconds });
  } catch (error) {
    console.error("Error in /:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
