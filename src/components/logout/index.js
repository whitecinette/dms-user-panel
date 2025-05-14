import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  console.log("Logout");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;