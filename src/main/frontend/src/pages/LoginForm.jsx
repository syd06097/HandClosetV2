import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import back from "../images/back.png";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  //align-items: flex-start;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
`;

const BackButton = styled.div`
  margin-top: 26px;
  margin-left: 9%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 9%;
  margin-right: 9%;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  background-color: #364054;
  color: #fff;
  margin-left: 9%;
  margin-right: 9%;
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8090/members/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const loginInfo = response.data;
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        navigate("/MyPage"); // 메인 페이지로 이동
        alert("로그인 완료");
        // 로그인 상태 변경 이벤트 발생
        const event = new Event("loginStatusChanged");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error(error);
      alert("이메일이나 암호가 틀렸습니다.");
      setErrorMessage("이메일이나 암호가 틀렸습니다.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/MyPage")}>
          <img src={back} alt="back" style={{ width: "26px" }} />
        </BackButton>
      </Header>
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            color: "#364054",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "40px",
          }}
        >
          로그인
        </div>

        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">로그인하기</Button>
        <div
          onClick={() => navigate("/JoinForm")}
          style={{
            textAlign: "right",
            marginLeft: "9%",
            marginRight: "9%",
            color: "gray",
          }}
        >
          회원가입 하러가기
        </div>
      </Form>
    </Container>
  );
}

export default LoginForm;
