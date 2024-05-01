import PropTypes from "prop-types";
import loupeb from "../assets/search-b.svg";
import loupew from "../assets/search-w.svg";

import { useStoredUser } from "../contexts/UserContext";

function Searchbar({ searchValue, setSearchValue, placeholder }) {
  const { storedUser } = useStoredUser();

  const handleChange = (e) => {
    setSearchValue(() => e.target.value);
  };
  return (
    <div className="search-container">
      <img
        src={storedUser.theme === 1 ? loupew : loupeb}
        alt="Searchbar icon"
        width={20}
      />
      <input
        type="search"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}

Searchbar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
};

export default Searchbar;
