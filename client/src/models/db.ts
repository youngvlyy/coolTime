export interface BodyProfile {
  height: number;
  weight: number;
  bmi : number;
}

export interface User{
    uid: string;
  email: string;
}

export interface Food {
  _id?: string;
  name: string;
  cooldown?: number;   // 일 단위
  lastEaten?: string;
}

// 음식 칼로리 상수 (프론트 전용)
// export const FOOD_CALORIES: Record<string, number> = {
//   피자: 700,
//   치킨: 600,
//   햄버거: 500,
//   마라탕: 650,
// };
export const FOOD_LIST = [
  { name: "피자", calories: 700, img: "pizza"},
  { name: "치킨", calories: 600 , img: "chicken"},
  { name: "햄버거", calories: 500 , img: "hamburger"},
  { name: "마라탕", calories: 650 , img: "mara"},
];