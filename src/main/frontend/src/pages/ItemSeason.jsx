import React, { useEffect, useState } from "react";
import axios from "axios";
import fall from "../images/fall.png";
import spring from "../images/spring.png";
import summer from "../images/summer.png";
import winter from "../images/winter.png";
import styled from "styled-components";
import clothes from "../images/clothes.png";
import { useNavigate } from "react-router-dom";
const ItemSeason = () => {
  const [statistics, setStatistics] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/clothing/statistics");
      const data = response.data;

      setStatistics(data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateSeasonPercentage = (season) => {
    const seasonItemCount = statistics[season] || 0;
    const totalItemCount = Object.values(statistics).reduce(
      (total, count) => total + count,
      0
    );

    if (totalItemCount === 0) return { count: 0, percentage: 0 };

    const percentage = Math.round((seasonItemCount / totalItemCount) * 100);
    return { count: seasonItemCount, percentage };
  };

  const sortedSeasons = Object.keys(statistics).sort((a, b) => {
    const percentageA = calculateSeasonPercentage(a).percentage;
    const percentageB = calculateSeasonPercentage(b).percentage;
    return percentageB - percentageA;
  });

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
            계절 별<br />
            상세
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

      <ul>
        {sortedSeasons.map((season) => (
          <ItemListItem key={season}>
            {season === "봄" && <IconImage src={spring} alt="spring" />}
            {season === "여름" && <IconImage src={summer} alt="summer" />}
            {season === "가을" && <IconImage src={fall} alt="fall" />}
            {season === "겨울" && <IconImage src={winter} alt="winter" />}
            <CategoryName>{season}</CategoryName>
            <ItemInfo>
              <Count>{calculateSeasonPercentage(season).count}개 </Count>
              <Percentage>
                {" "}
                | {calculateSeasonPercentage(season).percentage}%
              </Percentage>
            </ItemInfo>
          </ItemListItem>
        ))}
      </ul>
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
  //margin-left: -1%;
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
export default ItemSeason;
