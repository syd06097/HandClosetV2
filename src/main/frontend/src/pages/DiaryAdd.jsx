import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";
import styled from "styled-components";
import axios from "axios";
import check from "../images/check.png";
import CategoryMenu from "../components/CategoryMenu";
import DiaryItem from "../components/DiaryItem";
import styles from "../style/ClothingForm.module.css";
import DefaultImage from "../images/default/DefaultImage.png";
const DiaryAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedDateUTC = new Date(searchParams.get("selectedDate"));
  const formattedDate = selectedDateUTC.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환
  const [season, setSeason] = useState([]);
  const [note, setNote] = useState("");
  const [thumbnailpath, setThumbnailpath] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]); // Add this line



  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "jfif"].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailpath(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // 이미지 파일이 아닐 경우 처리할 내용
        alert("이미지 파일만 업로드 가능합니다.");
        e.target.value = null;
      }
    } else {
      setThumbnailpath("");
    }
  };

  const handleImageCancel = () => {
    setThumbnailpath(null);
    const fileInput = document.getElementById(styles.file); // ID를 통해 입력 요소 가져오기
    if (fileInput) {
      fileInput.value = ''; // 입력 요소의 값을 초기화하여 선택한 파일 제거
    }
  };


  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value;
    setSeason((prevSeasons) => {
      if (prevSeasons.includes(selectedSeason)) {
        return prevSeasons.filter((season) => season !== selectedSeason);
      } else {
        return [...prevSeasons, selectedSeason];
      }
    });
  };

  const handleClickCategory = (category, subcategory, items) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedItems(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log( "봐봐", e.target.file.files[0]);
    if (season.length === 0 || selectedImageIds.length === 0) { // Use selectedImageIds here
      alert("적어도 하나의 계절과 이미지를 선택해주세요.");

    } else {
      let season_str = season ? season.join() : "";
      const formData = new FormData();

      // 파일을 업로드할 때 선택한 파일이 없는 경우
      if (!e.target.file.files[0]) {
        // 디폴트 이미지 파일을 formData에 추가
        const defaultImageFile = new File([DefaultImage], 'default.png', { type: 'image/png' });
        formData.append('file', defaultImageFile);
      } else {
        formData.append('file', e.target.file.files[0]);
      }
      formData.append("season", season_str);
      formData.append("date", formattedDate);
      formData.append("imageIds", selectedImageIds.join()); // Add selected image IDs
      formData.append('note', note || '');
      //console.log(selectedImageIds.join());

      for (let key of formData.keys()) {
      console.log(key, ":", formData.get(key));
      }
      console.log(formattedDate);
      try {
        const response = await axios.post("/api/diary", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        navigate(`/Diary`);
      }
    }
  };

  return (
      <StyledWrap>
        <form onSubmit={handleSubmit}>
        {/*<Container>*/}
        <Header>
          <BackButton onClick={() => navigate("/Diary")}>
            <img src={back} alt="back" style={{ width: "28px" }} />
          </BackButton>
          <SubmitButton>
            <button type="submit" ><img src={check} alt="check" style={{ width: "28px" }} /></button>
          </SubmitButton>

        </Header>
        {/*</Container>*/}
        {/*<h2>Add Diary Entry for: {selectedDate}</h2>*/}
        <h2>Add Diary Entry for: {formattedDate}</h2>
        {/* Diary 추가 폼 또는 컴포넌트를 표시할 수 있습니다. */}

        <div className={styles.formGroup}>
          <label className={styles.label}>아이템추가</label>
          <div className={styles.thumbnailContainer}>
            {thumbnailpath ? (
                <div>
                  <img src={thumbnailpath} alt="thumbnail" className={styles.thumbnail}/>
                  <button onClick={handleImageCancel}>취소</button>
                </div>
            ) : (
                <div className={styles.thumbnail}/>
            )}
          </div>
          <label htmlFor={styles.file}>
            <div className={styles.btn_upload}>파일업로드</div>
            <input type="file" name="file" id={styles.file} accept="image/*" onChange={handleImageChange}  />
          </label>
        </div>
        <div>
          <label>
            <input
                type="checkbox"
                value="봄"
                checked={season.includes("봄")}
                onChange={handleSeasonChange}
            />
            봄
          </label>
          <label>
            <input
                type="checkbox"
                value="여름"
                checked={season.includes("여름")}
                onChange={handleSeasonChange}
            />
            여름
          </label>
          <label>
            <input
                type="checkbox"
                value="가을"
                checked={season.includes("가을")}
                onChange={handleSeasonChange}
            />
            가을
          </label>
          <label>
            <input
                type="checkbox"
                value="겨울"
                checked={season.includes("겨울")}
                onChange={handleSeasonChange}
            />
            겨울
          </label>
        </div>
        <div>
          <label>
            <span className={styles.label}>설명</span>
            <br />
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.area}
                placeholder="노트에 기록하세요"
            />
          </label>
        </div>

        <CategoryMenu onClickCategory={handleClickCategory} />
        <DiaryItem
            category={selectedCategory}
            subcategory={selectedSubcategory}
            items={selectedItems}
            selectedImageIds={selectedImageIds} // 이미지 ID 배열을 props로 전달
            setSelectedImageIds={setSelectedImageIds} // 이미지 ID 선택 상태를 업데이트하는 함수를 props로 전달
        />
        </form>
      </StyledWrap>
  );
};
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

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
const SubmitButton = styled.div`
  margin-top: 25px;
  margin-right: 9%;
   
  button{
     all:unset;
   }
`;
const StyledWrap = styled.div`
  position: relative;

  .CategoryMenu {
    position: relative;
    z-index: 1;
  }

  .CategoryItem {
    position: relative;
    z-index: 1;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 50px;
  }
  @media (min-width: 768px) {
    margin-top: 100px;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
`;

const Thumbnail = styled.img`
  display: flex;
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin: auto;
`;

const UploadButton = styled.div`
  width: 150px;
  height: 30px;
  background: #fff;
  border: 1px solid rgb(77, 77, 77);
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgb(77, 77, 77);
    color: #fff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

export default DiaryAdd;
