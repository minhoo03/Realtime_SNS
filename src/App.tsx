import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { auth } from './firebase';

import LoadingScreen from "./components/loading-screen";
import Layout from './components/Layout';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import NotFound from './routes/NotFound';
import ProtectedRoute from './components/protected-route'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // Home, Profile은 로그인 여부에 따라 Login 페이지로 이동
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  },
  {
    path: "/*",
    element: <NotFound />
  }
])

const GlobalStyle = createGlobalStyle`
  ${reset},
  * {
    box-sizing: border-box;
  }
`

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    // firebase 대기
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyle />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App
