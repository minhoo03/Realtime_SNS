import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 50px;
  background-color: black;
  font-weight: 500;
  width: 100%;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider(); // 만약 cordova와 auth의 GithubAuthProvider 2개가 나온다면 auth 선택.
      await signInWithPopup(auth, provider); // 로그인 팝업 (인증 인스턴스, 공급원 제공)
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      {/* <Logo src="/github-logo.svg" /> */}
      Continue with Github
    </Button>
  );
}