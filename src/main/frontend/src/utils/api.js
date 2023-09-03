
import axios from "axios";

const getClothesByCategoryAndSubcategory = (category, subcategory) => {
  let url = "/api/clothing/category";

  url += `?category=${category}&subcategory=${subcategory}`;

  return axios.get(url).then((response) => {
    const clothesWithImageUrls = response.data.map((clothes) => ({
      ...clothes,
      image: `/api/clothing/images/${clothes.id}`,
    }));
    return clothesWithImageUrls;
  });
};

const getClothes = (id) => {
  return axios.get(`/api/clothing/${id}`).then((response) => {
    return response.data;
  });
};

// getAllClothesIds() 함수 추가
const getAllClothesIds = () => {
  return axios.get("/api/clothing/ids").then((response) => {
    return response.data;
  });
};

const deleteClothes = (id) => {
  return axios.delete(`/api/clothing/${id}`);
};

const updateClothes = async (id, updatedData) => {
  try {
    const response = await axios.put(`/api/clothing/${id}`, updatedData);
    const updatedClothes = response.data;
    return updatedClothes;
  } catch (error) {
    console.error("Failed to update clothes:", error);
    throw error;
  }
};

const getClothesByImageIds = (imageIds) => {
  const imageIdQuery = imageIds.join("&imageIds=");
  return axios.get(`/api/clothing/byImageIds?imageIds=${imageIdQuery}`).then((response) => {
    const clothesWithImageUrls = response.data.map((clothes) => ({
      ...clothes,
      image: `/api/clothing/images/${clothes.id}`,
    }));
    return clothesWithImageUrls;
  });
};




export { getClothesByCategoryAndSubcategory, getAllClothesIds, getClothes,deleteClothes,updateClothes, getClothesByImageIds, };
