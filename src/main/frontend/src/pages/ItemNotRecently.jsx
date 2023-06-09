import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import styled from "styled-components";

const ItemNotRecently = () => {
    const [bottomItems, setBottomItems] = useState([]);

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
            <h1>ItemNotRecently</h1>
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
                            <h3>Rank: {index + 1}</h3>
                            <p>{item.description}</p>
                            <p>{moment(item.createdate).format("YYYY-MM-DD")} 등록</p>
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

export default ItemNotRecently;