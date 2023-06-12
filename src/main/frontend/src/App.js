import { Route, Routes } from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Calendar from "./pages/Calendar";
import MyPage from "./pages/MyPage";
import Closet from "./pages/Closet";
import ClothingForm from "./pages/ClothingForm";
import BottomNav from "./BottomNav";
import ClothesDetail from "./pages/ClothesDetail";
import ItemHave from "./pages/ItemHave";
import ItemSeason from "./pages/ItemSeason";
import ClothingRecommendation from "./pages/CothingRecommendation";
import ItemFrequently from "./pages/ItemFrequently";
import ItemNotRecently from "./pages/ItemNotRecently";
function App() {
  return (
    <div className="App">

        <BottomNav />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/Closet" element={<Closet />} />
          <Route path="/ItemHave" element={<ItemHave />} />
          <Route path="/ItemSeason" element={<ItemSeason />} />
        <Route path="/ItemFrequently" element={<ItemFrequently />} />
        <Route path="/ItemNotRecently" element={<ItemNotRecently />} />
        <Route path="/ClothingForm" element={<ClothingForm />} />
        <Route path="/clothes/:id" element={<ClothesDetail />} />
        <Route path="/ClothingRecommendation" element={<ClothingRecommendation />} />

      </Routes>
    </div>
  );
}

export default App;
