import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function AdminPage() {
    const navigate = useNavigate();
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    useEffect(() => {

        if (!loginInfo || !loginInfo.accessToken) {
            navigate("/LoginForm");

        }
    }, [loginInfo, navigate]);


    return (
        <div>
            <h1>This id AdminPage!</h1>
        </div>
    );
}

export default AdminPage;