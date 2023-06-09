import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import styled from "styled-components";

const ItemFrequently = () => {
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        const fetchTopItems = async () => {
            try {
                const response = await axios.get("/api/clothing/top-items");
                const items = response.data;

                const updatedItems = await Promise.all(
                    items.map(async (item) => {
                        const imageBytes = await fetchImageBytes(item.id);
                        return {
                            ...item,
                            imageBytes: imageBytes
                        };
                    })
                );

                setTopItems(updatedItems);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTopItems();
    }, []);

    const fetchImageBytes = async (id) => {
        try {
            const response = await axios.get(`/api/clothing/images/${id}`, {
                responseType: 'arraybuffer'
            });
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <div>
            <h1>ItemFrequently</h1>
            <ItemContainer>
                {topItems.map((item, index) => (
                    <ItemCard key={item.id}>
                        <ImageWrapper>
                            <ImageSquareWrapper>
                                <Image src={`data:image/jpeg;base64,${btoa(
                                    new Uint8Array(item.imageBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
                                )}`} alt={item.name} />
                            </ImageSquareWrapper>
                        </ImageWrapper>
                        <ItemDetails>
                            <h3 style={{paddingBottom:0}}>Rank: {index + 1}</h3>
                            <p>{item.description}</p>
                            <p>{moment(item.createdate).format("YYYY-MM-DD")} 등록 | {item.wearcnt}회 착용</p>

                        </ItemDetails>
                    </ItemCard>
                ))}
            </ItemContainer>
        </div>
    );
};



const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: scroll;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  width: 30%; /* 예시로 가로 크기를 20%로 설정 */
  padding-bottom: 20%; /* 예시로 세로 크기를 가로 크기의 20%로 설정 */
  margin-right: 20px;
  overflow: hidden;
`;

const ImageSquareWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

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
//                 console.log(items); // item 잘 가져옴.
//                 const updatedItems = await Promise.all(
//                     items.map(async (item) => {
//                         const imageId = await fetchImageId(item.id);
//                         return {
//                             ...item,
//                             imageId: imageId
//                         };
//                     })
//                 );
//                 console.log(updatedItems);
//                 setTopItems(updatedItems);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//
//         fetchTopItems();
//     }, []);
//
//     const fetchImageId = async (id) => {
//         try {
//             console.log(id); //path 잘 가져옴.
//             const response = await axios.get(`/api/clothing/images/{id}`, {
//
//                 responseType: 'arraybuffer'
//             });
//             console.log(response.data);
//             return response.data;
//
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
//                         {/*<img src={`data:image/jpeg;base64,${item.imagePath}`} alt={item.name} />*/}
//                         {/*<img src={`data:image/jpeg;base64,${item.imagePath}`} alt={item.name} />*/}
//                         <img src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(item.imageId)))}`} alt={item.name} />
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