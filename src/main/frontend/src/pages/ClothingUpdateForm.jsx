import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

import { getClothes, updateClothes } from "../utils/api";
import styles from "./ClothingUpdateForm.module.css"
import styled from "styled-components";

function ClothingUpdateForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clothes, setClothes] = useState(null);
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [season, setSeason] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const clothesData = await getClothes(id);
                setClothes(clothesData);
                setCategory(clothesData.category);
                setSubcategory(clothesData.subcategory);
                setSeason(clothesData.season.split(","));
                setDescription(clothesData.description);
            } catch (error) {
                console.error("Failed to fetch clothes:", error);
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (season.length === 0) {
            alert('적어도 하나의 계절을 선택해주세요.');
        } else {
            let season_str = season ? season.join() : '';
            console.log({ category, subcategory, season_str, description });
            const formData = new FormData();
            formData.append('category', category);
            formData.append('subcategory', subcategory);
            formData.append('season', season_str)
            formData.append('description', description || '설명없음');
            for (let key of formData.keys()) {
                console.log(key, ":", formData.get(key));
            }
            try {
                await axios.put(`/api/clothing/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
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

    const categories = [
        { name: "상의", subcategories: ["민소매","반팔티","긴팔티","블라우스/셔츠","맨투맨/후디","니트","기타"] },
        { name: "하의", subcategories: ["반바지","치마","면바지","슬랙스","청바지","트레이닝/조거","기타"] },
        { name: "아우터", subcategories: ["트렌치 코드","코트","자켓/점퍼","야상","무스탕","패딩","후드집업","가디건/베스트","기타"] },
        { name: "원피스", subcategories: ["미니 원피스", "미디 원피스","맥시 원피스","기타"] },
        { name: "신발", subcategories: ["운동화", "구두","부츠","샌들","기타"] },
        { name: "가방", subcategories: ["백팩", "숄더/토트백","크로스백","클러치","기타"] },
        { name: "악세사리", subcategories: ["모자", "양말","쥬얼리/시계","머플러/스카프","벨트","기타"] },
        { name: "기타", subcategories: ["이너웨어", "잠옷","수영복"] }
    ];

    return (
        <Container>
        <div>
            <ImageWrapper>
                <Image src={`/api/clothing/images/${id}`} alt={clothes.description} />
            </ImageWrapper>
        <form onSubmit={handleSubmit}>
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
                <button type="submit" className={styles.btn_submit}>제출</button>
            </div>
        </form>
        </div>
        </Container>
    );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ImageWrapper = styled.div`
  width: 300px;
  height: 300px;
  margin-top: 20px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;
//
// const FormWrapper = styled.div`
//   width: 400px;
//   padding: 20px;
//   background-color: #f5f5f5;
//   border-radius: 4px;
// `;
//
// const FormTitle = styled.h2`
//   margin-bottom: 20px;
//   text-align: center;
// `;
//
// const Form = styled.form``;
//
// const FormItem = styled.div`
//   margin-bottom: 15px;
// `;
//
// const Label = styled.label`
//   display: block;
//   margin-bottom: 5px;
//   font-weight: bold;
// `;
//
// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// `;
//
// const CheckboxGroup = styled.div`
//   display: flex;
//   margin-top: 5px;
// `;
//
// const CheckboxItem = styled.div`
//   display: flex;
//   align-items: center;
//   margin-right: 10px;
// `;
//
// const Checkbox = styled.input`
//   margin-right: 5px;
// `;
//
// const Textarea = styled.textarea`
//   width: 100%;
//   height: 80px;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// `;
//
// const SubmitButton = styled.button`
//   display: block;
//   width: 100%;
//   padding: 8px;
//   background-color: #4caf50;
//   color: #fff;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// `;

export default ClothingUpdateForm;