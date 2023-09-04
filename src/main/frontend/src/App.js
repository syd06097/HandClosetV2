import {Route, Routes} from "react-router-dom";

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
function App() {
    return (
        <div className="App">

            <BottomNav/>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/Closet" element={<Closet />} />
          <Route path="/ItemHave" element={<ItemHave />} />
          <Route path="/ItemSeason" element={<ItemSeason />} />
        <Route path="/ItemFrequently" element={<ItemFrequently />} />
        <Route path="/ItemNotRecently" element={<ItemNotRecently />} />
        <Route path="/ClothingForm" element={<ClothingForm />} />
        <Route path="/clothes/:id" element={<ClothesDetail />} />
        <Route path="/ClothingRecommendation" element={<ClothingRecommendation />} />
        <Route path="/ClothingUpdateForm/:id" element={<ClothingUpdateForm />} />
        <Route path="/DiaryAdd" element={<DiaryAdd />} />
        <Route path="/DiaryDetail/:id" element={<DiaryDetail/>}/>
      </Routes>
    </div>
  );
}

export default App;
