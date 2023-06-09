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

const ItemSpring = () => {
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
            <h1>ItemSpring</h1>

            <h2>Season Percentages</h2>
            <ul>
                {sortedSeasons.map((season) => (
                    <li key={season}>
                        {season}: {calculateSeasonPercentage(season).count} | {calculateSeasonPercentage(season).percentage}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemSpring;