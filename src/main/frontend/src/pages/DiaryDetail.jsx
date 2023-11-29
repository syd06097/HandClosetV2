import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { getClothesByImageIds } from "../utils/api";
import back from "../images/back.png";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormat";
import trash from "../images/trash.png";

function DiaryDetail() {
  const { id } = useParams();
  const [diary, setDiary] = useState({});
  const [clothesData, setClothesData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [thumbnailImageSrc, setThumbnailImageSrc] = useState("");
  const [itemImageSrc, setItemImageSrc] = useState([]);
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));


  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, [loginInfo, navigate]);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await axios.get(`/api/diary/entryData/${id}`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          data: { refreshToken: loginInfo.refreshToken },
        });
        setDiary(response.data);
        const imageIds = response.data.imageIds;

        console.log(imageIds);
        if (imageIds.length > 0) {
          fetchClothesData(imageIds);
          fetchThumbnail(response.data.thumbnailpath);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch diary entry:", error);
      }
    };

    const fetchThumbnail = async (thumbnailpath) => {
      try {
        const response = await axios.get(
          `/api/diary/images?thumbnailpath=${encodeURIComponent(
            thumbnailpath
          )}`,
          {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
            responseType: "arraybuffer",
          }
        );
        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        setThumbnailImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to fetch thumbnail image:", error);
      }
    };

    const fetchImages = async (clothesData) => {
      try {
        const imagePromises = clothesData.map(async (clothes) => {
          const response = await axios.get(
            `/api/clothing/images/${clothes.id}`,
            {
              headers: {
                Authorization: `Bearer ${loginInfo.accessToken}`,
              },
              responseType: "arraybuffer",
            }
          );
          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
          const imageSrc = URL.createObjectURL(blob);
          return { id: clothes.id, imageSrc };
        });
        const images = await Promise.all(imagePromises);
        setItemImageSrc(images);
      } catch (error) {
        console.error("Failed to fetch clothing images:", error);
      }
    };

    const fetchClothesData = async (imageIds) => {
      try {
        const response = await getClothesByImageIds(imageIds);

        if (Array.isArray(response) && response.length > 0) {
          setClothesData(response);
          setLoading(false);
          fetchImages(response);
        } else {
          console.error("Invalid response data:", response);
        }
      } catch (error) {
        console.error("Failed to fetch clothes data:", error);
      } finally {
        console.log("fetchClothesData 함수 실행 ");
      }
    };

    fetchDiary();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/diary/${id}`, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        data: { refreshToken: loginInfo.refreshToken },
      });
      navigate("/Diary");
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

  return (
    <div>
      <Container>
        <Header>
          <BackButton onClick={() => navigate("/Diary")}>
            <img src={back} alt="back" style={{ width: "26px" }} />
          </BackButton>
          <TrashWrapper onClick={handleDelete}>
            <img src={trash} alt="trash" />
          </TrashWrapper>
        </Header>
        <ThumbnailImage src={thumbnailImageSrc} alt="Thumbnail" />
      </Container>
      {clothesData.map((clothes) => (
        <div key={clothes.id}>
          <ClothesItem>
            <ItemImage
              src={
                itemImageSrc.find((item) => item.id === clothes.id)?.imageSrc ||
                ""
              }
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
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 26px;
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
  align-items: center;
  margin-top: 20px;
  margin-left: 9%;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border: 1px solid lightgray;
  border-radius: 18px;
  overflow: hidden;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Elements = styled.div`
  text-align: left;
  margin-bottom: 3px;
  font-weight: bold;
  color: #333;
