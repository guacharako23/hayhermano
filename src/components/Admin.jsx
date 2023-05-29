import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Registro from "./Registro";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    //leer la info del usuario registrado
    if (auth.currentUser) {
      console.log("Usuario existente!");
      setUser(auth.currentUser);
    } else {
      console.log("Usuario no existente!");
      navigate("/login");
    }
  }, [navigate]);
  return <div>{user && <Registro user={user} />}</div>;
};

export default Admin;
