import { useState } from "react";
// import "../css/Menu.css";
import styled from "styled-components";
const categories = [
  {
    name: "전체",
    subcategories: [],
  },
  {
    name: "상의",
    subcategories: ["티셔츠", "블라우스/셔츠", "맨투맨/후디", "니트", "기타"],
  },
  {
    name: "하의",
    subcategories: ["치마", "바지", "청바지", "트레이닝/조거", "기타"],
  },
  {
    name: "아우터",
    subcategories: [
      "코트",
      "자켓/점퍼",
      "패딩",
      "후드 집업",
      "가디건/베스트",
      "기타",
    ],
  },
  {
    name: "원피스",
    subcategories: [],
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

function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  return (
    <div>
      <StyledHeader>
        <ol>
          {categories.map((category) => (
            <li
              key={category.name}
              className={activeCategory === category.name ? "active" : ""}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </li>
          ))}
        </ol>
        <ul>
          {categories
            .find((category) => category.name === activeCategory)
            .subcategories.map((subcategory) => (
              <li key={subcategory}>{subcategory}</li>
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
    font-size: 15px;
    overflow: auto;
    white-space: nowrap;
  }
  ol {
    list-style: none;
    padding: 0;
    margin-right: 11px;
    display: flex;
    font-size: 23px;
    overflow: auto;
    white-space: nowrap;
  }

  li {
    cursor: pointer;
    margin-left: 11px;
    margin-right: 11px;
  }

  li:last-child {
    margin-right: 0;
  }

  li.active {
    font-weight: bold;
  }

  ul + ul {
    margin-top: 10px;
  }
`;
export default CategoryMenu;
