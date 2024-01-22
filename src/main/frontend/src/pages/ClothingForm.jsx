import React, {useEffect, useState} from "react";
import styles from "../style/ClothingForm.module.css";
import axios from "axios";
import check from "../images/check.png";
import back from "../images/back.png";
import { useNavigate } from "react-router-dom";
import categories from "../utils/categories";
import availableColors from "../utils/availableColors";
const ClothingForm = () => {
  const [imgpath, setImgpath] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [season, setSeason] = useState([]);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, []);
  const handleImageChange = (e) => {
    //이미지 base64 형태로
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "jfif"].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgpath(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
       
        alert("이미지 파일만 업로드 가능합니다.");
        e.target.value = null;
      }
    } else {
      setImgpath("");
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory("");
  };

  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
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

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  const handleImageCancel = () => {
    setImgpath(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (season.length === 0) {
      alert("적어도 하나의 계절을 선택해주세요.");
    } else {
      let season_str = season ? season.join() : "";
      console.log({ category, subcategory, season_str, description, color });
      const formData = new FormData();
      formData.append("file", e.target.file.files[0]); // 이미지 파일 추가
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("season", season_str);
      formData.append("description", description || "설명없음");
      formData.append("color", color);

      
      try {
        const response = await axios.post("/api/clothing", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${loginInfo.accessToken}`,
          }
        });
        const data = response.data;
        console.log(data);
        setImgpath(null);
        setCategory("");
        setSubcategory("");
        setSeason([]);
        setDescription("");
        setColor("");
      } catch (error) {
        console.error(error);
      }
    }
  };




  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>아이템추가</label>
        <div className={styles.thumbnailContainer}>
          {imgpath ? (
            <div>
              <img src={imgpath} alt="clothing" className={styles.thumbnail} />
              <button onClick={handleImageCancel}>취소</button>
            </div>
          ) : (
            <div className={styles.thumbnail} />
          )}
        </div>
        <label for={styles.file}>
          <div className={styles.btn_upload}>파일업로드</div>
          <input
            type="file"
            name="file"
            id={styles.file}
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>
      </div>
      <div className={styles.formAlign}>
        <div>
          <label className={styles.label}>카테고리</label>
          <br/>
          <select
              value={category}
              onChange={handleCategoryChange}
              className={styles.select}
              required
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
            ))}
          </select>
        </div>
        {category && (
            <div style={{marginTop: "1px"}}>
              <filedset className={styles.subcat}>
                {categories
                    .find((c) => c.name === category)
                    .subcategories.map((subcat) => (
                        <label key={subcat} className={styles.subcat_label}>
                          <input
                              type="radio"
                              name="subcategory"
                              value={subcat}
                              checked={subcategory === subcat}
                              onChange={handleSubcategoryChange}
                              id={styles.subcategory}
                              required
                          />
                          <span>{subcat}</span>
                        </label>
                    ))}
              </filedset>
            </div>
        )}
        <br/>
        <span className={styles.label}>계절</span>
        <div className={styles.ckbox_group}>
          <input
              type="checkbox"
              value="봄"
              checked={season.includes("봄")}
              onChange={handleSeasonChange}
              id="spring"
          />
          <label className={styles.btn_ckbox} htmlFor="spring">
            <span>봄</span>
          </label>
          <br/>

          <input
              type="checkbox"
              value="여름"
              checked={season.includes("여름")}
              onChange={handleSeasonChange}
              id="summer"
          />
          <label className={styles.btn_ckbox} htmlFor="summer">
            <span>여름</span>
          </label>
          <br/>

          <input
              type="checkbox"
              value="가을"
              checked={season.includes("가을")}
              onChange={handleSeasonChange}
              id="autumn"
          />
          <label className={styles.btn_ckbox} htmlFor="autumn">
            <span>가을</span>
          </label>
          <br/>

          <input
              type="checkbox"
              value="겨울"
              checked={season.includes("겨울")}
              onChange={handleSeasonChange}
              id="winter"
          />
          <label className={styles.btn_ckbox} htmlFor="winter">
            <span>겨울</span>
          </label>
        </div>
        <br/>
        <div>
          <label className={styles.label}>색상</label>
          <br />
          <select
            value={color}
            onChange={handleColorChange}
            className={styles.select}
            required
          >
            <option value="">색상 선택</option>
            {availableColors.map((colorOption) => (
              <option key={colorOption} value={colorOption}>
                {colorOption}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <div>
          <label className={styles.label}>설명</label>
          <br/>
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.area}
              placeholder="설명을 입력해주세요"
          />
        </div>
        <div>
          <button
              onClick={() => navigate("/Closet")}
              className={styles.btn_back}
          >
            <img src={back} alt="back" style={{width: "26px"}}/>
          </button>
        </div>
        <div>
          <button type="submit" className={styles.btn_submit}>
            {" "}
            <img src={check} alt="check" style={{width: "26px"}}/>
          </button>
        </div>
        <br/>
        <br/>
        {/*<br/>*/}
        {/*<br/>*/}
      </div>
    </form>
  );
};

export default ClothingForm;
