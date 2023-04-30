import React from "react";
import CategoryMenu from "../components/CategoryMenu";
import ClosetItem from "../components/ClosetItem";
const Closet = () => {
  return ( // ClothingForm로 가는버튼구현 해야댐
    <div>
      <h1>Closet</h1>
      <CategoryMenu />
      <ClosetItem />
    </div>
  );
};

export default Closet;
