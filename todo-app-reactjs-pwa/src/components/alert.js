/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  IoMdCloseCircleOutline,
  IoMdClose,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";

const Alert = ({ show , type, message, onHide }) => {

  const color = "#FFFFFF";

  const [IsShow, setIsShow] = useState(show ? show : false);
  const _type = type ? type : 'error'
  const className = _type;

  useEffect(() => {
    if (!IsShow) {
      onHide();
    }
  }, [IsShow]);

  useEffect(() => {
    if (show) {
      setIsShow(true);
      setTimeout(() => setIsShow(false), 4000);
    }
  }, [show]);

  if (IsShow) {
    return (
      <div className={`alert alert-custom ${className}`}>
        {_type === 'error' ? (
          <IoMdCloseCircleOutline size="24" color="#ffffff" />
        ) : (
          <IoMdCheckmarkCircleOutline size="24" color="#ffffff" />
        )}
        <p>{message ? message : ''}</p>
        <button
          className="btn btn-link btn-close"
          onClick={() => setIsShow(false)}
        >
          <IoMdClose size="24" color={color} />
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default Alert;
