/*import axios from "axios";

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
// const getAllClothesImages = () => {
//   return axios.get("/api/clothing/images/all").then((response) => {
//     return response.data;
//   });
// };
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

export { getClothesByCategoryAndSubcategory, getAllClothesIds, getClothes };*/
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

export { getClothesByCategoryAndSubcategory, getAllClothesIds, getClothes };
