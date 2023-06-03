import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment'; //npm install moment
const ItemFrequently = () => {
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        const fetchTopItems = async () => {
            try {
                const response = await axios.get("/api/clothing/top-items");
                setTopItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTopItems();
    }, []);

    return (
        <div>
            <h1>ItemFrequently</h1>
            <div style={{overflow:"scroll"}}>
                {topItems.map((item, index) => (
                    <div key={item.id}>
                        <h2>Rank: {index + 1}</h2>
                        <img src={item.imgpath} alt="item" />
                        <p>Description: {item.description}</p>
                        <p>Created Date: {moment(item.createdate).format("YYYY-MM-DD")}</p>
                        <p>Wear Count: {item.wearcnt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemFrequently;


// import React, { useEffect, useState } from "react";
// import axios from 'axios';
// import moment from 'moment';
//
// const ItemFrequently = () => {
//     const [topItems, setTopItems] = useState([]);
//
//     useEffect(() => {
//         const fetchTopItems = async () => {
//             try {
//                 const response = await axios.get("/api/clothing/top-items");
//                 const items = response.data;
//                 const updatedItems = await Promise.all(
//                     items.map(async (item) => {
//                         const imagePath = await fetchImagePath(item.imgpath);
//                         return {
//                             ...item,
//                             imagePath: imagePath
//                         };
//                     })
//                 );
//                 setTopItems(updatedItems);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//
//         fetchTopItems();
//     }, []);
//
//     const fetchImagePath = async (imgPath) => {
//         try {
//             const response = await axios.get(`/api/clothing/images-by-path/${imgPath}`, {
//                 responseType: 'arraybuffer'
//             });
//             const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
//             const imageUrl = URL.createObjectURL(imageBlob);
//             return imageUrl;
//         } catch (error) {
//             console.error(error);
//             return null;
//         }
//     };
//
//     return (
//         <div>
//             <h1>ItemFrequently</h1>
//             <div style={{ overflow: "scroll" }}>
//                 {topItems.map((item, index) => (
//                     <div key={item.id}>
//                         <h2>Rank: {index + 1}</h2>
//                         {item.imagePath && <img src={item.imagePath} alt="item" />}
//                         <p>Description: {item.description}</p>
//                         <p>Created Date: {moment(item.createdate).format("YYYY-MM-DD")}</p>
//                         <p>Wear Count: {item.wearcnt}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ItemFrequently;