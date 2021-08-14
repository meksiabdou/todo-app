/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../context";
import { useHistory } from "react-router-dom";
import { localization } from "../localization";
import NavBar from "../layouts/navBar";
const PrivateRoute = (Component) => {
  const Auth = (props) => {
    const [isAuth, setIsAuth] = useState(false);
    const { authToken } = useAuth();
    const router = useHistory();

    useEffect(() => {
      if (authToken) {
        setIsAuth(true);
      } else {
        router.replace("/login");
      }
    }, [authToken]);

    return isAuth ? (
      <div className="container-fluid p-0">
        <NavBar localization={localization("fr")} direction="ltr" {...props} />
        <Component {...props} localization={localization("fr")} direction="ltr" />
      </div>
    ) : null;
  };

  return Auth;
};

export default PrivateRoute;
