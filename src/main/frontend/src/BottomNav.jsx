import React, { useState } from "react";
import "./BottomNav.css";
import { Link } from "react-router-dom";

// 사용할 아이콘 import
import "./FontAwesome";
// FontAwesomIcon 컴포넌트를 사용하기 위해 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const BottomNav = () => {
  // 현재 선택된 아이콘을 관리하는 state
  const [activeNav, setActiveNav] = useState(1);
  return (
    <nav className="wrapper">
      {/* 하단 네비게이션 최상위 태그 */}
      <Link to="/Main" className="nav-link" onClick={() => setActiveNav(1)}>
        <div>
          <FontAwesomeIcon
            icon="home"
            size="2x"
            className={activeNav === 1 ? "nav-item active" : "nav-item"}
          />
        </div>
      </Link>
      <Link to="/Closet" className="nav-link" onClick={() => setActiveNav(2)}>
        <div>
          <FontAwesomeIcon
            icon="box"
            size="2x"
            className={activeNav === 2 ? "nav-item active" : "nav-item"}
          />
        </div>
      </Link>
      <Link to="/Calendar" className="nav-link" onClick={() => setActiveNav(3)}>
        <div>
          <FontAwesomeIcon
            icon="calendar"
            size="2x"
            className={activeNav === 3 ? "nav-item active" : "nav-item"}
          />
        </div>
      </Link>
      <Link to="/MyPage" className="nav-link" onClick={() => setActiveNav(4)}>
        <div class="menu_title">
          <FontAwesomeIcon
            icon="user"
            size="2x"
            className={activeNav === 4 ? "nav-item active" : "nav-item"}
          />
        </div>
      </Link>
    </nav>
  );
};

export default BottomNav;
