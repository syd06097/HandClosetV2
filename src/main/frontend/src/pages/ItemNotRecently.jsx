import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
const ItemNotRecently = () => {
    const [bottomItems, setBottomItems] = useState([]);

    useEffect(() => {
        const fetchBottomItems = async () => {
            try {
                const response = await axios.get("/api/clothing/bottom-items");
                setBottomItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBottomItems();
    }, []);

    return (
        <div>
            <h1>ItemNotRecently</h1>
            <div style={{overflow:"scroll"}}>
                {bottomItems.map((item, index) => (
                    <div key={item.id}>
                        <h2>Rank: {index + 1}</h2>
                        <img src={item.imgpath} alt="item" />
                        <p>Description: {item.description}</p>
                        <p>Created Date: {moment(item.createdate).format("YYYY-MM-DD")}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemNotRecently;