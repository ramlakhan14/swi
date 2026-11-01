import { Navigate } from "react-router-dom";
import { parseCookies } from "nookies";

const PublicRoute = ({ children }) => {
  const cookies = parseCookies();
  const isLoggedIn = cookies.token; // change name if your cookie is different

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
