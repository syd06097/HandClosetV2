import React from "react";
import PlusIcon from "../images/PlusIcon.png";
import { useNavigate } from "react-router-dom";

const ClosetItem = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h3>등록한 옷이 없어요.</h3>
      <div className="Plus">
        <img
          src={PlusIcon}
          alt="추가하기"
          style={{ width: "15%" }}
          onClick={() => {
            navigate("/ClothingForm");
          }}
        />
      </div>
    </div>
  );
};

export default ClosetItem;
