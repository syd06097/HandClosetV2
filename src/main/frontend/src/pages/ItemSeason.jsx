// import React, { useEffect, useState } from "react";
// import axios from 'axios';
//
// const ItemSpring = () => {
//     const [statistics, setStatistics] = useState({});
//
//     useEffect(() => {
//         fetchData();
//     }, []);
//
//     const fetchData = async () => {
//         try {
//             const response = await axios.get('/api/clothing/statistics');
//             const data = response.data;
//             setStatistics(data);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     const calculateSeasonPercentage = (season) => {
//         const seasonItemCount = statistics[season] || 0;
//         const totalItemCount = Object.values(statistics).reduce((total, count) => total + count, 0);
//
//         if (totalItemCount === 0) return { count: 0, percentage: 0 };
//
//         const percentage = Math.round((seasonItemCount / totalItemCount) * 100);
//         return { count: seasonItemCount, percentage };
//     };
//
//     return (
//         <div>
//             <h1>ItemSpring</h1>
//
//             <h2>Season Percentages</h2>
//             <ul>
//                 <li>
//                     봄: {calculateSeasonPercentage("봄").count} ({calculateSeasonPercentage("봄").percentage}%)
//                 </li>
//                 <li>
//                     여름: {calculateSeasonPercentage("여름").count} ({calculateSeasonPercentage("여름").percentage}%)
//                 </li>
//                 <li>
//                     가을: {calculateSeasonPercentage("가을").count} ({calculateSeasonPercentage("가을").percentage}%)
//                 </li>
//                 <li>
//                     겨울: {calculateSeasonPercentage("겨울").count} ({calculateSeasonPercentage("겨울").percentage}%)
//                 </li>
//             </ul>
//         </div>
//     );
// };
//
// export default ItemSpring;

import React, { useEffect, useState } from "react";
import axios from 'axios';
import fall from "../images/fall.png";
import spring from "../images/spring.png";
import summer from "../images/summer.png";
import winter from "../images/winter.png";
import styled from "styled-components";

const ItemSeason = () => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/clothing/statistics');
            const data = response.data;

            setStatistics(data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateSeasonPercentage = (season) => {
        const seasonItemCount = statistics[season] || 0;
        const totalItemCount = Object.values(statistics).reduce((total, count) => total + count, 0);

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
            <h3 style={{fontSize:"22px"}}>계절 별 상세</h3>
            <hr style={{ height: "1px", marginBottom:"50px",border:"0",backgroundColor:"lightgray" }} />

            <ul>
                {sortedSeasons.map((season) => (
                    <ItemListItem key={season}>
                        {season==="봄"&&<IconImage src={spring} alt="spring"/>}
                        {season==="여름"&&<IconImage src={summer} alt="summer"/>}
                        {season==="가을"&&<IconImage src={fall} alt="fall"/>}
                        {season==="겨울"&&<IconImage src={winter} alt="winter"/>}
                        <CategoryName>{season}</CategoryName>
                        <ItemInfo>
                            <Count>{calculateSeasonPercentage(season).count}개 </Count><Percentage> | {calculateSeasonPercentage(season).percentage}%</Percentage>
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