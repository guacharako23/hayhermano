import React from "react";
import swal from "sweetalert";
import { db } from "../firebase";

const Registro = (props) => {
  const [categoria, setCategoria] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [ubicacion, setUbicacion] = React.useState("");
  const [id, setId] = React.useState("");
  const [error, setError] = React.useState(null);
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [lista, setLista] = React.useState([]);
  const [dataTime, setDataTime] = React.useState(
    new Date().toLocaleDateString()
  );
  const selectRef = React.useRef();

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection(props.user.email).get();

        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLista(arrayData);
      } catch (error) {
        alert(error);
      }
    };
    obtenerDatos();
  }, [props.user.email]);

  const editarDatos = (elemento) => {
    setModoEdicion(true);
    setUbicacion(elemento.ubicacion);
    setDescripcion(elemento.descripcion);
    setId(elemento.id);
    selectRef.current.focus();
  };

  const editar = async (e) => {
    e.preventDefault();
    if (categoria === "") {
      setError("Selecciona una categoría principal.");
    } else if (tipo === "") {
      setError("Selecciona el tipo de servicio.");
    } else if (ubicacion.trim().length === 0) {
      setError(
        "Indique la ubicación donde requiere el servicio."
      );
    } else if (descripcion === "" || descripcion.trim().length === 0) {
      setError("La descripción es obligatoria, por favor, sea específico.");
    } else if (descripcion.trim().length <= 6) {
      setError("Ingrese una descripción más específica.");
    } else {
      try {
        setDataTime(new Date().toLocaleDateString());
        await db
          .collection(props.user.email)
          .doc(id)
          .update({
            categoria,
            tipo,
            ubicacion,
            descripcion,
            dataTime,
          });
        const listaEditada = lista.map((elemento) =>
          elemento.id === id
            ? {
                id: id,
                categoria: categoria,
                tipo: tipo,
                descripcion: descripcion,
                ubicacion: ubicacion,
                dataTime: dataTime,
              }
            : elemento
        );
        setLista(listaEditada);
        setDescripcion("");
        setUbicacion("");
        setError(null);
        setDataTime(new Date().toLocaleDateString());
        setModoEdicion(false);
        swal({
          icon: "success",
          title: "Su solicitud ha sido editada con éxito.",
          timer: 3000,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const agregarDatos = async (e) => {
    e.preventDefault();
    if (categoria === "") {
      setError("Selecciona una categoría principal.");
    } else if (tipo === "") {
      setError("Selecciona el tipo de servicio.");
    } else if (ubicacion.trim().length === 0) {
      setError(
        "Indique la ubicación donde requiere el servicio."
      );
    } else if (descripcion === "" || descripcion.trim().length === 0) {
      setError("La descripción es obligatoria, por favor, sea específico.");
    } else if (descripcion.trim().length <= 6) {
      setError("Ingrese una descripción más específica.");
    } else {
      try {
        setDataTime(new Date().toLocaleDateString());
        const nuevoRegistro = {
          categoria,
          descripcion,
          ubicacion,
          tipo,
          dataTime,
        };

        for (let index = 0; index < lista.length; index++) {
          if (
            categoria === lista[index].categoria &&
            tipo === lista[index].tipo &&
            descripcion === lista[index].descripcion &&
            ubicacion === lista[index].ubicacion
          ) {
            swal({
              title: "Esta petición ya existe.",
              icon: "error",
              timer: 5000,
            });
            return;
          }
        }
        const data = await db.collection(props.user.email).add(nuevoRegistro);
        setLista([...lista, { ...nuevoRegistro, id: data.id }]);
      } catch (error) {
        console.log(error);
      }
      setDescripcion("");
      setUbicacion("");
      setError(null);
      setDataTime(new Date().toLocaleDateString());
    }
  };
  const eliminarDato = async (id) => {
    swal({
      title: "¿Seguro que deseas eliminar esta solicitud?",
      text: "¡Una vez eliminada, no podrás recuperarla!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        try {
          db.collection(props.user.email)
            .doc(id)
            .delete();
          const newLista = lista.filter((elemento) => elemento.id !== id);
          setLista(newLista);
        } catch (error) {
          console.log(error);
        }
        swal({
          title: "¡Su solicitud ha sido eliminada con éxito!",
          icon: "success",
          timer: 2000,
        });
      }
    });
    setError(null);
    setDescripcion("");
    setUbicacion("");
  };

  return (
    <div className="container div-inicio border shadow p-2 mb-5 bg-body h-100">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <h2 className="text-center">
            {modoEdicion ? "Modo edición" : "Registro de solicitud"}
          </h2>
          <form onSubmit={modoEdicion ? editar : agregarDatos}>
            {error ? (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            ) : null}
            <select
              name="Principal"
              ref={selectRef}
              className="form-select mb-3 mt-3"
              aria-label="Default select example"
              onChange={(e) => {
                setCategoria(e.target.value);
                setTipo("");
              }}
              defaultValue=""
            >
              <option value="">Elija una opción</option>
              <option value="Mantenimiento de inmuebles">
                MANTENIMIENTO DE INMUEBLES
              </option>
              <option value="Mantenimiento de muebles">
                MANTENIMIENTO DE MUEBLES
              </option>
              <option value="Servicio">SERVICIO</option>
            </select>
            {categoria === "" ? (
              <div className="alert alert-light text-center" role="alert">
                ¡Seleccione una categoría primero!
              </div>
            ) : null}
            {categoria === "Mantenimiento de inmuebles" ? (
              <select
                name="Mantenimiento de inmuebles"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="Baños">Baños</option>
                <option value="Cielo razo">Cielo razo</option>
                <option value="Pared">Pared</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Puerta">Puerta</option>
              </select>
            ) : null}
            {categoria === "Mantenimiento de muebles" ? (
              <select
                name="Mantenimiento de muebles"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="Aire acondicionado">Aire acondicionado</option>
                <option value="Archivador">Archivador</option>
                <option value="Silla">Silla</option>
                <option value="Puesto de trabajo">Puesto de trabajo</option>
              </select>
            ) : null}
            {categoria === "Servicio" ? (
              <select
                name="Servicio"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="Aseo">Aseo</option>
                <option value="Vigilancia">Vigilancia</option>
                <option value="Transporte">Transporte</option>
              </select>
            ) : null}
            <input
              type="text"
              className="form-control mb-3 mt-3"
              placeholder="Ingrese la ubicación"
              onChange={(e) => setUbicacion(e.target.value)}
              value={ubicacion}
            />
            <div className="">
              <textarea
                className="form-control mb-3"
                placeholder="Descripción de la solicitud"
                onChange={(e) => setDescripcion(e.target.value)}
                value={descripcion}
              ></textarea>
            </div>
            <div className="d-grid gap-2">
              {modoEdicion ? (
                <button className="btn btn-outline-warning" type="submit">
                  Editar consuta
                </button>
              ) : (
                <button className="btn btn-outline-info" type="submit">
                  Agregar petición
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="row mt-5 mb-5">
        <h2 className="text-center mb-5">Consulta</h2>
        <div className="col-12 ">
          <div className="col-12 d-flex gap-5 justify-content-around flex-wrap">
            {lista.map((elemento, index) => (
              <div className="card col-5 shadow-sm bg-body" key={elemento.id}>
                <div className="card-header text-center py-3">
                  SOLICITUD {index + 1}
                </div>
                <div className="list-group list-group-flush">
                  <div className="list-group-item">
                    <strong>Categoria: </strong>
                    {elemento.categoria}
                  </div>
                  <div className="list-group-item">
                    <strong>Tipo: </strong>
                    {elemento.tipo}
                  </div>
                  <div className="list-group-item">
                    <strong>Ubicación: </strong>
                    {elemento.ubicacion}
                  </div>
                  <div className="list-group-item">
                    <strong>Detalles: </strong>
                    {elemento.descripcion}
                  </div>
                  <div className="list-group-item">
                    <strong>Fecha solicitud: </strong>
                    {elemento.dataTime}
                  </div>

                  <div className="list-group-item d-flex gap-2 justify-content-center">
                    <button
                      onClick={() => eliminarDato(elemento.id)}
                      className="btn btn-danger  mx-2"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => editarDatos(elemento)}
                      className="btn btn-warning  mx-2"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registro;

