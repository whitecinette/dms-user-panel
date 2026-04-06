import { useEffect } from "react";
import { clearAuthStorage } from "../../utils/authStorage";

const Logout = () => {
  useEffect(() => {
    clearAuthStorage();
    window.location.replace("/login");
  }, []);

  return null;
};

export default Logout;