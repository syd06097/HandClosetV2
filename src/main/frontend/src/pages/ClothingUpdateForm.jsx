import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getClothes } from "../utils/api";
import styles from "../style/ClothingUpdateForm.module.css";
import check from "../images/check.png";
import categories from "../utils/categories";
import availableColors from "../utils/availableColors";
function ClothingUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clothes, setClothes] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [season, setSeason] = useState([]);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  useEffect(() => {

    if (!loginInfo || !loginInfo.accessToken) {
      navigate("/LoginForm");
    }
  }, []);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const clothesData = await getClothes(id);
        setClothes(clothesData);
        setCategory(clothesData.category);
        setSubcategory(clothesData.subcategory);
        setSeason(clothesData.season.split(","));
        setDescription(clothesData.description);
        setColor(clothesData.color);
      } catch (error) {
        console.error("Failed to fetch clothes:", error);
      }
      try {
        const response = await axios.get(`/api/clothing/images/${id}`, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          responseType: "arraybuffer",
        });

        

        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    fetchClothes();
  }, [id]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (season.length === 0) {
      alert("적어도 하나의 계절을 선택해주세요.");
    } else {
      let season_str = season ? season.join() : "";
      console.log({ category, subcategory, season_str, description, color });
      const formData = new FormData();
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("season", season_str);
      formData.append("description", description || "설명없음");
      formData.append("color", color);
      for (let key of formData.keys()) {
        console.log(key, ":", formData.get(key));
      }
      try {
        await axios.put(`/api/clothing/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${loginInfo.accessToken}`,
          }
        });
        navigate(`/clothes/${id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!clothes) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.ImageWrapper}>
            <img
              src={imageUrl}
              alt={clothes.description}
              className={styles.Image}
            />
          </div>
        </div>
        <div className={styles.formAlign}>
          <div>
            <label className={styles.label}>카테고리</label>
            <br />
            <select
              value={category}
              onChange={handleCategoryChange}
              className={styles.select}
              required
            >
              <option value="">없음</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {category && (
            <div style={{ marginTop: "1px" }}>
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
          <br />
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
          <br />
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
            <br />

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
            <br />

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
            <br />

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
          <br />
          <div>
            <label>
              <span className={styles.label}>설명</span>
              <br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.area}
                placeholder="설명을 입력해주세요"
              />
            </label>
          </div>
          <div>
            <button type="submit" className={styles.btn_submit}>
              {" "}
              <img src={check} alt="check" style={{ width: "26px" }} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ClothingUpdateForm;
