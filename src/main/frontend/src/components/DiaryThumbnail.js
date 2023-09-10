import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DiaryThumbnail = ({ selectedDate }) => {
  const [entryDataList, setEntryDataList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch diary entry data for the selected date
    fetchDiaryEntries(selectedDate);
  }, [selectedDate]);

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
        params: {
          date: formattedDate,
        },
      });

      if (response.data && response.data.length > 0) {
        setEntryDataList(response.data);
      } else {
        setEntryDataList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledDiaryThumbnail>
      {entryDataList.length > 0 ? (
        <div>
          <hr /> {/* 위에 줄 */}
          <ThumbnailGrid>
            {entryDataList.map((entryData) => (
              <ThumbnailItem
                key={entryData.id}
                onClick={() => navigate(`/DiaryDetail/${entryData.id}`)}
              >
                <ThumbnailImage
                  src={`/api/diary/images?thumbnailpath=${encodeURIComponent(
                    entryData.thumbnailpath
                  )}`}
                  alt="Thumbnail"
                />
              </ThumbnailItem>
            ))}
          </ThumbnailGrid>
          <hr /> {/* 아래 줄 */}
        </div>
      ) : (
        <p style={{ marginTop: "43%" }}>다이어리를 추가해 주세요!</p>
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
