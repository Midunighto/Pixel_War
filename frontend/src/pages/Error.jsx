import { Link } from "react-router-dom";

import whitelogo from "../assets/logo-white.png";

export default function Error() {
  return (
    <div className="page">
      <section className="error">
        <img src={whitelogo} alt="logo" width={276} height={201} />
        <h1>Erreur 404</h1>
        <p>La page que vous recherchez n'existe pas</p>
        <Link to="/">Retour à l'accueil</Link>
      </section>
    </div>
  );
}
