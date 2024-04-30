import { useEffect } from "react";
import loader from "../assets/brush-loader.svg";

export default function Loader() {
  return (
    <div className="loader">
      <img src={loader} alt="chargement" width={40} />
    </div>
  );
}
