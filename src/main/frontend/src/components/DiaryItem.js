import React, { useEffect, useState } from "react";
import { getAllClothesIds } from "../utils/api"; // API 호출 함수 추가
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function DiaryItem({ category, subcategory, items }) {
  const [ids, setIds] = useState([]); // ID 목록 상태 추가
  const navigate = useNavigate();

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

  // const handleClickImage = (item, index) => {
  //     let itemId;
  //
  //     if (category === "전체") {
  //         // "전체" 카테고리에서는 ids 배열을 사용하여 이미지의 ID를 가져옴
  //         itemId = ids[index];
  //     } else {
  //         // 다른 카테고리에서는 item 객체에 ID가 있음
  //         itemId = item.id;
  //     }
  //
  //     console.log(itemId);
  //     navigate(`/clothes/${itemId}`);
  // };
  return (
    <div>
      <ImageGrid>
        {items.map((item, index) => (
          <ImageItem
            key={item.id}
            // onClick={() => handleClickImage(item, index)}
          >
            {category === "전체" ? (
              <ItemImage
                src={`/api/clothing/images/${ids[index]}`} // 의류 ID를 사용하여 이미지 가져오기
                alt={item.name}
              />
            ) : (
              <ItemImage src={item.image} alt={item.name} />
            )}
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
export default DiaryItem;
