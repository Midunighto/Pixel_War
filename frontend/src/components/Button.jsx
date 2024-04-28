import React from "react";
import PropTypes from "prop-types";
import "../styles/buttons.scss";

export default function Button({ onClick, type, children, className }) {
  return (
    <>
      <button className={`btn ${className}`} type={type} onClick={onClick}>
        {children}
        <span className={`${className}__inner`}>
          <span className={`${className}__blobs`}>
            <span className={`${className}__blob`} />
            <span className={`${className}__blob`} />
            <span className={`${className}__blob`} />
            <span className={`${className}__blob`} />
          </span>
        </span>
      </button>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation="10"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: "button",
  className: "",
};
