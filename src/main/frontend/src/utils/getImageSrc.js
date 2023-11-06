import axios from "axios";

const getImageSrc = async (category, ids, item, index) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    if (category === "전체") {
        try {
            const response = await axios.get(`/api/clothing/images/${ids[index]}`, {
                headers: {
                    Authorization: `Bearer ${loginInfo.accessToken}`,
                },
                responseType: 'arraybuffer'
            });
            const arrayBufferView = new Uint8Array(response.data);
            const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } catch (error) {
            console.error("Failed to fetch image:", error);
            return null;
        }
    } else {
        return item.image;
    }
};

export default getImageSrc;