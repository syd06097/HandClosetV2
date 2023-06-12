import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import styled from "styled-components";
import clothes from "../images/clothes.png";
import { useNavigate } from "react-router-dom";
const ItemFrequently = () => {
    const [topItems, setTopItems] = useState([]);
    const navigate = useNavigate();
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

            <div style={{ display: "block",width:"100%", height:"40px"  }}>
                <div onClick={() => navigate("/Main")} style={{marginTop: "23px", float: "right", paddingRight: "9%", fontSize: "30px", fontWeight: "bold"}}>X</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop:"40px"}}>
                <div style={{ display: "block", fontSize: "22px", textAlign: "left", float: "left",marginLeft: "9%" }}><h3>가장 자주<br/>입은 옷<br/>TOP 5</h3></div>
                <div style={{ display: "block", float: "right", marginRight: "9%",  }}><img src={clothes} alt="clothes" style={{width:"90px",height:"90px"}} /></div>
            </div>
            <div><hr style={{ height: "1px",marginTop:"10px", marginBottom: "50px", border: "0", backgroundColor: "lightgray" }} /></div>

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
                            <div style={{fontSize:"19px", fontWeight:"bold"}}>{index + 1}위</div>
                            <div style={{fontSize:"19px", fontWeight:"bold"}}>{item.description}</div>
                            <div style={{color:"gray"}}>{moment(item.createdate).format("YYYY-MM-DD")} 등록 | {item.wearcnt}회 착용</div>
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
  padding-bottom: 100px;
`;
const ItemCard = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  padding-bottom:0px;
`;

const ImageWrapper = styled.div`
  width: 20%; /* 예시로 가로 크기를 20%로 설정 */
  height: auto;
  //padding-bottom: 20%; /* 예시로 세로 크기를 가로 크기의 20%로 설정 */
  margin-right: 30px;
  overflow: hidden;
  margin-left: 9%;
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
  align-items: flex-start;
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