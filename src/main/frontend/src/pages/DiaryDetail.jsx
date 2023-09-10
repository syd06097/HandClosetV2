import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Axios를 이용하여 서버 요청 처리
import styled from "styled-components";
import { getClothesByImageIds } from "../utils/api"; // utils/api에서 getClothes 함수를 불러옴
import back from "../images/back.png";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormat";
import trash from "../images/trash.png";
function DiaryDetail() {
  const { id } = useParams(); // URL 파라미터에서 'id'를 추출
  const [diary, setDiary] = useState({}); // 다이어리 정보를 담을 상태 변수
  const [clothesData, setClothesData] = useState({}); // 의류 정보를 담을 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태 변수
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await axios.get(`/api/diary/entryData/${id}`);
        setDiary(response.data);
        const imageIds = response.data.imageIds;

        console.log(imageIds);
        if (imageIds.length > 0) {
          fetchClothesData(imageIds);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch diary entry:", error);
      }
    };

    fetchDiary();
  }, [id]);
  useEffect(() => {
    // diary가 업데이트될 때마다 로그로 출력
    console.log(diary);
  }, [diary]);

  const fetchClothesData = async (imageIds) => {
    try {
      const response = await getClothesByImageIds(imageIds);
      // response 자체를 출력하여 데이터 확인
      console.log(response);

      // 응답 데이터의 구조에 따라서 처리
      if (Array.isArray(response) && response.length > 0) {
        // 배열 형식의 데이터가 존재하는 경우
        setClothesData(response);
        setLoading(false);
      } else {
        console.error("Invalid response data:", response);
        // 오류 처리 로직 추가
      }
    } catch (error) {
      console.error("Failed to fetch clothes data:", error);
      // 오류 처리 로직 추가
    } finally {
      console.log("fetchClothesData 함수 실행 ");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/diary/${id}`);
      navigate("/Diary");
      // Optionally, navigate the user to a different page or refresh the entries.
    } catch (error) {
      console.error("Failed to delete diary entry:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!clothesData || clothesData.length === 0) {
    return <div>No clothes data available.</div>;
  }

  // 다이어리와 의류 데이터를 화면에 출력
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/Diary")}>
          <img src={back} alt="back" style={{ width: "28px" }} />
        </BackButton>
        <TrashWrapper onClick={handleDelete}>
          <img src={trash} alt="trash" />
        </TrashWrapper>
      </Header>
      <ThumbnailImage
        src={`/api/diary/images?thumbnailpath=${encodeURIComponent(
          diary.thumbnailpath
        )}`}
        alt="Thumbnail"
      />

      {clothesData.map((clothes) => (
        <div>
          <ClothesItem key={clothes.id}>
            <ItemImage
              src={`/api/clothing/images/${clothes.id}`}
              alt={clothes.description}
            />
            <Details>
              <Elements>카테고리: {clothes.category}</Elements>
              <Elements>계절: {clothes.season}</Elements>
              <Elements>착용횟수: {clothes.wearcnt}회</Elements>
              <Elements>등록일: {formatDate(clothes.createdate)}</Elements>
            </Details>
          </ClothesItem>
        </div>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //align-items: flex-start;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
`;

const BackButton = styled.div`
  margin-top: 25px;
  margin-left: 9%;
`;
const TrashWrapper = styled.div`
  margin-top: 25px;
  margin-right: 9%;
`;
const ThumbnailImage = styled.img`
  width: 330px;
  height: 330px;
  margin-top: 20px;
  border: 1px solid lightgray;
  border-radius: 18px;
  object-fit: cover;
`;

const ClothesItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  //align-items: flex-start;
  //margin-left: 9%; /* 새로 추가한 부분 */
  border: 1px solid lightgray;
  border-radius: 18px;
  overflow: hidden;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;
const Elements = styled.div`
  float: left;
`;

export default DiaryDetail;
