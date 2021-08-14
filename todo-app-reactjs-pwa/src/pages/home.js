/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BiEditAlt, BiShareAlt, BiShowAlt, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import PrivateRoute from "../components/privateRoute";
import links from "../constants/links";
import { useAuth, useReload } from "../context";
import { getJson, postJson } from "../networking/server";
import Swal from "../components/swal";
import useValidation from "../hooks/useValidation";
import Codes from "../constants/codes";
import Alert from "../components/alert";
import Model from "../components/modal";

const Home = ({ localization }) => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const { authToken } = useAuth();
  const { reload, setReload } = useReload();
  const { errors, handelOnChange, data, handelOnSubmit, refForm, setData } =
    useValidation();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState(null);

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
      defaultValue: data["name"],
      Component: () => null,
      onClick: () => null,
    },
    {
      name: "description",
      type: "text",
      placeholder: localization["description"],
      as: "input",
      defaultValue: data["description"],
      Component: () => null,
      onClick: () => null,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getJson(links.todoAll, {}, authToken).then((response) => {
      if (isMounted && response.status) {
        setTodoData(response.results.data);
        setLoading(false);
      } else {
        setTodoData([]);
        setLoading(false);
      }
    });
    return () => (isMounted = false);
  }, [reload]);

  //console.log(todoData);

  const remove = (_id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger me-2 ms-2",
        cancelButton: "btn btn-secondary me-2 ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: localization["removeFinel"],
      confirmButtonText: localization["delete"],
      showCancelButton: true,
      cancelButtonText: localization["cancel"],
      text: "",
      showLoaderOnConfirm: true,
      icon: "warning",
      preConfirm: () => {
        postJson(links.delete, { id: _id }, authToken).then((response) => {
          if (response.status) {
            Swal.fire(localization["deleteIsSuccess"], "", "success").then();
            setReload();
          } else {
            Swal.fire(localization["deleteIsError"], "", "error").then();
          }
        });
      },
    });
  };

  const Edit = (item) => {
    setId(item.id);
    setData({ name: item.name, description: item.description });
    setModelShow(true);
  };

  const onSubmit = (_, status) => {
    if (status) {
      const dataQuery = {
        name: data.name,
        description: data.description,
        id,
      };
      //console.log(dataQuery);
      setLoading(true);
      setError(false);
      setSuccess(false);
      postJson(links.update, dataQuery, authToken).then((response) => {
        if (response.status) {
          setAlertType("success");
          setSuccess(true);
          setTimeout(() => setModelShow(false), 800);
        } else {
          setAlertType("error");
          setError(true);
        }
        setReload();
        setMessage(response?.results?.code);
        setLoading(false);
        setError(false);
        setSuccess(false);
        setId(null);
      });
    }
  };

  const share = (item) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary me-2 ms-2",
        cancelButton: "btn btn-secondary me-2 ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: `${localization["Invite a collaborator"]} (${localization["email"]})`,
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
        require : true,
      },
      showCancelButton: true,
      confirmButtonText: localization["Add"],
      cancelButtonText: localization["cancel"],
      showLoaderOnConfirm: true,
      validationMessage : localization["EmailNoValid"],
      preConfirm: (email) => {
        if (email) {
          postJson(links.addUserTodo, { id: item.id, email }, authToken).then(
            (response) => {
              if (response.status) {
                Swal.fire(
                  localization["invitation is sent"],
                  "",
                  "success"
                ).then();
                setReload();
              } else {
                Swal.fire(localization["YourInfoNotValid"], "", "error").then();
              }
            }
          );
        }
      },
    });
  };

  return (
    <div className="container">
      {loading ? (
        <div className="center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row mt-5">
          {todoData.map((item, index) => {
            const length = Math.round(12 / todoData.length);
            const value = length < 3 ? 3 : length;
            const col = `col-xl-${value} col-lg-${value} col-md-6 col-sm-12`;
            return (
              <div className={col} key={index}>
                <div className="card mb-3">
                  <div className="card-header d-flex flex-row justify-content-between align-items-center">
                    {item.name}
                    <div>
                      <button
                        className="btn btn-link p-2"
                        onClick={() => Edit(item)}
                      >
                        <BiEditAlt size="20px" />
                      </button>
                      <Link
                        to={`/todo/${item.id}`}
                        className="btn btn-link p-2 text-danger"
                      >
                        <BiShowAlt size="20px" />
                      </Link>
                      <button
                        className="btn btn-link p-2 text-success"
                        onClick={() => share(item)}
                      >
                        <BiShareAlt size="20px" />
                      </button>
                      <button
                        className="btn btn-link p-2 text-danger"
                        onClick={() => remove(item.id)}
                      >
                        <BiTrash size="20px" />
                      </button>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush p-0">
                    <li className="list-group-item ">{item.description}</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Model show={modelShow} onHide={() => setModelShow(false)}>
        <div className="form">
          <form
            onSubmit={(event) => handelOnSubmit(event, onSubmit)}
            ref={refForm}
          >
            <div className="title">
              <h5>{_localization("addCategory")}</h5>
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
              {_localization("update")}
              {loading && <div className="lds-dual-ring white"></div>}
            </button>
          </form>
        </div>
      </Model>
    </div>
  );
};

export default PrivateRoute(Home);
