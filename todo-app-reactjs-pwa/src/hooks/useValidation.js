import { useState, useRef, useEffect } from "react";

const useValidation = (inputNotReq = []) => {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(false);
  const [data, setData] = useState({});
  const refForm = useRef(null);
  const urlRegex = new RegExp(
    /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
  );
  const emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const phoneRegex = new RegExp(/^[0]{1}[5-7]{1}[0-9]{8}$/m);

  const validation = (name, value, type = "text") => {
    let result = {
      status: true,
      error: "",
    };

    try {
      if (value.toString().trim() === "") {
        result = {
          status: false,
          error: "FieldEmpty",
        };
      } else {
        if (name === "email" && !emailRegex.test(value)) {
          result = {
            status: false,
            error: "EmailNoValid",
          };
        } else if (type === "url" && !urlRegex.test(value)) {
          result = {
            status: false,
            error: "UrlNoValid",
          };
        } else if (name === "phone" && !phoneRegex.test(value)) {
          result = {
            status: false,
            error: "PhoneNoValid",
          };
        } else if (name === "password" && value.length < 8) {
          result = {
            status: false,
            error: "MinPassWord",
          };
        }
      }
    } catch (e) {
      result = {
        status: false,
        error: undefined,
      };
    }

    return result;
  };

  const handelOnSubmit = (event, callback) => {
    event.preventDefault();
    // return errors;
    const elements = event.target.elements;
    let errorsList = {};
    let _status = [];

    //console.log(elements);
    for (let element in elements) {
      const name = elements[element].name;
      const value = elements[element].value;
      const type = elements[element].type;

      if (
        elements[element] &&
        name &&
        value !== undefined &&
        !inputNotReq.includes(name)
      ) {
        let result = validation(name, value, type);

        if (name === "confirmPassword") {
          if (data.password) {
            //console.log(name, data.password);
            if (data.password === value) {
              result = {
                status: true,
              };
            } else {
              result = {
                status: false,
                error: "PassNotMatch",
              };
            }
          }
        }

        _status.push(result.status);

        if (result.status !== true) {
          errorsList[name] = result.error;
        } else {
          delete errorsList[name];
        }
      }
      //console.log(name, value);
    }

    setErrors(errorsList);

    if (_status.includes(false)) {
      setStatus(false);
      callback(event, false);
    } else {
      setStatus(true);
      callback(event, true);
    }
  };

  const handelOnChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let errorsList = errors;

    let result = validation(name, value);

    if (inputNotReq.includes(name)) {
      result = {
        status: true,
        error: "",
      };
    }

    if (name === "confirmPassword") {
      if (data.password) {
        //console.log(name, data.password);
        if (data.password === value) {
          result = {
            status: true,
          };
        } else {
          result = {
            status: false,
            error: "PassNotMatch",
          };
        }
      } else {
        result = {
          status: false,
          error: "PassNotMatch",
        };
      }
    }

    if (result.status === true) {
      delete errorsList[name];
    } else {
      errorsList = {
        ...errorsList,
        [name]: result.error,
      };
    }

    if (name === "password") {
      if (errors.confirmPassword) {
        delete errorsList["confirmPassword"];
      }
    }

    setStatus(result.status);
    setErrors(errorsList);

    setData({
      ...data,
      [name]: value?.trim(),
    });
  };

  const RefEvent = () => {
    const ref = refForm.current;
    const dataInput = {};

    if (ref && ref !== null) {
      const inputs = ref.getElementsByTagName("input");
      const selects = ref.getElementsByTagName("select");
      const textarea = ref.getElementsByTagName("textarea");

      Object.keys(inputs).map((key) => {
        if (inputs[key].name) {
          dataInput[inputs[key].name] = inputs[key].value?.trim();
        }
        return true;
      });

      Object.keys(textarea).map((key) => {
        if (textarea[key].name) {
          dataInput[textarea[key].name] = textarea[key].value?.trim();
        }
        return true;
      });

      Object.keys(selects).map((key) => {
        if (selects[key].name) {
          dataInput[selects[key].name] = selects[key].value?.trim();
        }
        return true;
      });

      //console.log(dataInput);
    }
    return dataInput;
  };

  useEffect(() => {
    setData(RefEvent());
  }, [refForm]);

  return {
    errors,
    refForm,
    handelOnSubmit,
    handelOnChange,
    setData,
    RefEvent,
    status,
    data,
  };
};

export default useValidation;
