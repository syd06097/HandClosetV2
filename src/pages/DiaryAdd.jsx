import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";
import styled from "styled-components";
import update from "../images/update.png";
import axios from "axios";
import check from "../images/check.png";
const DiaryAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  // const selectedDate = searchParams.get("selectedDate");
  const selectedDateUTC = new Date(searchParams.get("selectedDate"));

  // 날짜 출력 시 시간대 변환
  const formattedDate = selectedDateUTC.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

  const [season, setSeason] = useState([]);
  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value;
    setSeason((prevSeasons) => {
      if (prevSeasons.includes(selectedSeason)) {
        return prevSeasons.filter((season) => season !== selectedSeason);
      } else {
        return [...prevSeasons, selectedSeason];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (season.length === 0) {
      alert("적어도 하나의 계절을 선택해주세요.");
    } else {
      let season_str = season ? season.join() : "";
      const formData = new FormData();
      formData.append("season", season_str);
      formData.append("date", formattedDate);

      for (let key of formData.keys()) {
        console.log(key, ":", formData.get(key));
      }
      console.log(formattedDate);
      try {
        const response = await axios.post("/api/diary", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        navigate(`/Diary`);
      }
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/Closet")}>
          <img src={back} alt="back" style={{ width: "28px" }} />
        </BackButton>
        <SubmitButton onClick={handleSubmit}>
          <img src={check} alt="check" style={{ width: "28px" }} />
        </SubmitButton>
      </Header>
      {/*<h2>Add Diary Entry for: {selectedDate}</h2>*/}
      <h2>Add Diary Entry for: {formattedDate}</h2>
      {/* Diary 추가 폼 또는 컴포넌트를 표시할 수 있습니다. */}
      <div>
        <label>
          <input
            type="checkbox"
            value="봄"
            checked={season.includes("봄")}
            onChange={handleSeasonChange}
          />
          봄
        </label>
        <label>
          <input
            type="checkbox"
            value="여름"
            checked={season.includes("여름")}
            onChange={handleSeasonChange}
          />
          여름
        </label>
        <label>
          <input
            type="checkbox"
            value="가을"
            checked={season.includes("가을")}
            onChange={handleSeasonChange}
          />
          가을
        </label>
        <label>
          <input
            type="checkbox"
            value="겨울"
            checked={season.includes("겨울")}
            onChange={handleSeasonChange}
          />
          겨울
        </label>
      </div>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
`;

const BackButton = styled.div`
  margin-top: 25px;
  margin-left: 9%;
`;
const SubmitButton = styled.div`
  margin-top: 25px;
  margin-right: 9%;
`;
export default DiaryAdd;
