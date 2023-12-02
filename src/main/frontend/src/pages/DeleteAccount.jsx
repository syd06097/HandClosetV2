import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import back from "../images/back.png";

import styled from "styled-components";

const DeleteAccount = () => {

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [memberId, setMemberId] = useState("");

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
                    console.log(response.data);
                    setUserName(response.data.name);
                    setMemberId(response.data.memberId);
                } catch (error) {
                    // 에러 처리
                    console.error("Failed to fetch user information", error);
                }
            }
            fetchUserInfo();
        }
    }, []);

    const handleDeleteAccount = async () => {
        if (!memberId) {
            console.error("Member ID not available");
            return;
        }
        try {
            // 서버로 회원 탈퇴 요청
            await axios.delete(`/members/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${loginInfo.accessToken}`,
                },
                data: { refreshToken: loginInfo.refreshToken },
            });

            // 로컬 스토리지에서 로그인 정보 삭제
            localStorage.removeItem("loginInfo");
            alert("회원 탈퇴 완료");
            // 이후 로그인 페이지로 이동 또는 다른 로직 수행
            navigate("/LoginForm");
        } catch (error) {
            console.error("Failed to delete account", error);
            // 에러 처리 로직 추가
        }
    }
    return (
        <div>
            <Container>
            <Header>
                <BackButton onClick={() => navigate("/Diary")}>
                    <img src={back} alt="back" style={{ width: "26px" }} />
                </BackButton>
            </Header>
                {/*템플릿 문자열을 사용하려면 백틱()을 사용*/}
                <Text>
                    <h2>{`${userName}님 회원 탈퇴를 진행하시겠습니까?`}</h2>
                    <h3>그동안 등록한 정보가 모두 삭제되며 복구할 수 없습니다.</h3>
                </Text>
                <Button onClick={handleDeleteAccount}>
                        회원 탈퇴하기
                </Button>
            </Container>
        </div>
    );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 26px;
  margin-left: 9%;
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
const Text = styled.text`
font-size: 30px;
    
`;

export default DeleteAccount;