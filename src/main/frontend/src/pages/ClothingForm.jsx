import React, { useState } from "react";
import styles from "./ClothingForm.module.css"


const ClothingForm = () => {
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [seasons, setSeasons] = useState([]);
    const [description, setDescription] = useState("");

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result);
              };
              reader.readAsDataURL(selectedFile);
            } else {
              // 이미지 파일이 아닐 경우 처리할 내용
              alert("이미지 파일만 업로드 가능합니다.");
              e.target.value = null;
            }
          } else {
            setImage("");
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
        setSeasons((prevSeasons) => {
            if (prevSeasons.includes(selectedSeason)) {
                return prevSeasons.filter((season) => season !== selectedSeason);
            } else {
                return [...prevSeasons, selectedSeason];
            }
        });
    };

    const handleImageCancel = () => {
        setImage(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 여기서 백엔드로 데이터를 보내는 로직을 구현해야 합니다.
        console.log({ image, category, subcategory, seasons, description });
        const formData = new FormData();
        formData.append('image', image);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        seasons.forEach((season) => {
            formData.append('seasons[]', season);
        });
        formData.append('description', description);

        try {
            const response = await fetch('/api/clothing', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const categories = [
        { name: "상의", subcategories: ["티셔츠", "셔츠","맨투맨/후디","니트","기타"] },
        { name: "하의", subcategories: ["바지", "청바지","트레이닝/조거","기타"] },
        { name: "아우터", subcategories: ["코트", "자켓/점퍼","패딩","후드집업","가디건/베스트","기타"] },
        { name: "신발", subcategories: ["운동화", "구두","부츠","샌들","기타"] },
        { name: "가방", subcategories: ["백팩", "숄더/토트백","크로스백","클러치","기타"] },
        { name: "악세사리", subcategories: ["모자", "양말","쥬얼리/시계","머플러/스카프","벨트","기타"] },
        { name: "기타", subcategories: ["이너웨어", "잠옷","수영복"] }
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>아이템추가</label>
                <div className={styles.thumbnailContainer}>
                    {image ? (
                        <div>
                        <img src={image} alt="clothing" className={styles.thumbnail} />
                        <button onClick={handleImageCancel}>취소</button>
                        </div>
                    ) : (
                        <div className={styles.thumbnail} />
                    )}
                </div>
                <label for={styles.file}>
                        <div className={styles.btn_upload}>파일업로드</div>             
                <input type="file" name="file" id={styles.file} accept="image/*" onChange={handleImageChange} required/>
                </label>
            </div>
            <div>
                <label className={styles.label}>카테고리</label>    
                    <br/>
                    <select value={category} onChange={handleCategoryChange} className={styles.select} required>
                        <option value="">없음</option>
                        {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
            </div>
            {category && (
                <div style={{marginTop:"1px"}}>
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
                                        required/>
                                    <span>{subcat}</span>
                                </label>
                            ))}
                    </filedset>
                </div>
            )}
            <br/>
            <span className={styles.label}>계절</span>
            <div className={styles.ckbox_group}>
                    <label className={styles.btn_ckbox}> 
                        <input
                            type="checkbox"
                            value="봄"
                            checked={seasons.includes("봄")}
                            onChange={handleSeasonChange}
                        />
                        <span>봄</span>
                    </label>
                    <br />
                    <label className={styles.btn_ckbox}>
                        <input
                            type="checkbox"
                            value="여름"
                            checked={seasons.includes("여름")}
                            onChange={handleSeasonChange}
                        />
                        <span>여름</span>
                    </label>
                    <br />
                    <label className={styles.btn_ckbox}>
                        <input
                            type="checkbox"
                            value="가을"
                            checked={seasons.includes("가을")}
                            onChange={handleSeasonChange}
                        />
                        <span>가을</span>
                    </label>
                    <br />
                    <label className={styles.btn_ckbox}>
                        <input
                            type="checkbox"
                            value="겨울"
                            checked={seasons.includes("겨울")}
                            onChange={handleSeasonChange}
                        />
                        <span>겨울</span>
                    </label>
            </div>
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
                <button type="submit" className={styles.btn_submit}>제출</button>
            </div>
        </form>
    );
};

export default ClothingForm;