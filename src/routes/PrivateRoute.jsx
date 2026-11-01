import { Navigate } from "react-router-dom";
import { parseCookies } from "nookies";

const PrivateRoute = ({ children }) => {
  const cookies = parseCookies();
  const isLoggedIn = cookies.token; // change name if needed

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
