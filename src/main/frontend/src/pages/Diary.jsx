// import React from "react";
//
// const Calendar = () => {
//   return (
//     <div>
//       <h1>Calendar</h1>
//     </div>
//   );
// };
//
// export default Calendar;

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import back from "../images/back.png";
import update from "../images/update.png";
import {useNavigate} from "react-router-dom";

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
    background-color: red !important; // 오늘 날짜의 배경색을 빨간색으로 변경
    color: white !important; // 오늘 날짜의 텍스트 색상을 흰색으로 변경
  }
  .react-calendar__tile--active {
    background-color: blue !important; // 선택한 날짜의 배경색을 파란색으로 변경
    color: white !important; // 선택한 날짜의 텍스트 색상을 흰색으로 변경
  }
  .react-calendar__tile--now {
    &.react-calendar__tile--active {
      background-color: blue !important; // 오늘 날짜를 선택한 경우 파란색으로 변경
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
  font-size: 40px;
`;

const Diary = () => {
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    return (
        <div>
            <Header>
                <PlusButton onClick={() => navigate("/Main")}>
                    +
                </PlusButton>
            </Header>
            <CustomCalendar onChange={onChange} value={value} />
        </div>
    );
};

export default Diary;