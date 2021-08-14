/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState, useRef } from "react";

const Modal = ({ show, onHide, children, customClass, direction, scroll, size }) => {
  //let { show, onHide, children, customClass, direction, scroll, size } = props;
  const [showModel, setShowModel] = useState(show || false);

  onHide = onHide ? onHide : () => null;

  size = size ? `modal-${size}` : "";

  const modelRef = useRef(null);

  const hide = () => {
    document.body.style.overflowY = "auto";
    if (modelRef.current) {
      modelRef.current.style.transform = "translateY(-120%)";
    }
    setTimeout(() => setShowModel(false), 100);
    if (typeof onHide === "function") {
      onHide();
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (show) {
        document.body.style.overflowY = "hidden";
        setShowModel(show);
        setTimeout(() => {
          if (modelRef.current) {
            modelRef.current.style.transform = "translateY(0)";
          }
        }, 100);
      } else {
        hide();
      }
    }
    return () => (isMounted = false);
  }, [show]);

  return showModel ? (
    <Fragment>
      <div
        dir={direction || "ltr"}
        className={`modal show fade d-block ${customClass || ""}`}
      >
        <div
          ref={modelRef}
          style={{ transform: "translateY(-120%)" }}
          className={`modal-dialog modal-dialog-centered ${size} ${scroll ? 'modal-dialog-scrollable' : ''}`}
        >
          <div className="modal-content">
            <div className="modal-header">
              {/*<h5 className="modal-title"></h5>*/}
              <button
                type="button"
                className="btn-close"
                onClick={hide}
              ></button>
            </div>
            <div className={`modal-body ${scroll ? 'scroll' : ''}`}>
              <div>{children}</div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
      <div onClick={hide} className={`modal-backdrop show d-block`}></div>
    </Fragment>
  ) : null;
};

export default Modal;
