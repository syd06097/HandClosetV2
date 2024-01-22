import React, { useEffect, useState } from "react";
import { getAllClothesIds } from "../utils/api"; 
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryItem = ({ category, subcategory, items }) => {
  const [ids, setIds] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {
    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    } else {
  
      const fetchIds = async () => {
        try {
          const clothesIds = await getAllClothesIds();
          setIds(clothesIds);
        } catch (error) {
          console.error("Failed to fetch clothes ids:", error);
        }
      };
      fetchIds();
    }
  }, [category]);

  const handleClickImage = (item, index) => {
    let itemId;
    if (category === "전체") {
      console.log(ids[index]);
      itemId = ids[index];
    } else {
      itemId = item.id;
      console.log(item.image);
    }
    navigate(`/clothes/${itemId}`);
  };

  const getImageSrc = async (categoryId, ids, item, index) => {
    if (categoryId === "전체") {
      try {
        if (ids[index] !== undefined) {
          const response = await axios.get(
              `/api/clothing/images/${ids[index]}`,
              {
                headers: {
                  Authorization: `Bearer ${loginInfo.accessToken}`,
                },
                responseType: "arraybuffer",
              }
          );
          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
          return URL.createObjectURL(blob);
        } else {
        
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
      }
    } else {
      try {
        const response = await axios.get(item.image, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          responseType: "arraybuffer",
        });
        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        console.log(URL.createObjectURL(blob));
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
      }
    }
  };

  useEffect(() => {
    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    } else {
      const fetchData = async () => {
        const images = await Promise.all(
          items.map(async (item, index) => {
            const imageUrl = await getImageSrc(category, ids, item, index);
            return { item, index, imageUrl };
          })
        );
        setImages(images);
      };
      fetchData();
    }
  }, [category, ids, items]);

  return (
    <div>
      <ImageGrid>
        {images.map(({ item, index, imageUrl }) => (
          <ImageItem
            key={item.id}
            onClick={() => handleClickImage(item, index)}
          >
            <ItemImage src={imageUrl} alt={item.name} />

            <p>{item.name}</p>
          </ImageItem>
        ))}
      </ImageGrid>
    </div>
  );
};

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-left: 9%;
  margin-right: 9%;
  margin-top: 50px;
  margin-bottom: 100px;
`;

const ImageItem = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 정사각형 비율을 유지하기 위한 패딩 */
  overflow: hidden;
  border: 1px solid lightgray;
  border-radius: 18px;
`;

const ItemImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default CategoryItem;
