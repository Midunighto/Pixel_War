import React from "react";
import PropTypes from "prop-types";
import Button from "../components/Button";
import penImg from "../assets/paint.webp";
import eraserImg from "../assets/eraser.webp";

function Tools({ pen, eraser, handlePen, handleEraser }) {
  return (
    <div className="tools">
      <Button
        type="button"
        className={`tool ${pen ? "active" : ""}`}
        onClick={handlePen}
      >
        <img src={penImg} alt="pinceau" />
      </Button>
      <Button
        type="button"
        className={`tool ${eraser ? "active" : ""}`}
        onClick={handleEraser}
      >
        <img src={eraserImg} alt="gomme" />
      </Button>
    </div>
  );
}

Tools.propTypes = {
  pen: PropTypes.bool.isRequired,
  eraser: PropTypes.bool.isRequired,
  handlePen: PropTypes.func.isRequired,
  handleEraser: PropTypes.func.isRequired,
};

export default Tools;
