import React, { useEffect, useState } from "react";
import axios from "axios";
// 사용할 아이콘 import
import top from "../images/top.png";
import bottom from "../images/bottom.png";
import outer from "../images/outer.png";
import shoes from "../images/shoes.png";
import more from "../images/more.png";
import dress from "../images/dress.png";
import bag from "../images/bag.png";
import accesory from "../images/accesory.png";
import clothes from "../images/clothes.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import categories from "../utils/categories";

const ItemHave = () => {
  const [statistics, setStatistics] = useState([]);
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {
    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/api/clothing/category-item-count", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
        const data = response.data;
        setStatistics(Object.entries(data));
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

 

  const calculateCategoryPercentage = (categoryName) => {
    const categoryItemCount = statistics.reduce((total, [key, count]) => {
      const [parentCategory] = key.split("-");
      return parentCategory === categoryName ? total + count : total;
    }, 0);

    const totalItemCount = statistics.reduce(
      (total, [_, count]) => total + count,
      0
    );

    if (totalItemCount === 0) return 0;

    const percentage = Math.round((categoryItemCount / totalItemCount) * 100);
    return { count: categoryItemCount, percentage };
  };

  const sortedCategories = categories.sort((a, b) => {
    const percentageA = calculateCategoryPercentage(a.name).percentage;
    const percentageB = calculateCategoryPercentage(b.name).percentage;
    return percentageB - percentageA;
  });

  const totalItemCount = statistics.reduce(
    (total, [_, count]) => total + count,
    0
  );

  return (
    <div>
      <div style={{ display: "block", width: "100%", height: "40px" }}>
        <div
          onClick={() => navigate("/Main")}
          style={{
            marginTop: "23px",
            float: "right",
            paddingRight: "9%",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          X
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            display: "block",
            fontSize: "22px",
            textAlign: "left",
            float: "left",
            marginLeft: "9%",
            color: "#333",
          }}
        >
          <h3>
            의류
            <br />
            카테고리 순위
          </h3>
        </div>
        <div style={{ display: "block", float: "right", marginRight: "9%" }}>
          <img
            src={clothes}
            alt="clothes"
            style={{ width: "90px", height: "90px" }}
          />
        </div>
      </div>
      <div>
        <hr
          style={{
            height: "1px",
            marginTop: "10px",
            marginBottom: "50px",
            border: "0",
            backgroundColor: "lightgray",
          }}
        />
      </div>

      {sortedCategories.map((category) => {
        const { count, percentage } = calculateCategoryPercentage(
          category.name
        );
        return (
          <ItemListItem key={category.name}>
            {category.name === "상의" && <IconImage src={top} alt="top" />}
            {category.name === "하의" && (
              <IconImage src={bottom} alt="bottom" />
            )}
            {category.name === "아우터" && (
              <IconImage src={outer} alt="outer" />
            )}
            {category.name === "원피스" && (
              <IconImage src={dress} alt="dress" />
            )}
            {category.name === "신발" && <IconImage src={shoes} alt="shoes" />}
            {category.name === "가방" && <IconImage src={bag} alt="bag" />}
            {category.name === "악세사리" && (
              <IconImage src={accesory} alt="accessory" />
            )}
            {category.name === "기타" && <IconImage src={more} alt="more" />}
            <CategoryName>{category.name}</CategoryName>
            <ItemInfo>
              <Percentage>{percentage}% </Percentage>
              <Count>| {count}개</Count>
            </ItemInfo>
          </ItemListItem>
        );
      })}
    </div>
  );
};
const ItemListItem = styled.li`
  display: flex;
  margin-bottom: 16px;
  font-size: 18px;
  align-items: center;
  color: #333;
`;

const IconImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  float: left;
  margin-left: 9%;
`;

const CategoryName = styled.span`
  margin-right: auto;
  float: left;
  font-weight: bold;
`;

const ItemInfo = styled.div`
  float: right;
  margin-right: 9%;
`;

const Percentage = styled.span`
  float: none;
  //float: right;
`;

const Count = styled.span`
  //float: right;
  float: none;
`;
export default ItemHave;
