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
      setError("Por Favor Indique su Solicitud.");
    } else if (tipo === "") {
      setError("Selecciona que necesidad tienes.");
    } else if (ubicacion.trim().length === 0) {
      setError(
        "Indique Como quiere obtener el libro consultado."
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
      setError("Por Favor Indique su Solicitud.");
    } else if (tipo === "") {
      setError("Selecciona que necesidad tienes.");
    } else if (ubicacion.trim().length === 0) {
      setError(
        "Indique Como quiere obtener el libro consultado."
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
      title: "¿Seguro que deseas borrar esto",
      text: "¡Una vez borrado no hay marcha atras!",
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
          title: "¡Su solicitud ha sido borrada y no podra recuperar!",
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
                LIBROS FISICOS
              </option>
              <option value="Mantenimiento de muebles">
                LIBROS DIGITALES
              </option>
              <option value="Servicio">COMICS, REVISTAS</option>
            </select>
            {categoria === "" ? (
              <div className="alert alert-light text-center" role="alert">
                ¡Seleccione una categoría primero!
              </div>
            ) : null}
            {categoria === "LIBROS FISICOS" ? (
              <select
                name="LIBROS FISICOSs"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="Primeras Ediciones">Primeras Edicioens</option>
                <option value="Literatura">Literatura</option>
                <option value="De consulta y Referencia">De consulta y Referencia</option>
                <option value="Tecnicos y Especializados">Tecnicos y Especializados</option>
                <option value="Religiosos y Sagrados">Religiosos y Sagrados</option>
              </select>
            ) : null}
            {categoria === "Libros Digitales" ? (
              <select
                name="Libros Digitales"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="E-book">E-book</option>
                <option value="Digital Interactivo">Digital Interactivo</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
              </select>
            ) : null}
            {categoria === "COMICS, REVISTAS" ? (
              <select
                name="COMICS, REVISTAS"
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setTipo(e.target.value)}
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="Documento Cientifico">Documento Cientifico</option>
                <option value="Comics">comics</option>
                <option value="Articulos Investigativo">Articulos Investigativo</option>
              </select>
            ) : null}
            <input
              type="text"
              className="form-control mb-3 mt-3"
              placeholder="Ingrese la ubicaion"
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
                  Agregar ubicacion
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

