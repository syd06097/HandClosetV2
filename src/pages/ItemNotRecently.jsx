import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import styled from "styled-components";
import clothes from "../images/clothes.png";
import { useNavigate } from "react-router-dom";
const ItemNotRecently = () => {
    const [bottomItems, setBottomItems] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBottomItems = async () => {
            try {
                const response = await axios.get("/api/clothing/bottom-items");
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

                setBottomItems(updatedItems);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBottomItems();
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop:"30px"}}>
                <div style={{ display: "block", fontSize: "22px", textAlign: "left", float: "left",marginLeft: "9%" }}><h3>요즘<br/>입지 않은 옷<br/>TOP 5</h3></div>
                <div style={{ display: "block", float: "right", marginRight: "9%",  }}><img src={clothes} alt="clothes" style={{width:"90px",height:"90px"}} /></div>
            </div>
            <div><hr style={{ height: "1px",marginTop:"10px", marginBottom: "50px", border: "0", backgroundColor: "lightgray" }} /></div>
            <ItemContainer>
                {bottomItems.map((item, index) => (
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
                            <div style={{color:"gray"}}>{moment(item.createdate).format("YYYY-MM-DD")} 등록</div>
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
  margin-bottom: 20px;
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
export default ItemNotRecently;