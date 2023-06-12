
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import qs from "qs";
import styled from "styled-components";

const ClothingRecommendation = () => {
    const location = useLocation();
    const { subcategories } = location.state;
    const [recommendedClothes, setRecommendedClothes] = useState([]);

    // 이미지 가져오기
    const fetchImage = async (id) => {
        try {
            const response = await axios.get(`/api/clothing/images/${id}`, {
                responseType: "arraybuffer",
            });
            const imageBytes = new Uint8Array(response.data);
            const base64String = btoa(
                String.fromCharCode.apply(null, imageBytes)
            );
            return `data:image/jpeg;base64,${base64String}`;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchRecommendedClothes = async () => {
            try {
                const encodedSubcategories = subcategories.map((subcategory) =>
                    encodeURIComponent(subcategory)
                );
                const response = await axios.get(
                    `/api/clothing/recommendation`,
                    {
                        params: { subcategories: encodedSubcategories },
                        paramsSerializer: (params) => {
                            return qs.stringify(params, { arrayFormat: "repeat" });
                        },
                    }
                );
                const data = response.data;

                // 이미지 가져오기
                const updatedClothes = await Promise.all(
                    data.map(async (clothes) => {
                        const imageUrl = await fetchImage(clothes.id);
                        return {
                            ...clothes,
                            imageUrl: imageUrl,
                        };
                    })
                );

                setRecommendedClothes(updatedClothes);
            } catch (error) {
                console.error("Error fetching recommended clothes:", error);
            }
        };

        fetchRecommendedClothes();
    }, [subcategories]);

    const StyledImage = styled.img`
        width: 20%;
        height:auto;
    `;

    return (
        <div>
            <h3 style={{ fontSize: "22px" }}>이렇게 입어보는 건 어떨까요?</h3>
            <hr
                style={{
                    height: "1px",
                    marginBottom: "50px",
                    border: "0",
                    backgroundColor: "lightgray",
                }}
            />
            {recommendedClothes.length > 0 ? (
                <div>
                    <p>아우터:</p>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "아우터")
                        .slice(0, 2)
                        .map((clothes) => (

                            <div key={clothes.id}>
                                <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                            </div>

                        ))}
                    <p>상의:</p>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 2)
                        .map((clothes) => (

                            <div key={clothes.id}>
                                <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                            </div>

                        ))}
                    <p>하의:</p>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 2)
                        .map((clothes) => (

                            <div key={clothes.id}>
                                <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                            </div>
                        ))}
                </div>
            ) : (
                <p>No recommended clothes available.</p>
            )}
        </div>
    );
};

export default ClothingRecommendation;

