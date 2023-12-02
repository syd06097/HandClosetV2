

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import useLogout from "../hooks/useLogout"; // Import useAuth

const MyPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const { handleLogout } = useLogout(); // 커스텀 훅 사용
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }else {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("/members/info", {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
            data: { refreshToken: loginInfo.refreshToken },
          }); // 서버에서 사용자 정보 가져오기

          setUserName(response.data.name);
        } catch (error) {
          // 에러 처리
          console.error("Failed to fetch user information", error);
        }
      }
      fetchUserInfo();
    }
    }, []);

  useEffect(() => {

    const handleLoginStatusChange = () => {
      const loginInfo = localStorage.getItem("loginInfo");
      if (loginInfo) {
        const { accessToken, refreshToken } = JSON.parse(loginInfo);

        // 토큰 만료 여부 확인
        const isTokenExpired = Date.now() > new Date(accessToken.exp * 1000);

        if (isTokenExpired) {
          // 만료된 토큰인 경우 로그아웃 처리
          localStorage.removeItem("loginInfo");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    // 컴포넌트 마운트 시 초기 로그인 상태 확인
    handleLoginStatusChange();

    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  return (
    <div>
      <Container>
        {/*마이페이지_2 이동 로직*/}
        {isLoggedIn
            ? `안녕하세요, ${loginInfo ? userName : ""}님!`
            : null}
        {/*로그인 / 로그아웃 버튼 로직*/}
        <Button
          style={{ display: isLoggedIn ? "none" : "block" }}
          onClick={() => navigate("/LoginForm")}
        >
          로그인 하러가기
        </Button>
        <Button
          style={{ display: isLoggedIn ? "block" : "none" }}
          onClick={handleLogout}
        >
          로그아웃 하러가기
        </Button>
        {/*회원 탈퇴 로직*/}
        <Button
            onClick={() => navigate("/DeleteAccount")}
        >
          탈퇴하기
        </Button>
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  //align-items: flex-start;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  background-color: #364054;
  color: #fff;
  margin-left: 9%;
  margin-right: 9%;
`;

export default MyPage;
