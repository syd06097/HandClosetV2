import React, {useEffect} from "react";
import PlusIcon from "../images/PlusIcon.png";
import { useNavigate } from "react-router-dom";
function AddClothes() {
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    useEffect(() => {

        if (!loginInfo || !loginInfo.accessToken) {
            navigate("/LoginForm");
        }
    }, [loginInfo, navigate]);

  const plusIconStyle = {
    width: "15%",
    position: "fixed",
    top: "85%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div>
      <img
        src={PlusIcon}
        alt="추가하기"
        style={plusIconStyle}
        onClick={() => {
          navigate("/ClothingForm");
        }}
      />
    </div>
  );
}

export default AddClothes;
