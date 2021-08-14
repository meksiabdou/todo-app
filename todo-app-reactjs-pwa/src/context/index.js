/* eslint-disable import/no-anonymous-default-export */
import { useContext, createContext } from "react";

const Context = createContext();

const useAuth = () => {
  const contxAuth = useContext(Context);
  return {
    authToken: contxAuth.authToken,
    userData: contxAuth.userData,
    setAuthUserData: contxAuth.setUserData,
  };
};

const useReload = () => {
  const _c = useContext(Context);
  return {
    setReload: _c.setReload,
    reload: _c.reload,
  };
};

export { Context, useAuth, useReload };
