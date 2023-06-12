import React, { useState } from "react";
import CategoryMenu from "../components/CategoryMenu";
import CategoryItem from "../components/CategoryItem";
import AddClothes from "../components/AddClothes";
import styled from "styled-components";
function Closet() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

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
