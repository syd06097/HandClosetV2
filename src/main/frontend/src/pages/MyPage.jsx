

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import useLogout from "../hooks/useLogout";
import profile from "../images/profile.png";
import woman from "../images/woman.png";

const MyPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const { handleLogout } = useLogout(); // 커스텀 훅 사용
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const [userName, setUserName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [clothesCount, setClothesCount] = useState(0);
  const [diaryCount, setDiaryCount] = useState(0);
  const [gender, setGender] = useState("M");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserName, setEditedUserName] = useState(""); // 수정된 사용자 이름
  const [editedGender, setEditedGender] = useState(""); // 수정된 성별

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
          setMemberId(response.data.memberId);
          setGender(response.data.gender);
        } catch (error) {
          // 에러 처리
          console.error("Failed to fetch user information", error);
        }
      }
      const fetchClothesCount = async () => {
        try {
          const response = await axios.get("/api/clothing/count", {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
              data: { refreshToken: loginInfo.refreshToken },
            },
          });
          console.log(response.data);
          setClothesCount(response.data);
          console.log(clothesCount);
        } catch (error) {
          console.error("Failed to fetch clothes count", error);
        }
      };

      const fetchDiaryCount = async () => {
        try {
          const response = await axios.get("/api/diary/count", {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
              data: {refreshToken: loginInfo.refreshToken},
            },
          });
          console.log(response.data);
          setDiaryCount(response.data);
          console.log(diaryCount);
        } catch (error) {
          console.error("Failed to fetch diary count", error);
        }
      };

      // 두 개의 API를 호출하는 함수들을 호출
      fetchUserInfo().then(() => {
        fetchClothesCount();
        fetchDiaryCount();
      });
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


  const handleDeleteAccount = async () => {
    if (!memberId) {
      console.error("Member ID not available");
      return;
    }
    const userConfirmed = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
    if (userConfirmed) {
      try {
        // 서버로 회원 탈퇴 요청
        await axios.delete(`/members/${memberId}`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          data: {refreshToken: loginInfo.refreshToken},
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
  }

  const handleEditProfile = async () => {
    try {
      // 서버로 수정된 정보 전송
      await axios.put("/members/update", {
        memberId: memberId,
        editedUserName: editedUserName,
        editedGender: editedGender,
      }, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        data: {refreshToken: loginInfo.refreshToken},
      });

      // 수정 완료 후 상태 업데이트
      setUserName(editedUserName);
      setGender(editedGender);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      // 에러 처리 로직 추가
    }
  };

  return (
    <div>
      <Container>
        {isLoggedIn && (
            <div>
              <UserImage
                  src={gender === "F" ? woman : profile}
                  alt="clothes"
              />
              <UserName>{userName}</UserName>
              <UserDetail>
                <DataContainer1>
                  소장옷 <span style={{ fontWeight: 'bold', fontSize:"21px" }}>{clothesCount}개</span>
                </DataContainer1>
                <DataContainer2>
                  다이어리 <span style={{ fontWeight: 'bold' , fontSize:"21px"}}>{diaryCount}개</span>
                </DataContainer2>
              </UserDetail>

            </div>
        )}
        {/*로그인 / 로그아웃 버튼 로직*/}
        {/*<Button*/}
        {/*  style={{ display: isLoggedIn ? "none" : "block" }}*/}
        {/*  onClick={() => navigate("/LoginForm")}*/}
        {/*>*/}
        {/*  로그인 하러가기*/}
        {/*</Button>*/}
        <Button
          style={{ display: isLoggedIn ? "block" : "none" }}
          onClick={handleLogout}
        >
          로그아웃 하러가기
        </Button>
        {/*회원 탈퇴 로직*/}
        <hr style={{ border: "0", height: "1px", background: "#ccc", marginLeft:"9%", marginRight:"9%"}}/>
        <Button onClick={() => setIsEditing(true)}>회원 정보 수정</Button>
        {isEditing && (
            <>
              {/* 배경 어둡게 처리 */}
              <Backdrop />

              {/* 회원 정보 수정 팝업 */}
              <EditProfilePopup>
                {/* 사용자 이름 수정 필드 */}
                <EditField>

                  <input
                      type="text"
                      // value={editedUserName}
                      defaultValue={userName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                  />
                </EditField>

                {/* 성별 수정 필드 */}
                <EditField>

                  <select
                      // value={editedGender}
                      defaultValue={gender}
                      onChange={(e) => setEditedGender(e.target.value)}
                  >
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </EditField>

                <ButtonRow>
                  <ButtonLeft onClick={() => handleEditProfile()}>수정 완료</ButtonLeft>
                  <ButtonRight onClick={() => setIsEditing(false)}>취소</ButtonRight>
                </ButtonRow>
              </EditProfilePopup>
            </>
        )}
        <hr style={{ border: "0", height: "1px", background: "#ccc", marginLeft:"9%", marginRight:"9%"}}/>
        <Button
            onClick={handleDeleteAccount}
        >
          탈퇴하기
        </Button>
        <hr style={{ border: "0", height: "1px", background: "#ccc", marginLeft:"9%", marginRight:"9%"}}/>

      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserImage = styled.img`
  width: 140px;
  height: 140px;
  text-align: center;
  display: block;
  margin: 16% auto 7%;
`;

const UserName = styled.span`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-bottom: 11%;
`;
const UserDetail = styled.div`
  display: flex;
  justify-content: space-between;
  border: 2px solid #ccc;
  color: gray;
  border-radius: 5px;
  margin-left: 9%;
  margin-right: 9%;
  margin-bottom: 7%;
  height: 50px;
  align-items: center;
`;

const DataContainer1 = styled.div`
  font-size: 17px;
  width: 50%;
  text-align: center;
`;
const DataContainer2 = styled.div`
  font-size: 17px;
  width: 50%;
  text-align: center;
`;
const Button = styled.button`
  //padding: 12px 20px;
  border: none;
  //border-radius: 4px;
  margin-Top: 3px;
  margin-Bottom: 3px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  background-color: white;
  //color: #fff;
  color: gray;
  margin-left: 9%;
  //margin-right: 9%;
  text-align: left;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 색상 및 투명도 조절 */
  z-index: 998; /* 모달보다 앞에 나타나게 하기 */
`;

const EditProfilePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 999;
  padding: 50px 10px;
  flex-direction: column;
`;

const EditField = styled.div`
  margin-bottom: 10px;
  input{
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 88%;
    margin-bottom: 10px;
  }
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    margin-bottom: 10px;
    
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
  text-align: center;
`;

const ButtonLeft = styled.button`
  border: none;
  margin-Top: 3px;
  margin-Bottom: 3px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  background-color: white;
  color: gray;
  margin-left: 9%;
  text-align: left;
`;

const ButtonRight = styled.button`
  border: none;
  margin-Top: 3px;
  margin-Bottom: 3px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  background-color: white;
  color: gray;
  margin-right: 9%;
  text-align: right;
`;


export default MyPage;
