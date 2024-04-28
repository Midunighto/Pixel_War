import { createContext, useState, useContext, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const UserContext = createContext(null);
export const useStoredUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [storedUser, setStoredUser] = useState(false);

  const refreshUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${storedUser.id}`
      );
      setStoredUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const value = useMemo(() => {
    return { storedUser, setStoredUser, refreshUser };
  }, [storedUser, setStoredUser, refreshUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
