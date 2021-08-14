import { useState, useEffect } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Home, Login, Register, Profile, Todo} from "./pages";
import { Context } from "./context";
import { postJson } from "./networking/server";
import links from "./constants/links";
import "./styles/bootstrap.rtl.min.css";
import "./styles/index.css";
import "./styles/alert.css";
import "./styles/form.css";
import "./styles/auth.css";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});
  const [reload, setReload] = useState(false);

  const getData = async (token) => {
    if (token) {
      const response = await postJson(links.getUserByToken, {}, token);
      if (response.status) {
        return response.results.data;
      }
    }
    return {}; 
  };

  useEffect(() => {
    let isMounted = true;
    getData(authToken).then((data) => {
      if (isMounted) {
        _setUserData(data).then();
      }
    });
    return () => (isMounted = false);
  }, [authToken]);

  const _setUserData = async (data) => {
    if (data.token) {
      await localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setUserData(data);
      return true;
    } else {
      //await localStorage.removeItem("token");
      setAuthToken(undefined);
      return false;
    }
  };

  const values = {
    authToken: authToken,
    userData: userData,
    setUserData: _setUserData,
    reload,
    setReload: () => setReload(!reload),
  };

  return (
    <Context.Provider value={values}>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/app" exact component={Home} />
          <Route path="/todo/:id" exact component={Todo} />
          <Route path="/user/:username" exact component={Profile} />
          <Route path="*" exact component={Home} />
        </Switch>
      </HashRouter>
    </Context.Provider>
  );
}

export default App;
