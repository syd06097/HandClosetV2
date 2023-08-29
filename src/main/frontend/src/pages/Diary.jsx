

import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import DiaryThumbnail from "../components/DiaryThumbnail";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomCalendar = styled(Calendar)`
  margin-top: 25px;
  border: none; // 달력의 border를 없애기
  width: 100%; // 달력의 너비를 화면에 꽉 차게 설정하기

  .react-calendar__navigation__label {
    font-size: 23px; // 현재 년, 월의 폰트 크기를 조정
    font-weight: bold;
    color: #364054;
  }
  .react-calendar__tile--now {
    background-color: #FFA7A7 !important; // 오늘 날짜의 배경색을 빨간색으로 변경
    color: white !important; // 오늘 날짜의 텍스트 색상을 흰색으로 변경
  }
  .react-calendar__tile--active {
    background-color: #B2CCFF !important; // 선택한 날짜의 배경색을 파란색으로 변경
    color: white !important; // 선택한 날짜의 텍스트 색상을 흰색으로 변경
  }
  .react-calendar__tile--now {
    &.react-calendar__tile--active {
      background-color: #B2CCFF !important; // 오늘 날짜를 선택한 경우 파란색으로 변경
      color: white !important; // 선택한 날짜의 텍스트 색상을 흰색으로 변경
    }
 
`;
const Header = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
  justify-content: flex-end;
`;

const PlusButton = styled.div`
  margin-top: 23px;
  margin-right: 9%;
  font-size: 45px;
`;

const Diary = () => {
  const [value, onChange] = useState(new Date());
  const navigate = useNavigate();
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Fetch diary entries from API and update the state
    axios.get("/api/diary/entries").then((response) => {
      setDiaryEntries(response.data);
    });
  }, []);

  const tileContent = ({ date, view }) => {
    // Check if there's a diary entry for the current date
    const hasDiaryEntry = diaryEntries.some(
        (entry) =>
            new Date(entry.date).getDate() === date.getDate() &&
            new Date(entry.date).getMonth() === date.getMonth() &&
            new Date(entry.date).getFullYear() === date.getFullYear()
    );

    if (hasDiaryEntry) {
      return <div style={{
        backgroundColor: "#364054",
        borderRadius: "50%",
        width: "6px",
        height: "6px",
        top: "5px", // 위치 조정
        position: "relative", // 위치 조정을 위한 position 설정
        margin: "auto", // 수평 가운데 정렬


      }}></div>;
    }
    return <div style={{

      width: "6px",
      height: "6px",
      top: "5px", // 위치 조정
      position: "relative", // 위치 조정을 위한 position 설정
      margin: "auto", // 수평 가운데 정렬


    }}></div>;
  };

  const handleAddDiary = () => {
    // 선택한 날짜를 UTC 시간대로 변환하여 URL에 포함시킴
    const selectedDateUTC = new Date(
      Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
    );

    navigate(
      `/DiaryAdd?selectedDate=${encodeURIComponent(
        selectedDateUTC.toISOString()
      )}`
    );
  };

  const handleDateClick = (value) => {
    setSelectedDate(value); // Update selectedDate state when a date is clicked
  };

  return (
    <div>
      <Header>
        <PlusButton onClick={handleAddDiary}>+</PlusButton>
      </Header>
      <CustomCalendar onChange={onChange} value={value} tileContent={tileContent}  onClickDay={handleDateClick} />
      <hr/>
      {selectedDate && <DiaryThumbnail selectedDate={selectedDate} />} {/* Render DiaryEntryDetails if a date is selected */}
      <hr/>
    </div>
  );
};

export default Diary;
