import { useState } from "react";
import useValidation from "../hooks/useValidation";
import { Link, useHistory } from "react-router-dom";
import { BiLowVision, BiShowAlt } from "react-icons/bi";
import { postJson } from "../networking/server";
import Links from "../constants/links";
import Codes from "../constants/codes";
import Alert from "../components/alert";
import PublicRoute from "../components/publicRoute";

const Register = ({ localization, direction }) => {
  const router = useHistory();
  const { errors, handelOnChange, data, handelOnSubmit, refForm } = useValidation([]);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const _localization = (key) => {
    return localization[key];
  };

  const inputs = [
    {
      name: "fullname",
      type: "text",
      value: "",
      defaultValue: "",
      Component: () => null,
      placeholder: _localization("fullname"),
    },
    {
      name: "email",
      type: "email",
      value: "",
      defaultValue: "",
      Component: () => null,
      placeholder: _localization("email"),
    },
    {
      name: "password",
      type: "password",
      value: "",
      defaultValue: null,
      placeholder: _localization("password"),
      Component: (status) => {
        return (
          <span
            className="input-group-text"
            onClick={() => setShowPassword({ ...showPassword,  password: !status })}
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
    {
      name: "confirmPassword",
      type: "password",
      value: "",
      defaultValue: null,
      placeholder: _localization("confirmPassword"),
      Component: (status) => {
        return (
          <span
            className="input-group-text"
            onClick={() => setShowPassword({ ...showPassword, confirmPassword: !status, })}
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

    //console.log(data);
    if (status) {
      setLoading(true);
      setError(false);
      setSuccess(false);
      postJson(Links.register, data).then((response) => {
        if (response.status) {
          setAlertType("success");
          setSuccess(true);
          setTimeout(() => {
            setLoading(false);
            router.push("/login");
          }, 800);
        } else {
          setAlertType("error");
          setError(true);
        }
        setMessage(response?.results?.code);
        setLoading(false);
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
          <form onSubmit={(event) => handelOnSubmit(event, onSubmit)} ref={refForm}>
            <div className="title">
              <h4>{_localization("signUpTitle")}</h4>
            </div>

            {Array.isArray(message) ? (
              message.map((item, index) => (
                <Alert
                  key={index}
                  message={getTextFromCodes(item)}
                  show={error || success}
                  type={alertType}
                  onHide={() => {
                    setError(false);
                    setSuccess(false);
                  }}
                />
              ))
            ) : (
              <Alert
                message={message}
                show={error || success}
                type={alertType}
                onHide={() => {
                  setError(false);
                  setSuccess(false);
                }}
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
                          ? showPassword[input.name]
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
                    {input.Component(showPassword[input.name])}
                  </div>
                  <span className="error form-text">
                    {errors[input.name] && _localization(errors[input.name])}
                  </span>
                </div>
              );
            })}

            <button type="submit" className="btn btn-default btn-submit">
              {_localization("btnSignup")}
              {loading && <div className="lds-dual-ring white"></div>}
            </button>

            <div className="sub-form">
              <p>
                <Link to="/login">{_localization("IhaveAccount")}</Link>
              </p>
            </div>
          </form>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-2 col-sm-1 login-center-side p-0" />
      </div>
    </div>
  );
};

export default PublicRoute(Register);
