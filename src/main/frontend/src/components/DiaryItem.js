import React, { useEffect, useState } from "react";
import { getAllClothesIds } from "../utils/api"; // API 호출 함수 추가
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DiaryItem({
  category,
  subcategory,
  items,
  selectedImageIds,
  setSelectedImageIds,
}) {
  const [ids, setIds] = useState([]); // ID 목록 상태 추가
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));


  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, [loginInfo, navigate]);

  useEffect(() => {
    const fetchIds = async () => {
      try {
        const clothesIds = await getAllClothesIds(); // 모든 의류의 ID 목록 가져오기
        console.log(clothesIds);
        setIds(clothesIds);
      } catch (error) {
        console.error("Failed to fetch clothes ids:", error);
      }
    };

    fetchIds();
  }, []);
  const toggleImageSelection = (imageId) => {
    setSelectedImageIds((prevSelectedImageIds) => {
      if (prevSelectedImageIds.includes(imageId)) {
        return prevSelectedImageIds.filter((id) => id !== imageId);
      } else {
        return [...prevSelectedImageIds, imageId];
      }
    });
  };

  const getImageSrc = async (id, category, item) => {

    if (category === "전체") {
      try {
        const response = await axios.get(`/api/clothing/images/${id}`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          responseType: "arraybuffer",
        });
        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
      }
    } else {
      try {

        // 여기서도 마찬가지로 헤더에 토큰을 포함하여 요청합니다.
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
    const fetchData = async () => {
      const images = await Promise.all(
        items.map(async (item) => {
          const imageUrl = await getImageSrc(item.id, category, item);
          return { item, imageUrl };
        })
      );
      setImages(images);
    };
    fetchData();
  }, [items]);

  return (
    <div>
      <ImageGrid>
        {images.map(({ item, imageUrl, index }) => (
          <ImageItem
            key={item.id}
            isSelected={selectedImageIds.includes(item.id)}
            onClick={() => toggleImageSelection(item.id)}
          >
            <ItemImage src={imageUrl} alt={item.name} />
            <p>{item.name}</p>
          </ImageItem>
        ))}
      </ImageGrid>
    </div>
  );
}

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-left: 9%;
  margin-right: 9%;
  margin-bottom: 100px;
`;

const ImageItem = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 정사각형 비율을 유지하기 위한 패딩 */
  overflow: hidden;
  border: ${({ isSelected }) =>
    isSelected ? "1px solid red" : "1px solid lightgray"};
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

export default DiaryItem;
