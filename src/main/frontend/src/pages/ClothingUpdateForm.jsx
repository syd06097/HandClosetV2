import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { getClothes } from "../utils/api";

import styles from "../style/ClothingUpdateForm.module.css";
import check from "../images/check.png";

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
  }, [loginInfo, navigate]);

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

        console.log("response:", response);

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
          },
          data: { refreshToken: loginInfo.refreshToken },
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

  const categories = [
    {
      name: "상의",
      subcategories: [
        "민소매",
        "반팔티",
        "긴팔티",
        "블라우스/셔츠",
        "맨투맨/후디",
        "니트",
        "기타",
      ],
    },
    {
      name: "하의",
      subcategories: [
        "반바지",
        "치마",
        "면바지",
        "슬랙스",
        "청바지",
        "트레이닝/조거",
        "기타",
      ],
    },
    {
      name: "아우터",
      subcategories: [
        "트렌치코트",
        "코트",
        "자켓/점퍼",
        "블레이저",
        "야상",
        "무스탕",
        "패딩",
        "후드집업",
        "가디건/베스트",
        "기타",
      ],
    },
    {
      name: "원피스",
      subcategories: ["미니 원피스", "미디 원피스", "맥시 원피스", "기타"],
    },
    { name: "신발", subcategories: ["운동화", "구두", "부츠", "샌들", "기타"] },
    {
      name: "가방",
      subcategories: ["백팩", "숄더/토트백", "크로스백", "클러치", "기타"],
    },
    {
      name: "악세사리",
      subcategories: [
        "모자",
        "양말",
        "쥬얼리/시계",
        "머플러/스카프",
        "벨트",
        "기타",
      ],
    },
    { name: "기타", subcategories: ["이너웨어", "잠옷", "수영복"] },
  ];
  const availableColors = [
    "화이트",
    "블랙",
    "네이비",
    "블루",
    "그레이",
    "아이보리",
    "베이지",
    "옐로우",
    "그린",
    "카키",
    "핑크",
    "레드",
    "퍼플",
    "브라운",
    "연청",
    "중청",
    "진청",
    "흑청",
  ];

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
              <img src={check} alt="check" style={{ width: "28px" }} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ClothingUpdateForm;
