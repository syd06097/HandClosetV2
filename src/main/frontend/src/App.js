import { Route, Routes } from "react-router-dom";
import React, { useEffect,useState } from "react";
import "./App.css";
import Main from "./pages/Main";
import Diary from "./pages/Diary";
import MyPage from "./pages/MyPage";
import Closet from "./pages/Closet";
import ClothingForm from "./pages/ClothingForm";
import BottomNav from "./BottomNav";
import ClothesDetail from "./pages/ClothesDetail";
import ItemHave from "./pages/ItemHave";
import ItemSeason from "./pages/ItemSeason";
import ClothingRecommendation from "./pages/ClothingRecommendation";
import ItemFrequently from "./pages/ItemFrequently";
import ItemNotRecently from "./pages/ItemNotRecently";
import ClothingUpdateForm from "./pages/ClothingUpdateForm";
import DiaryAdd from "./pages/DiaryAdd";
import DiaryDetail from "./pages/DiaryDetail";
import LoginForm from "./pages/LoginForm";
import JoinForm from "./pages/JoinForm";
import AdminPage from "./pages/AdminPage";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import myAxios from "./utils/myaxios"; // 추가된 코드

function App() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(1);
  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));





      if (loginInfo) {
        const { accessToken, refreshToken } = loginInfo; // 수정된 코드

        try {
          const response = await myAxios.post(
            "/members/refreshToken",
            { refreshToken }, // refreshToken을 별도의 객체로 보냅니다.
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const loginInfo = response.data;
          localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        } catch (error) {
          console.error(error);

          // 오류가 발생하면 local storage를 삭제하고 홈 페이지로 이동
          // 수정된 코드
          localStorage.removeItem("loginInfo");
          window.dispatchEvent(new CustomEvent("loginStatusChanged"));
          navigate("/LoginForm");
        }
      }
    }, 15 * 60 * 1000); // 15분마다 실행

    // 컴포넌트가 언마운트 될 때 인터벌을 정리
    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);

  return (
    <div className="App">
      {/*<BottomNav />*/}
      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/Closet" element={<Closet />} />
        <Route path="/ItemHave" element={<ItemHave />}  />
        <Route path="/ItemSeason" element={<ItemSeason />} />
        <Route path="/ItemFrequently" element={<ItemFrequently />} />
        <Route path="/ItemNotRecently" element={<ItemNotRecently />} />
        <Route path="/ClothingForm" element={<ClothingForm />} />
        <Route path="/clothes/:id" element={<ClothesDetail />} />
        <Route
          path="/ClothingRecommendation"
          element={<ClothingRecommendation />}
        />
        <Route
          path="/ClothingUpdateForm/:id"
          element={<ClothingUpdateForm />}
        />
        <Route path="/DiaryAdd" element={<DiaryAdd />} />
        <Route path="/DiaryDetail/:id" element={<DiaryDetail />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/JoinForm" element={<JoinForm />} />
        <Route path="/AdminPage" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
