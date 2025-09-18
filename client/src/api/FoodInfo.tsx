import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!foodNm) return;

    const fetchFood = async () => {
      setLoading(true);
      try {
        const res = await axios.get<FoodResponse>("api/food", {
          params: { foodNm },
        });
        const item = res.data?.response?.body?.items?.[0] || null;
        setData(item);
      } catch (err) {
        console.error("API 호출 실패:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodNm]);

  if (loading) return <p className="text-center mt-4">불러오는 중...</p>;
  if (!data) return foodNm ? <p className="text-center mt-4">데이터가 없습니다.</p> : <div>데이터가 없음</div>;

  return (
    <div className="w-full mt-5 flex justify-center">
      <button
        type="button"
        onClick={() => navigate("/aimdate")}
        className="button rounded-xl p-5 w-1/3"
      >
        <div>
          <h1 className="text-lg font-bold mb-2">음식 이름: {data.foodNm}</h1>
          <p>칼로리: {data.enerc}</p>
          <p>탄수화물: {data.sugar}</p>
          <p>단백질: {data.prot}</p>
          <p>지방: {data.fatrn}</p>
        </div>
      </button>
    </div>
  );
};

export default FoodInfo;
