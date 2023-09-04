
import React, { useState } from "react";
import styles from "../style/ClothingForm.module.css"
import axios from 'axios';

const ClothingForm = () => {
    const [imgpath, setImgpath] = useState(null);
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [season, setSeason] = useState([]);
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");

    const handleImageChange = (e) => { //이미지 base64 형태로
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
                // 이미지 파일이 아닐 경우 처리할 내용
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
    }
    const handleImageCancel = () => {
        setImgpath(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (season.length === 0) {
            alert('적어도 하나의 계절을 선택해주세요.');
        } else {
            let season_str = season ? season.join() : '';
            console.log({ category, subcategory, season_str, description, color });
            const formData = new FormData();
            formData.append('file', e.target.file.files[0]); // 이미지 파일 추가
            formData.append('category', category);
            formData.append('subcategory', subcategory);
            formData.append('season', season_str)
            formData.append('description', description || '설명없음');
            formData.append('color', color);

            for (let key of formData.keys()) {
                console.log(key, ":", formData.get(key));
            }
            try {
                const response = await axios.post('/api/clothing', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
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

    const categories = [
        { name: "상의", subcategories: ["민소매","반팔티","긴팔티","블라우스/셔츠","맨투맨/후디","니트","기타"] },
        { name: "하의", subcategories: ["반바지","치마","면바지","슬랙스","청바지","트레이닝/조거","기타"] },
        { name: "아우터", subcategories: ["트렌치 코드","코트","자켓/점퍼","블레이저","야상","무스탕","패딩","후드집업","가디건/베스트","기타"] },
        { name: "원피스", subcategories: ["미니 원피스", "미디 원피스","맥시 원피스","기타"] },
        { name: "신발", subcategories: ["운동화", "구두","부츠","샌들","기타"] },
        { name: "가방", subcategories: ["백팩", "숄더/토트백","크로스백","클러치","기타"] },
        { name: "악세사리", subcategories: ["모자", "양말","쥬얼리/시계","머플러/스카프","벨트","기타"] },
        { name: "기타", subcategories: ["이너웨어", "잠옷","수영복"] }
    ];

    const availableColors = ["블랙", "네이비", "블루", "그레이", "아이보리"];

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
                        checked={season.includes("봄")}
                        onChange={handleSeasonChange}
                    />
                    <span>봄</span>
                </label>
                <br />
                <label className={styles.btn_ckbox}>
                    <input
                        type="checkbox"
                        value="여름"
                        checked={season.includes("여름")}
                        onChange={handleSeasonChange}
                    />
                    <span>여름</span>
                </label>
                <br />
                <label className={styles.btn_ckbox}>
                    <input
                        type="checkbox"
                        value="가을"
                        checked={season.includes("가을")}
                        onChange={handleSeasonChange}
                    />
                    <span>가을</span>
                </label>
                <br />
                <label className={styles.btn_ckbox}>
                    <input
                        type="checkbox"
                        value="겨울"
                        checked={season.includes("겨울")}
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
                <label className={styles.label}>색상</label>
                <br />
                <select value={color} onChange={handleColorChange} className={styles.select} required>
                    <option value="">색상 선택</option>
                    {availableColors.map((colorOption) => (
                        <option key={colorOption} value={colorOption}>
                            {colorOption}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button type="submit" className={styles.btn_submit}>제출</button>
            </div>
        </form>
    );
};

export default ClothingForm;