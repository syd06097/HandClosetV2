import { Route, Routes } from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Calendar from "./pages/Calendar";
import MyPage from "./pages/MyPage";
import Closet from "./pages/Closet";
import ClothingForm from "./pages/ClothingForm";
import BottomNav from "./BottomNav";
import ClothesDetail from "./pages/ClothesDetail";

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
        <Route path="/ClothingForm" element={<ClothingForm />} />
        <Route path="/clothes/:id" element={<ClothesDetail />} />
      </Routes>
    </div>
  );
}

export default App;