`;

export default DiaryDetail;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios"; // Axios를 이용하여 서버 요청 처리
// import styled from "styled-components";
// import { getClothesByImageIds } from "../utils/api"; // utils/api에서 getClothes 함수를 불러옴
// import back from "../images/back.png";
// import { useNavigate } from "react-router-dom";
// import { formatDate } from "../utils/dateFormat";
// import trash from "../images/trash.png";
// function DiaryDetail() {
//   const { id } = useParams(); // URL 파라미터에서 'id'를 추출
//   const [diary, setDiary] = useState({}); // 다이어리 정보를 담을 상태 변수
//   const [clothesData, setClothesData] = useState({}); // 의류 정보를 담을 상태 변수
//   const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태 변수
//   const navigate = useNavigate();
//   const [thumbnailImageSrc, setThumbnailImageSrc] = useState('');
//   const [itemImageSrc, setItemImageSrc] = useState([]);
//   const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
//
//
//   useEffect(() => {
//     const fetchDiary = async () => {
//       try {
//         const response = await axios.get(`/api/diary/entryData/${id}`, {
//           headers: {
//             Authorization: `Bearer ${loginInfo.accessToken}`,
//           },
//           data: { refreshToken: loginInfo.refreshToken },
//         });
//         setDiary(response.data);
//         const imageIds = response.data.imageIds;
//
//         console.log(imageIds);
//         if (imageIds.length > 0) {
//           fetchClothesData(imageIds);
//           fetchThumbnail(response.data.thumbnailpath);
//
//         } else {
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch diary entry:", error);
//       }
//     };
//       const fetchThumbnail=async(thumbnailpath)=>{
//         try {
//
//           const response = await axios.get(`/api/diary/images?thumbnailpath=${encodeURIComponent(thumbnailpath)}`, {
//             headers: {
//               Authorization: `Bearer ${loginInfo.accessToken}`,
//             },
//             responseType: 'arraybuffer'
//           });
//           const arrayBufferView = new Uint8Array(response.data);
//           const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
//           setThumbnailImageSrc(URL.createObjectURL(blob));
//         } catch (error) {
//           console.error("Failed to fetch thumbnail image:", error);
//         }
//       };
//
//
//
//     fetchDiary();
//     // fetchThumbnail();
//   }, [id]);
//   useEffect(() => {
//     // diary가 업데이트될 때마다 로그로 출력
//     console.log(diary);
//   }, [diary]);
//
//
//     const fetchImages = async (clothesData) => {
//       try {
//         const imagePromises = clothesData.map(async (clothes) => {
//           const response = await axios.get(`/api/clothing/images/${clothes.id}`, {
//             headers: {
//               Authorization: `Bearer ${loginInfo.accessToken}`
//             },
//             responseType: 'arraybuffer'
//           });
//           const arrayBufferView = new Uint8Array(response.data);
//           const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
//           const imageSrc = URL.createObjectURL(blob);
//           return { id: clothes.id, imageSrc };
//         });
//         const images = await Promise.all(imagePromises);
//         setItemImageSrc(images);
//       } catch (error) {
//         console.error("Failed to fetch clothing images:", error);
//       }
//     };
//
//   const fetchClothesData = async (imageIds) => {
//     try {
//       const response = await getClothesByImageIds(imageIds);
//       // response 자체를 출력하여 데이터 확인
//       console.log(response);
//
//       // 응답 데이터의 구조에 따라서 처리
//       if (Array.isArray(response) && response.length > 0) {
//         // 배열 형식의 데이터가 존재하는 경우
//         setClothesData(response);
//         setLoading(false);
//         fetchImages(clothesData);
//       } else {
//         console.error("Invalid response data:", response);
//         // 오류 처리 로직 추가
//       }
//     } catch (error) {
//       console.error("Failed to fetch clothes data:", error);
//       // 오류 처리 로직 추가
//     } finally {
//       console.log("fetchClothesData 함수 실행 ");
//     }
//   };
//
//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/api/diary/${id}`);
//       navigate("/Diary");
//       // Optionally, navigate the user to a different page or refresh the entries.
//     } catch (error) {
//       console.error("Failed to delete diary entry:", error);
//     }
//   };
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (!clothesData || clothesData.length === 0) {
//     return <div>No clothes data available.</div>;
//   }
//
//   // 다이어리와 의류 데이터를 화면에 출력
//   return (
//       <div>
//         <Container>
//           <Header>
//             <BackButton onClick={() => navigate("/Diary")}>
//               <img src={back} alt="back" style={{ width: "28px" }} />
//             </BackButton>
//             <TrashWrapper onClick={handleDelete}>
//               <img src={trash} alt="trash" />
//             </TrashWrapper>
//           </Header>
//
//           <ThumbnailImage src={thumbnailImageSrc} alt="Thumbnail" />
//         </Container>
//         {clothesData.map((clothes) => (
//             <div>
//               <ClothesItem key={clothes.id}>
//                 <ItemImage
//                     src={itemImageSrc.find(item => item.id === clothes.id)?.imageSrc || ''}
//                     alt={clothes.description}
//                 />
//                 <Details>
//                   <Elements>카테고리: {clothes.category}</Elements>
//                   <Elements>계절: {clothes.season}</Elements>
//                   <Elements>착용횟수: {clothes.wearcnt}회</Elements>
//                   <Elements>등록일: {formatDate(clothes.createdate)}</Elements>
//                 </Details>
//               </ClothesItem>
//             </div>
//         ))}
//
//       </div>
//   );
// }
//
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   //align-items: flex-start;
// `;
// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   width: 100%;
//   height: 40px;
//   margin-bottom: 30px;
// `;
//
// const BackButton = styled.div`
//   margin-top: 25px;
//   margin-left: 9%;
// `;
// const TrashWrapper = styled.div`
//   margin-top: 25px;
//   margin-right: 9%;
// `;
// const ThumbnailImage = styled.img`
//   width: 330px;
//   height: 330px;
//   margin-top: 20px;
//   border: 1px solid lightgray;
//   border-radius: 18px;
//   object-fit: cover;
// `;
//
// const ClothesItem = styled.div`
//   display: flex;
//   align-items: center; /* align-items를 flex-start로 변경합니다. */
//   margin-top: 20px;
//   margin-left: 9%;
// `;
//
// const ItemImage = styled.img`
//   width: 100px;
//   height: 100px;
//   object-fit: cover;
//   margin-right: 20px;
//   //align-items: flex-start;
//   //margin-left: 9%; /* 새로 추가한 부분 */
//   border: 1px solid lightgray;
//   border-radius: 18px;
//   overflow: hidden;
// `;
//
// const Details = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
// const Elements = styled.div`
//   text-align: left;
//   margin-bottom: 3px;
//   font-weight: bold;
//   color:#333;
// `;
//
// export default DiaryDetail;
