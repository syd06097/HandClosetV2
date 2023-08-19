import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getClothesByCategoryAndSubcategory,
  getAllClothesIds,
} from "../utils/api";

const categories = [
  {
    name: "전체",
    subcategories: [],
  },
  {
    name: "상의",
    subcategories: [
      "민소매",
      "반팔티",
      "긴팔티",
      "블라우스/셔츠",
      "맨투맨/후디",
      "니트",
      "기타",
    ],
  },
  {
    name: "하의",
    subcategories: [
      "반바지",
      "치마",
      "면바지",
      "슬랙스",
      "청바지",
      "트레이닝/조거",
      "기타",
    ],
  },
  {
    name: "아우터",
    subcategories: [
      "트렌치 코드",
      "코트",
      "자켓/점퍼",
      "야상",
      "무스탕",
      "패딩",
      "후드집업",
      "가디건/베스트",
      "기타",
    ],
  },
  {
    name: "원피스",
    subcategories: ["미니 원피스", "미디 원피스", "맥시 원피스", "기타"],
  },
  {
    name: "신발",
    subcategories: ["운동화", "구두", "부츠", "샌들", "기타"],
  },
  {
    name: "가방",
    subcategories: ["백팩", "숄더/토트백", "크로스백", "클러치", "기타"],
  },
  {
    name: "악세사리",
    subcategories: [
      "모자",
      "양말",
      "쥬얼리/시계",
      "머플러/스카프",
      "벨트",
      "기타",
    ],
  },
  {
    name: "기타",
    subcategories: ["이너웨어", "잠옷", "수영복"],
  },
];
function CategoryMenu({ onClickCategory }) {
  const [activeCategory, setActiveCategory] = useState(categories[0].name);
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (activeCategory === "전체") {
      getAllClothesIds()
        .then((clothes) => {
          onClickCategory(activeCategory, activeSubcategory, clothes);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      getClothesByCategoryAndSubcategory(activeCategory, activeSubcategory)
        .then((clothesWithImageUrls) => {
          onClickCategory(
            activeCategory,
            activeSubcategory,
            clothesWithImageUrls
          );
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [activeCategory, activeSubcategory, onClickCategory]);
  const handleClickCategory = (categoryName) => {
    setActiveCategory(categoryName);
    setActiveSubcategory("");
  };

  const handleClickSubcategory = (subcategoryName) => {
    setActiveSubcategory(subcategoryName);
  };
  return (
    <div>
      <StyledHeader>
        <ol>
          {categories.map((category) => (
            <li
              key={category.name}
              className={activeCategory === category.name ? "active" : ""}
              onClick={() => handleClickCategory(category.name)}
            >
              {category.name}
            </li>
          ))}
        </ol>
        <ul>
          {categories
            .find((category) => category.name === activeCategory)
            .subcategories.map((subcategory) => (
              <li
                key={subcategory}
                className={activeSubcategory === subcategory ? "active" : ""}
                onClick={() => handleClickSubcategory(subcategory)}
              >
                {subcategory}
              </li>
            ))}
        </ul>
      </StyledHeader>
    </div>
  );
}

const StyledHeader = styled.header`
  ul {
    list-style: none;
    padding: 0;
    margin-right: 11px;
    display: flex;
    font-size: 18px;
    overflow: auto;
    white-space: nowrap;
  }
  ol {
    list-style: none;
    padding: 0;
    margin-right: 11px;
    display: flex;
    font-size: 27px;
    overflow: auto;
    white-space: nowrap;
    margin-top: 25px;
  }
  li {
    cursor: pointer;
    margin-left: 11px;
    margin-right: 11px;
    color: #7a7a7a;
  }
  li:last-child {
    margin-right: 0;
  }
  li.active {
    font-weight: bold;
    color: #364054;
  }
  ul + ul {
    margin-top: 10px;
  }
`;
export default CategoryMenu;
