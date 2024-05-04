import React from "react";

const PixelInfo = ({ pixelInfos, clickX, clickY, pixelSize }) => {
  const date = new Date(pixelInfos.createdAt);
  date.setHours(date.getHours() - 2);
  const dateString = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const timeString = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <p
      id="pixel"
      style={{
        position: "absolute",
        left: `${clickX * pixelSize - 15}px`,
        top: `${clickY * pixelSize - 30}px`,
      }}
    >
      par {pixelInfos.pseudo} le {dateString} à {timeString}
    </p>
  );
};

export default PixelInfo;
