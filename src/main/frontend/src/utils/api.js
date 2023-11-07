import axios from "axios";
import { useNavigate } from "react-router-dom";
const getClothesByCategoryAndSubcategory = (category, subcategory) => {
  let url = "/api/clothing/category";
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  url += `?category=${category}&subcategory=${subcategory}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${loginInfo.accessToken}`,
    },
    data: { refreshToken: loginInfo.refreshToken },
  }).then((response) => {
    const clothesWithImageUrls = response.data.map((clothes) => ({
      ...clothes,
      image: `/api/clothing/images/${clothes.id}`,
    }));
    return clothesWithImageUrls;
  });
};

const getClothes = (id) => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  return axios.get(`/api/clothing/${id}`, {
    headers: {
      Authorization: `Bearer ${loginInfo.accessToken}`,
    },
    data: { refreshToken: loginInfo.refreshToken },
  }).then((response) => {
    return response.data;
  });
};

const getAllClothesIds = () => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));


  return axios.get("/api/clothing/ids", {
    headers: {
      Authorization: `Bearer ${loginInfo.accessToken}`,
    },
    data: { refreshToken: loginInfo.refreshToken },
  }).then((response) => {
    return response.data;
  });
};

const deleteClothes = (id) => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  return axios.delete(`/api/clothing/${id}`, {
    headers: {
      Authorization: `Bearer ${loginInfo.accessToken}`,
    },
    data: { refreshToken: loginInfo.refreshToken },
  });
};

const getClothesByImageIds = (imageIds) => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const imageIdQuery = imageIds.join("&imageIds=");
  return axios
      .get(`/api/clothing/byImageIds?imageIds=${imageIdQuery}`, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        data: { refreshToken: loginInfo.refreshToken },
      })
      .then((response) => {
        const clothesWithImageUrls = response.data.map((clothes) => ({
          ...clothes,
          image: `/api/clothing/images/${clothes.id}`,
        }));
        return clothesWithImageUrls;
      });
};

export {
  getClothesByCategoryAndSubcategory,
  getAllClothesIds,
  getClothes,
  deleteClothes,
  getClothesByImageIds,
};
