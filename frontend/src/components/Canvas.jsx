import React from "react";
import PropTypes from "prop-types";

function Canvas({ nbPixels, pixelSize, handleCanvasClick, canvasRef }) {
  return (
    <canvas
      ref={canvasRef}
      width={nbPixels * pixelSize}
      height={nbPixels * pixelSize}
      className="canva"
      onClick={handleCanvasClick}
    />
  );
}

Canvas.propTypes = {
  nbPixels: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
  handleCanvasClick: PropTypes.func.isRequired,
  canvasRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
};

export default Canvas;
