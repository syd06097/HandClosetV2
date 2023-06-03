import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import qs from "qs";
const ClothingRecommendation = () => {
    const location = useLocation();
    const { subcategories } = location.state;
    const [recommendedClothes, setRecommendedClothes] = useState([]);

    // subcategory를 사용하여 해당 서브 카테고리에 맞는 옷을 추천하는 로직을 구현합니다.
    useEffect(() => {
        const fetchRecommendedClothes = async () => {
            try {
                // 선택된 서브 카테고리에 해당하는 추천 옷 목록을 가져오는 API 호출
                const encodedSubcategories = subcategories.map(subcategory => encodeURIComponent(subcategory));
                const response = await axios.get(`/api/clothing/recommendation`,{
                    params: { subcategories: encodedSubcategories },
                    paramsSerializer: params => {
                        return qs.stringify(params, { arrayFormat: 'repeat' });
                    }});
                const data = response.data;
                console.log(data)
                setRecommendedClothes(data);
            } catch (error) {
                console.error("Error fetching recommended clothes:", error);
            }
        };

        fetchRecommendedClothes();
    }, [subcategories]);


    return (
        <div>
            <h1>Clothing Recommendation</h1>
            {recommendedClothes.length > 0 ? (
                <div>
                    <p>아우터:</p>
                    {recommendedClothes
                        .filter(clothes => clothes.category === '아우터')
                        .slice(0, 2)
                        .map(clothes => (
                            <p key={clothes.id}>{clothes.id}</p>
                        ))}
                    <p>상의:</p>
                    {recommendedClothes
                        .filter(clothes => clothes.category === '상의')
                        .slice(0, 2)
                        .map(clothes => (
                            <p key={clothes.id}>{clothes.id}</p>
                        ))}
                    <p>하의:</p>
                    {recommendedClothes
                        .filter(clothes => clothes.category === '하의')
                        .slice(0, 2)
                        .map(clothes => (
                            <p key={clothes.id}>{clothes.id}</p>
                        ))}
                </div>
            ) : (
                <p>No recommended clothes available.</p>
            )}

        </div>
    );
};

export default ClothingRecommendation;
