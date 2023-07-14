// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getClothes } from "../utils/api";
// import styled from "styled-components";
//
// function ClothesDetail() {
//   const { id } = useParams();
//   const [clothes, setClothes] = useState(null);
//
//   useEffect(() => {
//     const fetchClothes = async () => {
//       try {
//         const clothesData = await getClothes(id);
//         setClothes(clothesData);
//       } catch (error) {
//         console.error("Failed to fetch clothes:", error);
//       }
//     };
//
//     fetchClothes();
//   }, [id]);
//
//   if (!clothes) {
//     return <div>Loading...</div>;
//   }
//
//   return (
//     <Container>
//       <Image
//         src={`data:image/jpeg;base64,${clothes.image}`}
//         alt={clothes.description}
//       />
//       <div>
//         <h2>{clothes.category}</h2>
//         <h3>{clothes.subcategory}</h3>
//         <p>{clothes.season}</p>
//         <p>{clothes.description}</p>
//       </div>
//     </Container>
//   );
// }
//
// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;
//
// const Image = styled.img`
//   width: 300px;
//   height: 300px;
//   object-fit: cover;
//   margin-right: 20px;
// `;
//
// export default ClothesDetail;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClothes,deleteClothes } from "../utils/api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";
import trash from "../images/trash.png";
import update from "../images/update.png";

function ClothesDetail() {
  const { id } = useParams();
  const [clothes, setClothes] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const clothesData = await getClothes(id);
        setClothes(clothesData);
      } catch (error) {
        console.error("Failed to fetch clothes:", error);
      }
    };

    fetchClothes();
  }, [id]);

  if (!clothes) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      console.log("삭제할 id:",id);
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
          <img src={back} alt="back" style={{ width: "34px" }} />
        </BackButton>
        <UpdateButton onClick={handleUpdate}>
          <img src={update} alt="update" />
        </UpdateButton>
      </Header>
      <ImageWrapper>
        <Image src={`/api/clothing/images/${id}`} alt={clothes.description} />
      </ImageWrapper>
      <Details>
        <Square>
          <p style={{ color: "gray" }}>카테고리</p>
          <div>{clothes.category}</div>
          <div>{clothes.subcategory}</div>
        </Square>
        <Square>
          <p style={{ color: "gray" }}>계절</p>
          <div>{clothes.season}</div>
        </Square>
        <Square>
          <p style={{ color: "gray" }}>착용횟수</p>
          <div>{clothes.wearcnt}</div>
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
  margin-top: 23px;
  margin-left: 9%;
`;

const UpdateButton = styled.div`
  margin-top: 23px;
  margin-right: 9%;
`;

const ImageWrapper = styled.div`
  width: 300px;
  height: 300px;
  margin-top: 20px;
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
  width: 82%;
`;

const Square = styled.div`
  width: 100px;
  height:123px;
  margin: 0% 2%;
  border: 1px solid gray;
`;

export default ClothesDetail;
