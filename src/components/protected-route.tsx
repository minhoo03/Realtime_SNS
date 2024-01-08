import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 여부
  const user = auth.currentUser; // User | Null
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
//   return <Home />;
}
