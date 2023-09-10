import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import qs from "qs";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";

const ClothingRecommendation = () => {
  const location = useLocation();
  const { subcategories } = location.state;
  const [recommendedClothes, setRecommendedClothes] = useState([]);
  const [apiToCall, setApiToCall] = useState("/api/clothing/recommendation"); // Default API
  const [activeButton, setActiveButton] = useState("many");

  const navigate = useNavigate();
  // 이미지 가져오기
  const fetchImage = async (id) => {
    try {
      const response = await axios.get(`/api/clothing/images/${id}`, {
        responseType: "arraybuffer",
      });
      const imageBytes = new Uint8Array(response.data);
      const base64String = btoa(String.fromCharCode.apply(null, imageBytes));
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
        const response = await axios.get(apiToCall, {
          params: { subcategories: encodedSubcategories },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        });
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

  const handleButtonClick = (apiEndpoint, buttonType) => {
    setApiToCall(apiEndpoint);
    setActiveButton(buttonType);
  };

  const GloStyle = createGlobalStyle`
      @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");

    `;

  const StyledImage = styled.img`
    width: 70px;
    height: auto;
  `;
  const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    margin-top: 40px;
  `;

  const Button = styled.button`
    padding: 10px 20px;
    border: none;
    font-size: 16px;
    text-align: center;
    font-family: "paybooc-Light", sans-serif;
    transition: 0.25s;
    background-color: ${(props) => (props.active ? "#364054" : "")};
    color: ${(props) => (props.active ? "#e3dede" : "#6e6e6e")};
    cursor: ${(props) => (props.active ? "pointer" : "")};
    border: ${(props) => (props.active ? "black" : "")};
  `;

  const BackButton = styled.div`
    margin-top: 25px;
    margin-left: 5%;
    display: flex;
  `;

  return (
    <div>
      <GloStyle />
      <BackButton onClick={() => navigate("/Main")}>
        <img src={back} alt="back" style={{ width: "28px" }} />
      </BackButton>
      <ButtonContainer>
        <Button
          onClick={() =>
            handleButtonClick("/api/clothing/recommendation", "many")
          }
          active={activeButton === "many"}
        >
          많이 입은
        </Button>
        <Button
          onClick={() =>
            handleButtonClick("/api/clothing/recommendation2", "few")
          }
          active={activeButton === "few"}
        >
          적게 입은
        </Button>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "15%" }}>
                아우터 :&nbsp;
              </span>
              {recommendedClothes
                .filter((clothes) => clothes.category === "아우터")
                .slice(0, 2)
                .map((clothes) => (
                  <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                ))}
              {recommendedClothes.filter(
                (clothes) => clothes.category === "아우터"
              ).length === 0 && <span>옷이 없어요</span>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "15%" }}>
                상의 :&nbsp;
              </span>
              {recommendedClothes
                .filter((clothes) => clothes.category === "상의")
                .slice(0, 2)
                .map((clothes) => (
                  <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                ))}
              {recommendedClothes.filter(
                (clothes) => clothes.category === "상의"
              ).length === 0 && <span> 옷이 없어요</span>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "15%" }}>
                하의 :&nbsp;
              </span>
              {recommendedClothes
                .filter((clothes) => clothes.category === "하의")
                .slice(0, 2)
                .map((clothes) => (
                  <StyledImage src={clothes.imageUrl} alt={clothes.id} />
                ))}
              {recommendedClothes.filter(
                (clothes) => clothes.category === "하의"
              ).length === 0 && <span> 옷이 없어요</span>}
            </div>
          </div>
        </div>
      ) : (
        <p>추천할 옷이 존재하지 않습니다.</p>
      )}
    </div>
  );
};

export default ClothingRecommendation;
