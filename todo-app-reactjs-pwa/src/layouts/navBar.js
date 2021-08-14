import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useReload } from "../context";
import { BsPlus } from "react-icons/bs";
import Model from "../components/modal";
import useValidation from "../hooks/useValidation";
import Alert from "../components/alert";
import Codes from "../constants/codes";
import { postJson } from "../networking/server";
import links from "../constants/links";

const NavBar = (props) => {
  const { localization, match } = props;
  //console.log(props);
  const { userData, authToken, setAuthUserData } = useAuth();
  const [modelShow, setModelShow] = useState(false);
  const { errors, handelOnChange, data, handelOnSubmit, refForm } =
    useValidation();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setReload } = useReload();

  const _localization = (key) => {
    return localization[key];
  };

  const getTextFromCodes = (code) => {
    if (!code) {
      return "";
    }
    return _localization(Codes[code].text);
  };

  const inputs = [
    {
      name: "name",
      type: "text",
      placeholder: localization["title"],
      as: "input",
      defaultValue: "",
      Component: () => null,
      onClick: () => null,
    },
    {
      name: "description",
      type: "text",
      placeholder: localization["description"],
      as: "input",
      defaultValue: "",
      Component: () => null,
      onClick: () => null,
    },
  ];

  const onSubmit = (event, status) => {
    event.preventDefault();
    if (status) {
      setLoading(true);
      setError(false);
      setSuccess(false);
      postJson(links.addNewTodo, { name: data.name, description: data.description }, authToken).then(
        (response) => {
          if (response.status) {
            setAlertType("success");
            setSuccess(true);
            setReload();
            setTimeout(() => setModelShow(false), 800);
          } else {
            setAlertType("error");
            setError(true);
          }
          setMessage(response?.results?.code);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/app">
            {localization["appName"]}
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${userData.username}`}>
                  {userData.fullname}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`#`} onClick={() => setAuthUserData({}).then()}>
                  {localization["logout"]}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {match.path === "/todo/:id" ? null : (
              <button
                className="btn btn-default white"
                onClick={() => setModelShow(true)}
              >
                <BsPlus className="icon" color="#fff" />{" "}
                {localization["addTable"]}
              </button>
            )}
          </div>
        </div>
      </div>
      <Model show={modelShow} onHide={() => setModelShow(false)}>
        <div className="form">
          <form
            onSubmit={(event) => handelOnSubmit(event, onSubmit)}
            ref={refForm}
          >
            <div className="title">
              <h5>{_localization("newTable")}</h5>
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
                      type={input.type}
                      name={input.name}
                      defaultValue={input.defaultValue}
                      className={`form-control`}
                      onChange={handelOnChange}
                      placeholder={input.placeholder}
                    />
                  </div>
                  <span className="error form-text mb-2 d-block">
                    {errors[input.name] && _localization(errors[input.name])}
                  </span>
                </div>
              );
            })}

            <button type="submit" className="btn btn-default btn-submit">
              {_localization("Add")}
              {loading && <div className="lds-dual-ring white"></div>}
            </button>
          </form>
        </div>
      </Model>
    </Fragment>
  );
};

export default NavBar;
