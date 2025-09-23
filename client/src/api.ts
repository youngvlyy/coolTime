// API 기본 URL
const API_URL = "http://localhost:4000/api";

// =====================
// 타입 정의
// =====================
export interface Food {
  id: number;
  name: string;
  calories: number;
  cooldown: number;
  lastEaten: Date | null;
  savedCalories: number;
}

export interface FoodInfo {
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

// =====================
// 쿨타임 관련 API
// =====================

// 음식 추가
export async function addFood(
  food: Omit<Food, "id" | "lastEaten" | "savedCalories">
): Promise<Food> {
  const res = await fetch(`${API_URL}/cooltime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  if (!res.ok) throw new Error("음식 추가 실패");
  return res.json();
}

// 음식 전체 조회
export async function getFoods(): Promise<Food[]> {
  const res = await fetch(`${API_URL}/cooltime`);
  if (!res.ok) throw new Error("음식 조회 실패");
  return res.json();
}

// 오늘 먹음 처리
export async function eatFood(id: number): Promise<Food> {
  const res = await fetch(`${API_URL}/cooltime/${id}/eat`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("먹음 처리 실패");
  return res.json();
}

// =====================
// 공공 API 음식 검색
// =====================
export async function searchFood(foodNm: string): Promise<FoodInfo[]> {
  const res = await fetch(`${API_URL}/food?foodNm=${encodeURIComponent(foodNm)}`);
  if (!res.ok) throw new Error("공공 API 조회 실패");
  return res.json();
}

// =====================
// 사용자 MongoDB 관련
// =====================
export interface User {
  uid: string;
  email: string;
  foods: Food[];
}

// 사용자 등록 (Firebase 가입 시)
export async function registerUser(uid: string, email: string): Promise<User> {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, email }),
  });
  if (!res.ok) throw new Error("사용자 등록 실패");
  return res.json();
}

// 사용자 음식 추가
export async function addUserFood(uid: string, food: Omit<Food, "id" | "lastEaten" | "savedCalories">): Promise<Food[]> {
  const res = await fetch(`${API_URL}/user/${uid}/foods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  if (!res.ok) throw new Error("사용자 음식 추가 실패");
  return res.json();
}

// 사용자 음식 목록 조회
export async function getUserFoods(uid: string): Promise<Food[]> {
  const res = await fetch(`${API_URL}/user/${uid}/foods`);
  if (!res.ok) throw new Error("사용자 음식 조회 실패");
  return res.json();
}
