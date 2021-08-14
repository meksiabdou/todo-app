import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import useValidation from "../hooks/useValidation";
import { BiLowVision, BiShowAlt } from "react-icons/bi";
import { postJson } from "../networking/server";
import Links from "../constants/links";
import Codes from "../constants/codes";
import { useAuth } from "../context";
import Alert from "../components/alert";
import PublicRoute from "../components/publicRoute";

const Login = ({ localization, direction }) => {
  const router = useHistory();
  const { errors, handelOnChange, data, handelOnSubmit, refForm } =
    useValidation();
  const [showPassword, setShowPassword] = useState({
    password: false,
  });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthUserData } = useAuth();

  const _localization = (key) => {
    return localization[key];
  };

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: _localization("email"),
      as: "input",
      defaultValue: "",
      Component: () => null,
      onClick: () => null,
    },
    {
      name: "password",
      type: "password",
      placeholder: _localization("password"),
      as: "input",
      defaultValue: null,
      Component: (status) => {
        return (
          <span
            className="input-group-text"
            onClick={() => setShowPassword({ password: !status })}
          >
            {status === true ? (
              <BiLowVision color="#91A2B7" size="1.3em" />
            ) : (
              <BiShowAlt color="#91A2B7" size="1.3em" />
            )}
          </span>
        );
      },
      onClick: () => null,
    },
  ];

  const getTextFromCodes = (code) => {
    if (!code) {
      return "";
    }
    return _localization(Codes[code].text);
  };

  const onSubmit = (event, status) => {
    event.preventDefault();
    if (status) {
      setLoading(true);
      setError(false);
      data.identity = data.email;
      postJson(Links.login, data).then((response) => {
        if (response.status) {
          setAuthUserData(response.results.data).then((status) => {
            if (status) {
              setTimeout(() => {
                setLoading(false);
                router.push("/app");
              }, 800);
            } else {
              setError(true);
              setAlertType("error");
              setMessage(3001);
              setLoading(false);
            }
          });
        } else {
          setError(true);
          setAlertType("error");
          setMessage(response?.results?.code);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${direction}`}>
      <div className="row auth">
        <div className="col-xl-4 col-lg-4 col-md-2 col-sm-1 auth-center-side p-0" />
        <div className="col-xl-4 col-lg-4 col-md-8 col-sm-10 auth-right-side">
          <form
            onSubmit={(event) => handelOnSubmit(event, onSubmit)}
            ref={refForm}
          >
            <div className="title">
              <h4>{_localization("loginTitle")}</h4>
            </div>

            {Array.isArray(message) ? (
              message.map((item, index) => (
                <Alert
                  key={index}
                  message={getTextFromCodes(item)}
                  show={error}
                  type={alertType}
                  onHide={() => setError(false)}
                />
              ))
            ) : (
              <Alert
                message={message}
                show={error}
                type={alertType}
                onHide={() => setError(false)}
              />
            )}

            {inputs.map((input, index) => {
              return (
                <div className="form-group" key={index}>
                  <div
                    className={`input-group ${
                      errors[input.name] ? "input-error" : ""
                    }`}
                  >
                    <input
                      type={
                        input.type === "password"
                          ? showPassword.password
                            ? "text"
                            : input.type
                          : input.type
                      }
                      name={input.name}
                      defaultValue={input.defaultValue}
                      className={`form-control`}
                      onChange={handelOnChange}
                      placeholder={input.placeholder}
                    />
                    {input.Component(showPassword.password)}
                  </div>
                  <span className="error form-text">
                    {errors[input.name] && _localization(errors[input.name])}
                  </span>
                </div>
              );
            })}
            <button type="submit" className="btn btn-default btn-submit">
              {_localization("btnLogin")}
              {loading && <div className="lds-dual-ring white"></div>}
            </button>
            <div className="sub-form">
              <p>
                <Link to="/register">
                  {_localization("registerQuestion")}
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-2 col-sm-1 auth-center-side p-0" />
      </div>
    </div>
  );
};

export default PublicRoute(Login);
