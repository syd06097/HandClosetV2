import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClothes, deleteClothes } from "../utils/api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";
import trash from "../images/trash.png";
import update from "../images/update.png";
import axios from "axios";
function ClothesDetail() {
  const { id } = useParams();
  const [clothes, setClothes] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, [loginInfo, navigate]);


  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const clothesData = await getClothes(id);
        setClothes(clothesData);
      } catch (error) {
        console.error("Failed to fetch clothes:", error);
      }
      try {
        const response = await axios.get(`/api/clothing/images/${id}`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          responseType: "arraybuffer",
        });

        console.log("response:", response);

        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    fetchClothes();
  }, [id]);

  if (!clothes) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      console.log("삭제할 id:", id);
      await deleteClothes(id); // 해당 옷 데이터를 삭제하는 API 호출
      navigate("/Closet"); // 삭제 후에는 Closet 페이지로 이동
    } catch (error) {
      console.error("Failed to delete clothes:", error);
    }
  };
  const handleUpdate = () => {
    navigate(`/ClothingUpdateForm/${id}`);
  };
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/Closet")}>
          <img src={back} alt="back" style={{ width: "28px" }} />
        </BackButton>
        <UpdateButton onClick={handleUpdate}>
          <img src={update} alt="update" />
        </UpdateButton>
      </Header>
      <ImageWrapper>
        <Image src={imageUrl} alt={clothes.description} />
      </ImageWrapper>
      <Details>
        <Square>
          <p style={{ color: "gray", fontWeight: "bold" }}>카테고리</p>
          <div>{clothes.category}</div>
          <div>{clothes.subcategory}</div>
        </Square>
        <Square>
          <p style={{ color: "gray", fontWeight: "bold" }}>계절</p>
          <div>{clothes.season}</div>
        </Square>
        <Square>
          <p style={{ color: "gray", fontWeight: "bold" }}>착용횟수</p>
          <div>{clothes.wearcnt}회</div>
        </Square>
      </Details>
      <TrashWrapper onClick={handleDelete}>
        <img src={trash} alt="trash" />
      </TrashWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const UpdateButton = styled.div`
  margin-top: 23px;
  margin-right: 9%;
`;

const ImageWrapper = styled.div`
  width: 330px;
  height: 330px;
  margin-top: 20px;
  border: 1px solid lightgray;
  border-radius: 18px;
  overflow: hidden;
`;

const TrashWrapper = styled.div`
  margin-top: 65px;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  width: 85%;
`;

const Square = styled.div`
  width: 100px;
  height: 123px;
  margin: 0% 3%;
  padding: 1%;
  border: 1px solid lightgray;
  border-radius: 8px;
`;

export default ClothesDetail;
