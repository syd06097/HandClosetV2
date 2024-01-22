import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";
import qs from "qs";
import styled, {createGlobalStyle,css} from "styled-components";
import {useNavigate} from "react-router-dom";
import back from "../images/back.png";
import refresh from "../images/refresh.png"

const ClothingRecommendation = () => {
  const location = useLocation();
  const {subcategories, temperature} = location.state;
  const [recommendedClothes, setRecommendedClothes] = useState([]);
  const [apiToCall, setApiToCall] = useState("/api/clothing/recommendation"); // Default API
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const [tpoSubcategories, setTpoSubcategories] = useState([]);
  const navigate = useNavigate();
  const [tporecommendedClothes, setTpoRecommendedClothes] = useState([]);
  const [randomrecommendedClothes, setRandomRecommendedClothes] = useState([]);
  const [fewrecommendedClothes, setFewRecommendedClothes] = useState([]);
  const [activeButton, setActiveButton] = useState("casual");
  const [casualsubcategory, setCasualsubcategory ] = useState([]);
  const [formalsubcategory, setFormalsubcategory ] = useState([]);



  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, []);


  const fetchImage = async (id) => {
    try {
      const response = await axios.get(`/api/clothing/images/${id}`, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        data: {refreshToken: loginInfo.refreshToken},
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

  const TpoCasualCategory = (temperature) => {
    if (temperature >= 28) {
      return "민소매,반팔티,반바지,치마,청바지";
    } else if (temperature >= 23) {
      return "반팔티,블라우스/셔츠,반바지,면바지,치마,청바지,트레이닝/조거";
    } else if (temperature >= 20) {
      return "가디건,블라우스/셔츠,긴팔티,면바지,청바지,치마,트레이닝/조거";
    } else if (temperature >= 17) {
      return "니트,블라우스/셔츠,긴팔티,맨투맨/후디,청바지,치마,면바지,트레이닝/조거,가디건/베스트,";
    } else if (temperature >= 12) {
      return "자켓/점퍼,트렌치코트,가디건/베스트,야상,후드집업,맨투맨/후디,니트,면바지,청바지,트레이닝/조거,";
    } else if (temperature >= 9) {
      return "자켓/점퍼,트렌치코트,후드집업,야상,맨투맨/후디,니트,면바지,청바지,트레이닝/조거";
    } else if (temperature >= 5) {
      return "코트,무스탕,니트,맨투맨/후디,면바지,청바지,트레이닝/조거";
    } else {
      return "패딩,무스탕,코트,니트,맨투맨/후디,면바지,청바지,트레이닝/조거";
    }
  };

  const TpoFormalCategory = (temperature) => {
    if (temperature >= 28) {
      return "반팔티,치마,슬랙스";
    } else if (temperature >= 23) {
      return "반팔티,블라우스/셔츠,치마,슬랙스";
    } else if (temperature >= 20) {
      return "가디건/베스트,블라우스/셔츠,긴팔티,치마,슬랙스";
    } else if (temperature >= 17) {
      return "니트,블라우스/셔츠,긴팔티,치마,슬랙스,가디건/베스트,블레이저";
    } else if (temperature >= 12) {
      return "트렌치코트,가디건/베스트,니트,슬랙스,블레이저";
    } else if (temperature >= 9) {
      return "트렌치코트,니트,슬랙스,블레이저";
    } else if (temperature >= 5) {
      return "코트,니트,슬랙스";
    } else {
      return "코트,니트,슬랙스";
    }
  };

  useEffect(() => {
    const fetchRecommendedClothes = async () => {
      console.log("fetchRecommendedClothes 함수 호출!!");
      try {
        const encodedSubcategories = subcategories.map((subcategory) =>
            encodeURIComponent(subcategory)
        );
        const response = await axios.get(apiToCall, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          
          params: {subcategories: encodedSubcategories},
          paramsSerializer: (params) => {
            return qs.stringify(params, {arrayFormat: "repeat"});
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
        console.log(updatedClothes); // 확인용 로그
        console.log(recommendedClothes);
      } catch (error) {
        console.error("Error fetching recommended clothes:", error);
      }
    };
    const casual = TpoCasualCategory(temperature);
    setCasualsubcategory(casual.split(","));
    const formal = TpoFormalCategory(temperature);
    setFormalsubcategory(formal.split(","));
    fetchRecommendedClothes();
    fewRecommendation();
    handleRandomButtonClick();
  }, [subcategories, apiToCall]);


  const handleRandomButtonClick = async (apiEndpoint) => {
    try {
      const encodedSubcategories = subcategories.map((subcategory) =>
          encodeURIComponent(subcategory)
      );
      const response = await axios.get("/api/clothing/RandomRecommendation", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        params: {subcategories: encodedSubcategories},

        
        paramsSerializer: (params) => {
          return qs.stringify(params, {arrayFormat: "repeat"});
        },
      });
      const data = response.data;

      const updatedClothes = await Promise.all(
          data.map(async (clothes) => {
            const imageUrl = await fetchImage(clothes.id);
            return {
              ...clothes,
              imageUrl: imageUrl,
            };
          })
      );

      setRandomRecommendedClothes(updatedClothes);
    } catch (error) {
      console.error("Error fetching recommended clothes:", error);
    }
  };


  const fewRecommendation = async () => {
    try {
      const encodedSubcategories = subcategories.map((subcategory) =>
          encodeURIComponent(subcategory)
      );
      const response = await axios.get("/api/clothing/recommendation2", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        params: {subcategories: encodedSubcategories},

        
        paramsSerializer: (params) => {
          return qs.stringify(params, {arrayFormat: "repeat"});
        },
      });
      const data = response.data;

      const updatedClothes = await Promise.all(
          data.map(async (clothes) => {
            const imageUrl = await fetchImage(clothes.id);
            return {
              ...clothes,
              imageUrl: imageUrl,
            };
          })
      );

      setFewRecommendedClothes(updatedClothes);
    } catch (error) {
      console.error("Error fetching recommended clothes:", error);
    }
  };


  const handleTpoClick = async () => {
    try {
      const encodedSubcategories = tpoSubcategories.map((subcategory) =>
          encodeURIComponent(subcategory)
      );
      const response = await axios.get("/api/clothing/recommendation", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        params: {subcategories: encodedSubcategories},

        
        paramsSerializer: (params) => {
          return qs.stringify(params, {arrayFormat: "repeat"});
        },
      });
      const data = response.data;

      const updatedClothes = await Promise.all(
          data.map(async (clothes) => {
            const imageUrl = await fetchImage(clothes.id);
            return {
              ...clothes,
              imageUrl: imageUrl,
            };
          })
      );

      setTpoRecommendedClothes(updatedClothes);
    } catch (error) {
      console.error("Error fetching recommended clothes:", error);
    }
  };

  useEffect(() => {
    if (tpoSubcategories.length > 0) {
      handleTpoClick();
    }
  }, [tpoSubcategories]);

  const GloStyle = createGlobalStyle`
      @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');

    `;

  const BackButton = styled.div`
      margin-top: 26px;
      margin-left: 9%;
      display: flex;
    `;

  const Image = styled.img`
      width: 125px; /* 조절 가능한 크기 */
      height: 125px;
      margin-top: 5px;
    `;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #e9e9e9; /* 아이보리색 배경색 */
    border-radius: 5px; /* 둥근 모서리 */
    overflow: hidden;
    margin-top: 20px;
    width: 280px; /* 고정된 너비 */
    margin-right: 0; /* 오른쪽 여백 제거 */
    margin-left: 9%;
  `;
  const RowContainer = styled.div`
      display: flex;
      justify-content: space-around;
    `;

  const Tpobutton = styled.button`
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      padding: 0.5rem 1rem;

      font-family: 'Noto Sans KR', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      text-align: center;
      text-decoration: none;

      border: none;
      border-radius: 4px;

      display: block;
      width: auto;

      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

      cursor: pointer;

      transition: 0.5s;

      margin-right: 0;
      margin-left: 10px;

      background: ${(props) => (props.active ? "#333" : "#eee")};
      color: ${(props) => (props.active ? "#eeeeee" : "#000000")};
    `
  const ButtonContainer = styled.div`
      display: flex;
      flex-direction: row;
      margin-left: 9%;
    `;

  const Randombutton = styled.div`
      margin-right: 9%;
      display: flex;
    `;
  return (
      <div>
        <GloStyle/>
        <BackButton onClick={() => navigate("/Main")}>
          <img src={back} alt="back" style={{width: "28px"}}/>
        </BackButton>
        <div>
          <h3 style={{textAlign: "left", marginLeft: "9%"}}>많이 입은 옷들</h3>
          {recommendedClothes.length > 0 ? (
              <Container>
                <RowContainer>
                  <div>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                  <div>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "아우터")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
                <RowContainer>
                  <div>
                    {recommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
              </Container>
          ) : (
              <p>추천할 옷이 존재하지 않습니다.</p>
          )}

          <h3 style={{textAlign: "left", marginLeft: "9%"}}>최근 입지 않았던 옷들</h3>
          {fewrecommendedClothes.length > 0 ? (
              <Container>
                <RowContainer>
                  <div>
                    {fewrecommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                  <div>
                    {fewrecommendedClothes
                        .filter((clothes) => clothes.category === "아우터")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
                <RowContainer>
                  <div>
                    {fewrecommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
              </Container>
          ) : (
              <p>추천할 옷이 존재하지 않습니다.</p>
          )}

          <h3 style={{textAlign: "left", marginLeft: "9%"}}>TPO 코디</h3>
          <ButtonContainer>
            <Tpobutton onClick={() => {
              setActiveButton("casual");
              setTpoSubcategories(casualsubcategory)
            }} active={activeButton === "casual"}>캐주얼</Tpobutton>
            <Tpobutton onClick={() => {
              setActiveButton("formal");
              setTpoSubcategories(formalsubcategory)
            }} active={activeButton === "formal"}>포멀</Tpobutton>
          </ButtonContainer>
          {tporecommendedClothes.length > 0 ? (
              <Container>
                <RowContainer>
                  <div>
                    {tporecommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                  <div>
                    {tporecommendedClothes
                        .filter((clothes) => clothes.category === "아우터")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
                <RowContainer>
                  <div>
                    {tporecommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
              </Container>
          ) : (
              <p>추천할 옷이 존재하지 않습니다.</p>
          )}
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <h3 style={{textAlign: "left", marginLeft: "9%"}}>날씨에 맞는 랜덤 추천</h3>
            <Randombutton onClick={handleRandomButtonClick}
                          style={{alignItems: "center"}}>
              <img src={refresh} alt="refresh" style={{width: "28px", height: "28px"}}/>
            </Randombutton>
          </div>
          {randomrecommendedClothes.length > 0 ? (
              <Container>
                <RowContainer>
                  <div>
                    {randomrecommendedClothes
                        .filter((clothes) => clothes.category === "상의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                  <div>
                    {randomrecommendedClothes
                        .filter((clothes) => clothes.category === "아우터")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
                <RowContainer>
                  <div>
                    {randomrecommendedClothes
                        .filter((clothes) => clothes.category === "하의")
                        .slice(0, 1)
                        .map((clothes) => (
                            <Image src={clothes.imageUrl} alt={clothes.id}/>
                        ))}
                  </div>
                </RowContainer>
              </Container>
          ) : (
              <p>추천할 옷이 존재하지 않습니다.</p>
          )}

        </div>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
  );
};

export default ClothingRecommendation;