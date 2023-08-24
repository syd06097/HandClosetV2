
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import qs from "qs";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const ClothingRecommendation = () => {
    const location = useLocation();
    const { subcategories } = location.state;
    const [recommendedClothes, setRecommendedClothes] = useState([]);
    const [apiToCall, setApiToCall] = useState('/api/clothing/recommendation'); // Default API

    const navigate = useNavigate();
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
                    apiToCall,
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
    }, [subcategories, apiToCall]);

    const StyledImage = styled.img`
        width: 20%;
        height:auto;
    `;
    const ButtonContainer = styled.div`
        display: flex;
        justify-content: center;
        margin-top: 20px;
    `;

    const Button = styled.button`
        padding: 10px 20px;
        margin: 0 10px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        background-color: ${props => props.isActive ? "blue" : "gray"};
        color: white;
    `;

    return (
        <div>
            <div style={{ display: "block",width:"100%", height:"40px" ,textAlign:"center"  }}>
                <div onClick={() => navigate("/Main")} style={{marginTop: "23px", float: "right", paddingRight: "9%", fontSize: "30px", fontWeight: "bold"}}>X</div>
            </div>
            <h3 style={{ fontSize: "22px" }}>이렇게 입어보는 건 어떨까요?</h3>
            <ButtonContainer>
            <Button onClick={() => setApiToCall('/api/clothing/recommendation')}>많이 입은</Button>
            <Button onClick={() => setApiToCall('/api/clothing/recommendation2')}>적게 입은</Button>
            </ButtonContainer>
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
                    {recommendedClothes
                        .filter(clothes => clothes.category === "아우터").length === 0 && (
                        <p>옷이 없어요 ㅠㅠ</p>
                    )}

                    <p>상의:</p>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 2)
                        .map((clothes) => (

                            <div key={clothes.id}>
                                <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                            </div>

                        ))}
                    {recommendedClothes
                        .filter(clothes => clothes.category === "상의").length === 0 && (
                        <p>옷이 없어요 ㅠㅠ</p>
                    )}

                    <p>하의:</p>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 2)
                        .map((clothes) => (

                            <div key={clothes.id}>
                                <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                            </div>
                        ))}
                    {recommendedClothes
                        .filter(clothes => clothes.category === "하의").length === 0 && (
                        <p>옷이 없어요 ㅠㅠ</p>
                    )}

                </div>
            ) : (
                <p>추천할 옷이 존재하지 않습니다.</p>
            )}
        </div>
    );
};

export default ClothingRecommendation;

