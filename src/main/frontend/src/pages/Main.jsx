
// import React, { useEffect, useState } from "react";
// import axios from 'axios';
//
// const Main = () => {
//     const [latitude, setLatitude] = useState(null);
//     const [longitude, setLongitude] = useState(null);
//     const [statistics, setStatistics] = useState([]);
//
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setLatitude(position.coords.latitude);
//                     setLongitude(position.coords.longitude);
//                 },
//                 (error) => {
//                     console.error("Error getting geolocation:", error);
//                 }
//             );
//         } else {
//             console.error("Geolocation is not supported by this browser.");
//         }
//     }, []);
//
//     useEffect(() => {
//         const fetchStatistics = async () => {
//             try {
//                 const response = await axios.get("/api/clothing/category-item-count");
//                 const data = response.data;
//                 setStatistics(Object.entries(data));
//             } catch (error) {
//                 console.error("Error fetching statistics:", error);
//             }
//         };
//
//         fetchStatistics();
//     }, []);
//
//     const categories = [
//         { name: "상의", subcategories: ["민소매", "반팔티", "긴팔티", "블라우스/셔츠", "맨투맨/후디", "니트", "기타"] },
//         { name: "하의", subcategories: ["반바지", "치마", "면바지", "슬랙스", "청바지", "트레이닝/조거", "기타"] },
//         { name: "아우터", subcategories: ["트렌치 코드", "코트", "자켓/점퍼", "야상", "무스탕", "패딩", "후드집업", "가디건/베스트", "기타"] },
//         { name: "원피스", subcategories: ["미니 원피스", "미디 원피스", "맥시 원피스", "기타"] },
//         { name: "신발", subcategories: ["운동화", "구두", "부츠", "샌들", "기타"] },
//         { name: "가방", subcategories: ["백팩", "숄더/토트백", "크로스백", "클러치", "기타"] },
//         { name: "악세사리", subcategories: ["모자", "양말", "쥬얼리/시계", "머플러/스카프", "벨트", "기타"] },
//         { name: "기타", subcategories: ["이너웨어", "잠옷", "수영복"] }
//     ];
//
//     return (
//         <div>
//             <h1>Main</h1>
//             {latitude && longitude && (
//                 <p>
//                     Your current location: {latitude}, {longitude}
//                 </p>
//             )}
//
//             <h2>Statistics</h2>
//             <ul>
//                 {categories.map((category) => (
//                     <li key={category.name}>
//                         {category.name}:{" "}
//                         {category.subcategories.reduce((total, subcategory) => {
//                             const categoryKey = category.name + "-" + subcategory;
//                             const itemCount = statistics.find((item) => item[0] === categoryKey);
//                             return total + (itemCount ? itemCount[1] : 0);
//                         }, 0)}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default Main;

import React, { useEffect, useState } from "react";
import axios from 'axios';
const Main = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cityCode, setCityCode] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

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
      const lang = 'kr'
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY
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

  const convertToEnglishCityCode = (koreanCityCode) => {
    const cityCodeMap = {
      "서울특별시": "Seoul",
      "부산광역시": "Busan",
      "세종특별자치시" : "Sejong",
      "인천광역시" : "Incheon",
      "광주광역시" : "Gwangju",
      "대구광역시" : "Daegu",
      "울산광역시" : "Ulsan",
      "경기도" : "Gyeonggi-do",
      "강원도" : "Ganwon-do",
      "충청북도" : "Chungcheongbuk-do",
      "충청남도" : "Chungcheongnam-do",
      "전라남도" : "Jeollanam-do",
      "전라북도" : "Jeollabuk-do",
      "경상남도" : "Gyeongsangnam-do",
      "경상북도" : "Gyeongsangbuk-do",
      "제주특별자치도" : "Jeju"
    };

    return cityCodeMap[koreanCityCode] || koreanCityCode;
  };

  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  };

  return (
      <div>
        <h1>Main</h1>
        {latitude && longitude && cityCode && (
            <p>
              현재 도시: {cityCode}
            </p>
        )}
        {weatherData && (
            <div>
              <p>{weatherData.name}, {weatherData.sys.country} 의 날씨</p>
              <p>날씨: {weatherData.weather[0].description}</p>
              <p>기온: {Math.round(weatherData.main.temp)}°C</p>
              <p>습도: {weatherData.main.humidity}%</p>
              <p>구름: {weatherData.clouds.all}%</p>
              <p>풍속: {weatherData.wind.speed} m/s</p>
              <img src={getWeatherIconUrl(weatherData.weather[0].icon)} alt="Weather Icon" />
            </div>
        )}
      </div>
  );
};

export default Main;
