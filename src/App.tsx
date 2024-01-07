import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Layout from './components/Layout'
import Home from './routes/Home'
import Profile from './routes/Profile'
import Login from './routes/Login'
import Signup from './routes/Signup'
import NotFound from './routes/NotFound'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    path: "/signup",
    element: <Signup />
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

function App() {

  return (
    <>
      <GlobalStyle />
     <RouterProvider router={router} />
    </>
  )
}

export default App
