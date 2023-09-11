import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
//images
import blanket from "../images/category/blanket.png";
import cardigan from "../images/category/cardigan.png";
import coat from "../images/category/coat.png";
import cottonPants from "../images/category/cottonPants.png";
import dress from "../images/category/dress.png";
import fieldJacket from "../images/category/fieldJacket.png";
import hoodedJacket from "../images/category/hoodedJacket.png";
import muffler from "../images/category/muffler.png";
import mustang from "../images/category/mustang.png";
import neat from "../images/category/neat.png";
import puffer from "../images/category/puffer.png";
import shirt from "../images/category/shirt.png";
import shorts from "../images/category/shorts.png";
import shortSleeve from "../images/category/shortSleeve.png";
import slacks from "../images/category/slacks.png";
import sleeve from "../images/category/sleeve.png";
import sleeveless from "../images/category/sleeveless.png";
import stockings from "../images/category/stockings.png";
import trenchCoat from "../images/category/trenchCoat.png";
import jeans from "../images/category/jeans.png";
import jacket from "../images/category/jacket.png";
import mantoman from "../images/category/mantoman.png";

const Main = () => {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cityCode, setCityCode] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [koreanCityCode, setKoreanCityCode] = useState(null);
  const [recommendedSubcategory, setRecommendedSubcategory] = useState([]);
  const [recommendedCategoryImages, setRecommendedCategoryImages] = useState(
    []
  );
  const [recommendDataSubcategory, setRecommendDataSubcategory] = useState([]);

  useEffect(() => {
    // 위치 정보 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      // Reverse Geocoding을 사용하여 도시 코드 가져오기
      const geocodingUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;

      fetch(geocodingUrl, {
        headers: {
          Authorization: process.env.REACT_APP_KAKAO_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.documents.length > 0) {
            const koreanCityCode = data.documents[0].region_1depth_name;
            const cityCode = convertToEnglishCityCode(koreanCityCode);
            setCityCode(cityCode);
            setKoreanCityCode(koreanCityCode);
          }
        })
        .catch((error) => {
          console.error("Error reverse geocoding:", error);
        });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (cityCode) {
      // OpenWeatherMap API를 사용하여 날씨 정보 가져오기
      const lang = "kr";
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityCode}&appid=${apiKey}&units=metric&lang=${lang}`;

      fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [cityCode]);

  useEffect(() => {
    // 기온에 따른 추천 서브 카테고리 설정
    if (weatherData) {
      //임시 지정
      const temperature = Math.round(10);
      // const temperature = Math.round(weatherData.main.temp);
      const strCategory = getRecommendedCategory(temperature);
      const recommendedCategory = strCategory.split(",");
      const dataSub = getRecommendedCategorySituation(temperature);
      const dataSubcategory = dataSub.split(",");

      setRecommendDataSubcategory(dataSubcategory);
      setRecommendedSubcategory(recommendedCategory);
    }
  }, [weatherData]);

  useEffect(() => {
    // 서브카테고리에 따른 이미지와 카테고리 이름을 업데이트합니다.
    const categoryData = mapSubcategoryToData(recommendedSubcategory);
    setRecommendedCategoryImages(categoryData);
  }, [recommendedSubcategory]);

  const convertToEnglishCityCode = (koreanCityCode) => {
    const cityCodeMap = {
      서울특별시: "Seoul",
      부산광역시: "Busan",
      세종특별자치시: "Sejong",
      인천광역시: "Incheon",
      광주광역시: "Gwangju",
      대구광역시: "Daegu",
      울산광역시: "Ulsan",
      경기도: "Gyeonggi-do",
      강원도: "Ganwon-do",
      충청북도: "Chungcheongbuk-do",
      충청남도: "Chungcheongnam-do",
      전라남도: "Jeollanam-do",
      전라북도: "Jeollabuk-do",
      경상남도: "Gyeongsangnam-do",
      경상북도: "Gyeongsangbuk-do",
      제주특별자치도: "Jeju",
    };

    return cityCodeMap[koreanCityCode] || koreanCityCode;
  };

  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const getRecommendedCategory = (temperature) => {
    if (temperature >= 28) {
      return "민소매,반팔티,원피스,반바지";
    } else if (temperature >= 23) {
      return "반팔티,셔츠,반바지,면바지";
    } else if (temperature >= 20) {
      return "가디건,긴팔티,면바지,청바지";
    } else if (temperature >= 17) {
      return "니트,맨투맨,가디건,청바지";
    } else if (temperature >= 12) {
      return "자켓,가디건,후드집업,스타킹";
    } else if (temperature >= 9) {
      return "자켓,트렌치코트,야상,니트";
    } else if (temperature >= 5) {
      return "코트,무스탕,니트,슬랙스";
    } else {
      return "패딩,코트,목도리,기모제품";
    }
  };

  const getRecommendedCategorySituation = (temperature) => {
    if (temperature >= 28) {
      return "민소매,반팔티,반바지,치마,슬랙스,청바지";
    } else if (temperature >= 23) {
      return "반팔티,블라우스/셔츠,반바지,면바지,치마,슬랙스,청바지,트레이닝/조거";
    } else if (temperature >= 20) {
      return "가디건,블라우스/셔츠,긴팔티,면바지,청바지,치마,슬랙스,청바지,트레이닝/조거";
    } else if (temperature >= 17) {
      return "니트,블라우스/셔츠,긴팔티,맨투맨/후디,가디건,청바지,치마,슬랙스,면바지,청바지,트레이닝/조거,가디건/베스트,블레이저";
    } else if (temperature >= 12) {
      return "자켓/점퍼,트렌치코트,가디건/베스트,야상,후드집업,맨투맨/후디,니트,슬랙스,면바지,청바지,트레이닝/조거,블레이저";
    } else if (temperature >= 9) {
      return "자켓/점퍼,트렌치코트,후드집업,야상,맨투맨/후디,니트,슬랙스,면바지,청바지,트레이닝/조거";
    } else if (temperature >= 5) {
      return "코트,무스탕,니트,맨투맨/후디,슬랙스,면바지,청바지,트레이닝/조거";
    } else {
      return "패딩,무스탕,코트,니트,맨투맨/후디,슬랙스,면바지,청바지,트레이닝/조거";
    }
  };

  const mapSubcategoryToData = (subcategories) => {
    const categoryData = [];

    subcategories.forEach((subcategory) => {
      switch (subcategory.trim()) {
        case "민소매":
          categoryData.push({ subcategory: "민소매", image: sleeveless });
          break;
        case "반팔티":
          categoryData.push({ subcategory: "반팔티", image: shortSleeve });
          break;
        case "긴팔티":
          categoryData.push({ subcategory: "긴팔티", image: sleeve });
          break;
        case "원피스":
          categoryData.push({ subcategory: "원피스", image: dress });
          break;
        case "반바지":
          categoryData.push({ subcategory: "반바지", image: shorts });
          break;
        case "가디건":
          categoryData.push({ subcategory: "가디건", image: cardigan });
          break;
        case "니트":
          categoryData.push({ subcategory: "니트", image: neat });
          break;
        case "자켓":
          categoryData.push({ subcategory: "자켓", image: jacket });
          break;
        case "코트":
          categoryData.push({ subcategory: "코트", image: coat });
          break;
        case "패딩":
          categoryData.push({ subcategory: "패딩", image: puffer });
          break;
        case "야상":
          categoryData.push({ subcategory: "야상", image: fieldJacket });
          break;
        case "맨투맨":
          categoryData.push({ subcategory: "맨투맨", image: mantoman });
          break;
        case "무스탕":
          categoryData.push({ subcategory: "무스탕", image: mustang });
          break;
        case "셔츠":
          categoryData.push({ subcategory: "셔츠", image: shirt });
          break;
        case "스타킹":
          categoryData.push({ subcategory: "스타킹", image: stockings });
          break;
        case "트렌치코트":
          categoryData.push({ subcategory: "트렌치코트", image: trenchCoat });
          break;
        case "슬랙스":
          categoryData.push({ subcategory: "슬랙스", image: slacks });
          break;
        case "목도리":
          categoryData.push({ subcategory: "목도리", image: muffler });
          break;
        case "후드집업":
          categoryData.push({ subcategory: "후드집업", image: hoodedJacket });
          break;
        case "면바지":
          categoryData.push({ subcategory: "면바지", image: cottonPants });
          break;
        case "기모제품":
          categoryData.push({ subcategory: "기모제품", image: blanket });
          break;
        case "청바지":
          categoryData.push({ subcategory: "청바지", image: jeans });
          break;
        // 다른 카테고리에 대한 이미지 처리...
        default:
          break;
      }
    });

    return categoryData;
  };

  return (
    <div>
      <GlobalStyle />
      {weatherData && (
        <>
          <WeatherWidgetBox>
            <Widget>
              <Left>
                <Icon
                  src={getWeatherIconUrl(weatherData.weather[0].icon)}
                  alt="Weather Icon"
                ></Icon>
                <WeatherStatus>
                  {weatherData.weather[0].description}
                </WeatherStatus>
              </Left>
              <Right>
                <City>{koreanCityCode}</City>
                <Degree>{Math.round(weatherData.main.temp)}°C</Degree>
              </Right>
              <Bottom>
                <Desdiv>
                  풍속 <span>{weatherData.wind.speed} m/s</span>
                </Desdiv>
                <Desdiv>
                  구름 <span>{weatherData.clouds.all}%</span>
                </Desdiv>
                <Desdiv>
                  습도 <span>{weatherData.main.humidity}%</span>
                </Desdiv>
              </Bottom>
            </Widget>
          </WeatherWidgetBox>
        </>
      )}

      <Container>
        {recommendedCategoryImages.length > 0 && (
          <ImageContainer>
            {recommendedCategoryImages.map((categoryData, index) => (
              <div key={index}>
                <ImageWrapper>
                  <img src={categoryData.image} alt="Recommended Clothing" />
                  <p>{categoryData.subcategory}</p>
                </ImageWrapper>
              </div>
            ))}
          </ImageContainer>
        )}

        <div
          style={{
            backgroundColor: "#364054",
            borderRadius: "3px",
            width: "81%",
            padding: "3px",
            color: "white",
          }}
          onClick={() => {
            navigate("/ClothingRecommendation", {
              state: { subcategories: recommendDataSubcategory },
            });
          }}
        >
          <h4>오늘 입을 스타일을 추천 해줄게요!</h4>
        </div>

        <ButtonContainer>
          <Button onClick={() => navigate("/ItemHave")}>
            옷장 속 가장 많은
            <br />
            아이템
          </Button>
          <Button onClick={() => navigate("/ItemSeason")}>
            계절 별 아이템
            <br />
            개수
          </Button>
          <Button onClick={() => navigate("/ItemFrequently")}>
            가장 자주 입은
            <br />
            아이템
          </Button>
          <Button onClick={() => navigate("/ItemNotRecently")}>
            요즘 입지 않은
            <br />
            아이템
          </Button>
        </ButtonContainer>
      </Container>
    </div>
  );
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;600&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  margin-bottom: 100px;
  color: #333;
`;

const ButtonContainer = styled.div`
  width: 82%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: #efefef;
  border-radius: 8px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 15px;
`;

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 20px;

  img {
    width: 65%;
    height: auto;
    opacity: 90%;
  }

  p {
    text-align: center;
    font-size: 14px;
    padding-bottom: 10px;
    color: #333;
  }
`;
const ImageWrapper = styled.div`
  border-radius: 5px;
  padding-top: 10px;

  box-shadow: 2px 2px 2px 2px #efefef;
  margin-bottom: 20px;
`;

const WeatherWidgetBox = styled.div`
  position: relative;
`;

const Widget = styled.div`
  width: 100%;
  height: 200px;
`;

const Left = styled.div`
  position: absolute;
  left: 0;
  width: 200px;
`;
const Right = styled.div`
  position: absolute;
  right: 0;
  width: 200px;
  /*color: rgb(54, 64, 84);*/
  color: #333;
  margin: 50px 0;
`;
const Icon = styled.img`
  width: 75%;
  margin-bottom: -30px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const WeatherStatus = styled.h5`
  /*color: rgb(54, 64, 84);*/
  color: #333;
  text-align: center;
  margin-top: 0;
`;

const City = styled.h5`
  font-size: 1em;
  text-align: center;
  margin: 0;
`;

const Degree = styled.h5`
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

const Bottom = styled.div`
  width: 100%;
  position: absolute;
  bottom: 10px;
  display: inline-flex;
  justify-content: center;
  /*color: rgb(54, 64, 84);*/
  color: #333;
  left: 1px;
`;

const Desdiv = styled.div`
  margin: 5px 10px 5px 10px;
  text-align: center;
  line-height: 100%;
  font-size: 0.83em;
  font-weight: bold;
`;
export default Main;
