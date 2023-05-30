import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = (props) => {
  const navigate = useNavigate();

  //funcion cerrar sesión
  const cerrarSesion = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand mx-4" to="/">
        BIBLIOTECA CUC
      </Link>
      <div>
        <div className="d-flex">
          <Link to="/" className="btn btn-light mx-1">
            Inicio
          </Link>
          {props.firebaseUser !== null ? (
            <Link to="/admin" className="btn btn-light mx-1">
              Admin
            </Link>
          ) : null}

          {props.firebaseUser !== null ? (
            <button
              className="btn btn-danger mx-1"
              onClick={() => cerrarSesion()}
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline-success mx-1">
              Registro / Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
