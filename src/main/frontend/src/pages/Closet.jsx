import React, {useEffect, useState} from "react";
import CategoryMenu from "../components/CategoryMenu";
import CategoryItem from "../components/CategoryItem";
import AddClothes from "../components/AddClothes";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function Closet() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");

    }
  }, [loginInfo, navigate]);

  const handleClickCategory = (category, subcategory, items) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedItems(items);
  };

  return (
    <div>
      <StyledWrap>
        <CategoryMenu onClickCategory={handleClickCategory} />
        <CategoryItem
          category={selectedCategory}
          subcategory={selectedSubcategory}
          items={selectedItems}
        />
      </StyledWrap>
      <AddClothes />
    </div>
  );
}
const StyledWrap = styled.div`
  position: relative;

  .CategoryMenu {
    position: relative;
    z-index: 1;
  }

  .CategoryItem {
    position: relative;
    z-index: 1;
  }
`;
export default Closet;
