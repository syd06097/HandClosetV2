import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClothes } from "../utils/api";
import styled from "styled-components";

function ClothesDetail() {
  const { id } = useParams();
  const [clothes, setClothes] = useState(null);

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

  return (
    <Container>
      <Image
        src={`data:image/jpeg;base64,${clothes.image}`}
        alt={clothes.description}
      />
      <div>
        <h2>{clothes.category}</h2>
        <h3>{clothes.subcategory}</h3>
        <p>{clothes.season}</p>
        <p>{clothes.description}</p>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  margin-right: 20px;
`;

export default ClothesDetail;
