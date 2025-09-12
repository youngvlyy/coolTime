import React, { useState, useEffect } from "react";
import axios from "axios";

type Item = {
  foodNm: string;
  enerc: string;
  sugar: string;
  prot: string;
  fatrn: string;
};

type FoodResponse = {
  response: {
    body: {
      items: Item[];
    };
  };
};

type FoodInfoProps = {
  foodNm: string;
};

const FoodInfo: React.FC<FoodInfoProps> = ({ foodNm }) => {
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!foodNm) return;

    console.log(foodNm);
    const fetchFood = async () => {
      setLoading(true);
      try {
        const res = await axios.get<FoodResponse>("api/food", {
          params: { foodNm: foodNm },
        });

        const item = res.data?.response?.body?.items?.[0] || null;
        setData(item);
      } catch (err) {
        console.error("API 호출 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodNm]);


  if (data) {
    return (
      <div>
        <h1>영양 성분 정보</h1>
        <p>음식 이름: {data.foodNm}</p>
        <p>칼로리: {data.enerc}</p>
        <p>탄수화물: {data.sugar}</p>
        <p>단백질: {data.prot}</p>
        <p>지방: {data.fatrn}</p>
      </div>
    );
  }

  if (loading) return <p>불러오는 중...</p>;
  if (!data && foodNm) return <p>데이터가 없습니다.</p>;
};

export default FoodInfo;
