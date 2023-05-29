import React from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [modoRegistro, setModoRegistro] = React.useState(true);
  const [email, setEmail] = React.useState("jesus@gmail.com");
  const [pass, setPass] = React.useState("123456");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  //guardar datos
  const guardarDatos = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingrese Email");
      return;
    }
    if (!pass.trim()) {
      setError("Ingrese Password");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener mínimo 4 caracteres");
      return;
    }
    setError(null);
    if (modoRegistro) {
      registrar();
    } else {
      login();
    }
  };

  const login = React.useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass);
      console.log(res.user);
      setEmail("");
      setPass("");
      setError("");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no válido");
      }
      if (error.code === "auth/user-not-found") {
        setError("Usuario no encontrado");
      }
      if (error.code === "auth/wrong-password") {
        setError("Contraseña incorrecta!");
      }
    }
  }, [email, pass, navigate]);

  //registrar
  const registrar = React.useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);
      console.log(res.user);
      await db
        .collection("usuariosdb")
        .doc(res.user.email)
        .set({
          email: res.user.email,
          id: res.user.uid,
        });
      await db.collection(res.user.uid).add();
      setEmail("");
      setPass("");
      setError(null);
      navigate("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no válido");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Ya existe un usuario registrado con este email");
      }
    }
  }, [email, pass, navigate]);

  return (
    <div>
      <h3 className="text-center my-3">
        {modoRegistro ? "Registro de Usuarios" : "Login"}
      </h3>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-xl-4">
          <form onSubmit={guardarDatos}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Ingrese su email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Ingrese su password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            />
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit">
                {modoRegistro ? "Registrarse" : "Acceder"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setModoRegistro(!modoRegistro);
                }}
                type="button"
              >
                {modoRegistro ? "¿Ya estás registrado?" : "¿No tienes cuenta?"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
