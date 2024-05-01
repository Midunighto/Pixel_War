import React from "react";
import PropTypes from "prop-types";
import { Saturation, Hue } from "react-color-palette";

function ColorSlider({ color, handleColorChange }) {
  return (
    <div className="custom-layout">
      <Saturation height={50} color={color} onChange={handleColorChange} />
      <Hue color={color} onChange={handleColorChange} />
    </div>
  );
}

ColorSlider.propTypes = {
  handleColorChange: PropTypes.func.isRequired,
};

export default ColorSlider;
