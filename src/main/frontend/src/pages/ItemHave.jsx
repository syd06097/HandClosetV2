

import React, { useEffect, useState } from "react";
import axios from 'axios';

const ItemHave = () => {
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get("/api/clothing/category-item-count");
                const data = response.data;
                setStatistics(Object.entries(data));
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, []);

    const categories = [
        { name: "상의", subcategories: ["민소매", "반팔티", "긴팔티", "블라우스/셔츠", "맨투맨/후디", "니트", "기타"] },
        { name: "하의", subcategories: ["반바지", "치마", "면바지", "슬랙스", "청바지", "트레이닝/조거", "기타"] },
        { name: "아우터", subcategories: ["트렌치 코드", "코트", "자켓/점퍼", "야상", "무스탕", "패딩", "후드집업", "가디건/베스트", "기타"] },
        { name: "원피스", subcategories: ["미니 원피스", "미디 원피스", "맥시 원피스", "기타"] },
        { name: "신발", subcategories: ["운동화", "구두", "부츠", "샌들", "기타"] },
        { name: "가방", subcategories: ["백팩", "숄더/토트백", "크로스백", "클러치", "기타"] },
        { name: "악세사리", subcategories: ["모자", "양말", "쥬얼리/시계", "머플러/스카프", "벨트", "기타"] },
        { name: "기타", subcategories: ["이너웨어", "잠옷", "수영복"] }
    ];

    const calculateCategoryPercentage = (categoryName) => {
        const categoryItemCount = statistics.reduce((total, [key, count]) => {
            const [parentCategory] = key.split("-");
            return parentCategory === categoryName ? total + count : total;
        }, 0);

        const totalItemCount = statistics.reduce((total, [_, count]) => total + count, 0);

        if (totalItemCount === 0) return 0;

        const percentage = Math.round((categoryItemCount / totalItemCount) * 100);
        return { count: categoryItemCount, percentage };
    };

    const sortedCategories = categories.sort((a, b) => {
        const percentageA = calculateCategoryPercentage(a.name).percentage;
        const percentageB = calculateCategoryPercentage(b.name).percentage;
        return percentageB - percentageA;
    });

    const totalItemCount = statistics.reduce((total, [_, count]) => total + count, 0);

    return (
        <div>
            <h1>ItemHave</h1>

            <h2>Category Percentages</h2>
            <ul>
                {sortedCategories.map((category) => {
                    const { count, percentage } = calculateCategoryPercentage(category.name);
                    return (
                        <li key={category.name}>
                            {category.name}: {count} | ({percentage}%)
                        </li>
                    );
                })}
            </ul>
            <p>Total Item Count: {totalItemCount}</p>
        </div>
    );
};

export default ItemHave;