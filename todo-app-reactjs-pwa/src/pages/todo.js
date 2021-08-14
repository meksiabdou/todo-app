import PrivateRoute from "../components/privateRoute";
import { BiEditAlt, BiPlus, BiTrash } from "react-icons/bi";
import { Fragment, useEffect, useState } from "react";
import { useAuth, useReload } from "../context";
import { getJson, postJson } from "../networking/server";
import links from "../constants/links";
import Model from "../components/modal";
import useValidation from "../hooks/useValidation";
import Alert from "../components/alert";
import Codes from "../constants/codes";

const Todo = ({ match, localization }) => {
  //console.log();
  const id = match.params.id;

  const [todoData, setTodoData] = useState({
    content: [],
  });
  const [loading, setLoading] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  //const [modelShowCategory, setModelShowCategory] = useState(false);
  const [modelShowList, setModelShowList] = useState(false);
  const { errors, handelOnChange, data, handelOnSubmit, refForm, setData } =
    useValidation();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const { reload, setReload } = useReload();
  const { authToken } = useAuth();
  const [categories, setCategories] = useState([]);
  //const [category, setCategory] = useState("");
  const [lists, setLists] = useState([]);
  const [list, setList] = useState("");
  const [typeSubmit, setTypeSubmit] = useState("add");

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
      name: "list",
      type: "text",
      placeholder: localization["list"],
      as: "select",
      defaultValue: list,
      items: lists,
      Component: () => null,
      onClick: () => null,
    },
    {
      name: "category",
      type: "text",
      placeholder: localization["category"],
      as: "select",
      defaultValue: data["category"] ? data["category"] : null,
      items: categories,
      Component: () => null,
      onClick: () => null,
    },
    {
      name: "title",
      type: "text",
      placeholder: localization["title"],
      as: "input",
      defaultValue: data["title"],
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

  const inputsNewList = [
    {
      name: "newList",
      type: "text",
      placeholder: localization["addList"],
      as: "input",
      defaultValue: "",
      Component: () => null,
      onClick: () => null,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getJson(links.todoById, { id }, authToken).then((response) => {
      if (isMounted && response.status) {
        //console.log(response.results.data.content);
        setTodoData(response.results.data);
        setLists(
          response.results.data.content.map((item) => ({ name: item.name }))
        );
        setCategories(response.results.data.categories);
        setLoading(false);
      } else {
        setTodoData({
          content: [],
        });
        setLoading(false);
      }
    });
    return () => (isMounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reload]);

  //console.log(errors);

  const sendToApi = (content) => {
    const dataQuery = {
      content: JSON.stringify(content),
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
    });
  };

  const remove = (indexItem, _list) => {
    const content = todoData.content.map((item) => {
      if (item.name === _list) {
        item.data = item.data.filter((_, index) => index !== indexItem);
      }
      return item;
    });
    sendToApi(content);
  };

  const onSubmitAdd = (event, status) => {
    event.preventDefault();
    if (status) {
      const content = todoData.content.map((item) => {
        if (item.name === data.list) {
          item.data = [
            ...item.data,
            {
              title: data.title,
              description: data.description,
              category: data.category ? data.category : categories[0]?.name,
            },
          ];
        }
        return item;
      });
      sendToApi(content);
    } else {
      setLoading(false);
    }
  };

  const onSubmitEdit = (event, status) => {
    event.preventDefault();
    if (status) {
      const content = todoData.content.map((item) => {
        if (item.name === data.list) {
          item.data = item.data.map((_item, index) => {
            if (index === data.index) {
              _item = {
                title: data.title,
                description: data.description,
                category: data.category,
              };
            }
            return _item;
          });
        }
        return item;
      });
      sendToApi(content);
    } else {
      setLoading(false);
    }
  };

  const add = (_list) => {
    setTypeSubmit("add");
    setList(_list);
    setData({ title: "", description: "", category: "", list: _list });
    setModelShow(true);
  };

  const edit = (item, _list) => {
    setTypeSubmit("edit");
    setList(_list);
    setData({ ...item, list: _list });
    setModelShow(true);
  };

  const onSubmit = (event, status) => {
    let content = todoData.content.filter((item) => item.name === data.newList);
    if (content.length) {
      setAlertType("error");
      setError(true);
      setMessage(localization["ListIsExist"]);
      return false;
    } else {
      content = [
        ...todoData.content,
        {
          data: [],
          name: data.newList,
        },
      ];
    }
    if (status) {
      sendToApi(content);
    } else {
      setLoading(false);
    }
  };

  const removeList = (_list) => {
    const content = todoData.content.filter((item) => item.name !== _list);
    //console.log(content);
    sendToApi(content);
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row mt-5">
          {loading ? (
            <div className="center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Fragment>
              <div className="col-12 mb-3">
                <div className="d-flex flex-row align-items-center">
                  <h4>{todoData.name}</h4>
                  <button
                    className="fs-6 btn btn-default dark p-2 me-3 p-2"
                    onClick={() => setModelShowList(true)}
                  >
                    <BiPlus size="20px" />
                    {localization["addList"]}
                  </button>
                </div>
              </div>
              {todoData.content.map((item, index) => {
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
                            onClick={() => add(item.name)}
                          >
                            <BiPlus size="20px" />
                          </button>
                          <button
                            className="btn btn-link p-2 text-danger"
                            onClick={() => removeList(item.name)}
                          >
                            <BiTrash size="20px" />
                          </button>
                        </div>
                      </div>
                      <ul className="list-group list-group-flush p-0">
                        {item.data.map((_item, _index) => {
                          return (
                            <li
                              key={_index}
                              className="list-group-item d-flex flex-row justify-content-between align-items-center"
                            >
                              <p>
                                <span className="fs-4">{_item.title}</span>
                                <span className="d-block">
                                  {_item.description}
                                </span>
                                <span>
                                  {_item.category}
                                </span>
                              </p>

                              <div>
                                <button
                                  className="btn btn-link p-2"
                                  onClick={() =>
                                    edit({ ..._item, index: _index }, item.name)
                                  }
                                >
                                  <BiEditAlt size="20px" />
                                </button>
                                <button
                                  className="btn btn-link p-2 text-danger"
                                  onClick={() => remove(_index, item.name)}
                                >
                                  <BiTrash size="20px" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>
      </div>
      <Model show={modelShow} onHide={() => setModelShow(false)}>
        <div className="form">
          <form
            onSubmit={(event) =>
              handelOnSubmit(
                event,
                typeSubmit === "add" ? onSubmitAdd : onSubmitEdit
              )
            }
            ref={refForm}
          >
            <div className="title">
              <h5>{_localization("addCard")}</h5>
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
                    {input.as === "input" ? (
                      <input
                        type={input.type}
                        name={input.name}
                        defaultValue={input.defaultValue}
                        className={`form-control`}
                        onChange={handelOnChange}
                        placeholder={input.placeholder}
                      />
                    ) : (
                      <select
                        name={input.name}
                        defaultValue={input.defaultValue}
                        className={`form-select form-control`}
                        disabled={
                          typeSubmit === "add" ? false : input.name === "list"
                        }
                        onChange={handelOnChange}
                        placeholder={input.placeholder}
                      >
                        <option value={""}>{input.placeholder}</option>
                        {input.items.map((_option, _index) => {
                          return (
                            <option key={_index} value={_option.name}>
                              {_option.name}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  <span className="error form-text mb-2 d-block">
                    {errors[input.name] && _localization(errors[input.name])}
                  </span>
                </div>
              );
            })}

            <button type="submit" className="btn btn-default btn-submit">
              {typeSubmit === "add"
                ? _localization("Add")
                : _localization("update")}
              {loading && <div className="lds-dual-ring white"></div>}
            </button>
          </form>
        </div>
      </Model>
      <Model show={modelShowList} onHide={() => setModelShowList(false)}>
        <div className="form">
          <form
            onSubmit={(event) => handelOnSubmit(event, onSubmit)}
            ref={refForm}
          >
            <div className="title">
              <h5>{_localization("addList")}</h5>
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

            {inputsNewList.map((input, index) => {
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

export default PrivateRoute(Todo);
