import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="wrapper">
      <div className="container">
        <h1>Erreur 404</h1>
        <p>La page que vous recherchez n'existe pas</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
