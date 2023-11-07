// import { useState } from "react";
// import axios from "axios";
// import {useNavigate} from "react-router-dom";
//
// const useLogout = () => {
//     const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
//     const navigate = useNavigate();
//     const handleLogoutDialogOpen = () => {
//         setLogoutDialogOpen(true);
//     };
//
//     const handleLogoutDialogClose = () => {
//         setLogoutDialogOpen(false);
//     };
//
//     const handleLogout = async () => {
//         const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
//
//         if (loginInfo) {
//             try {
//                 const response = await axios.delete(
//                     "http://localhost:8090/members/logout",
//                     {
//                         headers: {
//                             Authorization: `Bearer ${loginInfo.accessToken}`,
//                         },
//                         data: { refreshToken: loginInfo.refreshToken },
//                     }
//                 );
//
//                 if (response.status === 200) {
//                     localStorage.removeItem("loginInfo");
//                     navigate("/LoginForm");
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//
//         setLogoutDialogOpen(false);
//     };
//
//     return {
//         logoutDialogOpen,
//         handleLogoutDialogOpen,
//         handleLogoutDialogClose,
//         handleLogout,
//     };
// };
//
// export default useLogout;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const useLogout = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (loginInfo) {
      const confirmed = window.confirm("로그아웃하시겠습니까?");
      if (confirmed) {
        try {
          const response = await axios.delete(
            "http://localhost:8090/members/logout",
            {
              headers: {
                Authorization: `Bearer ${loginInfo.accessToken}`,
              },
              data: { refreshToken: loginInfo.refreshToken },
            }
          );

          if (response.status === 200) {
            localStorage.removeItem("loginInfo");
            navigate("/LoginForm");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return {
    logoutDialogOpen,
    handleLogoutDialogOpen,
    handleLogoutDialogClose,
    handleLogout,
  };
};

export default useLogout;
