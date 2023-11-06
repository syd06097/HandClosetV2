// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import axios from "axios";
// import useLogout from "../hooks/useLogout"; // Import useAuth
// import {
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
// } from "@mui/material";
//
// const MyPage = () => {
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
//
//
//     const {
//         logoutDialogOpen,
//         handleLogoutDialogOpen,
//         handleLogoutDialogClose,
//         handleLogout,
//     } = useLogout(); // 커스텀 훅 사용
//
//     useEffect(() => {
//         const handleLoginStatusChange = () => {
//             const loginInfo = localStorage.getItem("loginInfo");
//             if (loginInfo) {
//                 setIsLoggedIn(true);
//             } else {
//                 setIsLoggedIn(false);
//             }
//         };
//
//         // 컴포넌트 마운트 시 초기 로그인 상태 확인
//         handleLoginStatusChange();
//
//         window.addEventListener("loginStatusChanged", handleLoginStatusChange);
//
//         return () => {
//             window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
//         };
//     }, []);
//
//
//     // const handleLogout = async () => {
//     //     const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
//     //     if (loginInfo) {
//     //         try {
//     //             const accessToken = JSON.parse(
//     //                 localStorage.getItem("loginInfo")
//     //             ).accessToken;
//     //             const response = await fetch("http://localhost:8090/members/logout", {
//     //                 method: "DELETE",
//     //                 headers: {
//     //                     "Content-Type": "application/json",
//     //                     Authorization: `Bearer ${accessToken}`,
//     //                 },
//     //                 body: JSON.stringify({
//     //                     refreshToken: localStorage.getItem("loginInfo").refreshToken,
//     //                 }),
//     //             });
//     //             if (response.ok) {
//     //                 localStorage.removeItem("loginInfo");
//     //                 // localStorage.removeItem("isLoggedIn"); // 로그아웃 상태로 변경
//     //                 navigate("/LoginForm"); // 로그인 페이지로 이동
//     //             } else {
//     //                 console.error(response.statusText);
//     //             }
//     //         } catch (error) {
//     //             console.error(error);
//     //         }
//     //     }
//     //
//     // };
//
//
//
//     return (
//         <div>
//             <Container>
//                 {/*<h1>MyPage</h1>*/}
//                 {/*/!*{isLoggedIn ? (*!/*/}
//                 {/*    <Button onClick={handleLogout}>로그아웃</Button>*/}
//                 {/*/!*) : (*!/*/}
//                 {/*    <Button onClick={() => navigate("/LoginForm")}>로그인 하러가기</Button>*/}
//                 {/*/!*)}*!/*/}
//
//
//                 <Button
//
//                     style={{ display: isLoggedIn ? "none" : "block" }}
//                     onClick={() => navigate("/LoginForm")}
//                 >
//                     로그인 하러가기
//                 </Button>
//                 <Button
//
//                     style={{ display: isLoggedIn ? "block" : "none" }}
//                     onClick={handleLogoutDialogOpen}
//                 >
//                     로그아웃 하러가기
//                 </Button>
//
//                 {/* <Button onClick={() => navigate("/MyPage2")}>MyPage2로</Button>*/}
//                 <Dialog
//                     open={logoutDialogOpen}
//                     onClose={handleLogoutDialogClose}
//                     aria-labelledby="logout-dialog-title"
//                     aria-describedby="logout-dialog-description"
//                 >
//                     <DialogTitle id="logout-dialog-title" style={{fontWeight:"bold", fontSize:"20px"}}>로그아웃</DialogTitle>
//                     <DialogContent>
//                         <DialogContentText id="logout-dialog-description">
//                             로그아웃하시겠습니까?
//                         </DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleLogoutDialogClose} color="primary" style={{width:"41%", marginLeft:"6%",marginRight:"6%"}}>
//                             취소
//                         </Button>
//                         <Button onClick={handleLogout} color="primary" autoFocus style={{width:"41%",marginRight:"6%"}}>
//                             확인
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Container>
//         </div>
//     );
// };
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   //align-items: center;
//   //align-items: flex-start;
// `;
// const Button = styled.button`
//   padding: 12px 20px;
//   border: none;
//   border-radius: 4px;
//   margin-bottom: 16px;
//   font-size: 17px;
//   font-weight: bold;
//   cursor: pointer;
//   background-color: #364054;
//   color: #fff;
//   margin-left: 9%;
//   margin-right: 9%;
// `;
//
// export default MyPage;

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
