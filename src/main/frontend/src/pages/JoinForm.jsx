import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../images/back.png";
import styled from "styled-components";
import axios from "axios";
const JoinForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 추가
  const navigate = useNavigate();




  const handleSubmit = async (event) => {
    event.preventDefault();

    const memberSignupDto = {
      email,
      password,
      name,
    };
    try {
      const response = await axios.post(
        "http://localhost:8090/members/signup",
        memberSignupDto
      );
      if (response.status === 200 || response.status == 201) {
        alert("회원가입 완료");
        navigate("/LoginForm");
      }
    } catch (error) {
      alert("회원가입 실패");
      console.error(error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/LoginForm")}>
          <img src={back} alt="back" style={{ width: "28px" }} />
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
          회원가입
        </div>

        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />

        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />

        <Button type="submit">회원가입하기</Button>
      </Form>
    </Container>
  );
};

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
  margin-top: 25px;
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
export default JoinForm;
