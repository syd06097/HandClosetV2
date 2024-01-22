import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DiaryThumbnail = ({ selectedDate }) => {
  const [entryDataList, setEntryDataList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));


  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, []);

  const getImageSrc = async (thumbnailpath) => {
    try {
      const response = await axios.get(`/api/diary/images`, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        params: {
          thumbnailpath: decodeURIComponent(thumbnailpath), 
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
  };

  useEffect(() => {
    const fetchDiaryEntries = async (selectedDate) => {
      try {
        const selectedDateUTC = new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          )
        );
        const formattedDate = selectedDateUTC.toISOString().split("T")[0];
        const response = await axios.get(`/api/diary/entry`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          params: {
            date: formattedDate,
          }
        });

        if (response.data && response.data.length > 0) {
          setEntryDataList(response.data);

          const imageUrls = await Promise.all(
            response.data.map(async (entryData) => {
              const imageUrl = await getImageSrc(entryData.thumbnailpath);
              return imageUrl;
            })
          );
          setImageUrls(imageUrls);
        } else {
          setEntryDataList([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDiaryEntries(selectedDate);
  }, [selectedDate, loginInfo.accessToken, loginInfo.refreshToken]);

  return (
    <StyledDiaryThumbnail>
      {entryDataList.length > 0 ? (
        <div>
          <hr /> 
          <ThumbnailGrid>
            {entryDataList.map((entryData, index) => (
              <ThumbnailItem
                key={entryData.id}
                onClick={() => navigate(`/DiaryDetail/${entryData.id}`)}
              >
                <ThumbnailImage src={imageUrls[index]} alt="Thumbnail" />
              </ThumbnailItem>
            ))}
          </ThumbnailGrid>
          <hr /> 
        </div>
      ) : (
        <p style={{ marginTop: "43%", fontWeight:"bold", color:"#7a7a7a" }}>다이어리를 작성해 주세요!</p>
      )}
    </StyledDiaryThumbnail>
  );
};

const StyledDiaryThumbnail = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-left: 9%;
  margin-right: 9%;
  //margin-top: 50px;
  //margin-bottom: 100px;
`;

const ThumbnailItem = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border: 1px solid lightgray;
  border-radius: 18px;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default DiaryThumbnail;
