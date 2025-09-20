import { Request, Response, NextFunction } from "express";
import admin from "../firebaseAdmin";

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No auth header");
    return res.status(401).json({ message: "Unauthorized: no token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
