import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { db } from "../firebase";

const GestionLibros = (props) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [lista, setLista] = useState([]);
  const [dataTime, setDataTime] = useState(new Date().toLocaleDateString());

  useEffect(() => {
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
    setTitulo(elemento.titulo);
    setAutor(elemento.autor);
    setDescripcion(elemento.descripcion);
    setId(elemento.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (titulo.trim().length === 0) {
      setError("Ingrese un título.");
    } else if (autor.trim().length === 0) {
      setError("Ingrese el nombre del autor.");
    } else if (descripcion.trim().length === 0) {
      setError("Ingrese una descripción.");
    } else {
      try {
        setDataTime(new Date().toLocaleDateString());
        await db
          .collection(props.user.email)
          .doc(id)
          .update({
            titulo,
            autor,
            descripcion,
            dataTime,
          });
        const listaEditada = lista.map((elemento) =>
          elemento.id === id
            ? {
                id: id,
                titulo: titulo,
                autor: autor,
                descripcion: descripcion,
                dataTime: dataTime,
              }
            : elemento
        );
        setLista(listaEditada);
        setTitulo("");
        setAutor("");
        setDescripcion("");
        setError(null);
        setDataTime(new Date().toLocaleDateString());
        setModoEdicion(false);
        swal({
          icon: "success",
          title: "El libro ha sido editado con éxito.",
          timer: 3000,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const agregarDatos = async (e) => {
    e.preventDefault();
    if (titulo.trim().length === 0) {
      setError("Ingrese un título.");
    } else if (autor.trim().length === 0) {
      setError("Ingrese el nombre del autor.");
    } else if (descripcion.trim().length === 0) {
      setError("Ingrese una descripción.");
    } else {
      try {
        setDataTime(new Date().toLocaleDateString());
        const nuevoLibro = {
          titulo,
          autor,
          descripcion,
          dataTime,
        };

        for (let index = 0; index < lista.length; index++) {
          if (
            titulo === lista[index].titulo &&
            autor === lista[index].autor &&
            descripcion === lista[index].descripcion
          ) {
            swal({
              title: "Este libro ya existe.",
              icon: "error",
              timer: 5000,
            });
            return;
          }
        }

        const data = await db.collection(props.user.email).add(nuevoLibro);
        setLista([...lista, { id: data.id, ...nuevoLibro }]);
        setTitulo("");
        setAutor("");
        setDescripcion("");
        setError(null);
        setDataTime(new Date().toLocaleDateString());
        swal({
          icon: "success",
          title: "El libro ha sido agregado con éxito.",
          timer: 3000,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const eliminar = async (id) => {
    try {
      await db.collection(props.user.email).doc(id).delete();
      const listaFiltrada = lista.filter((elemento) => elemento.id !== id);
      setLista(listaFiltrada);
      swal({
        icon: "success",
        title: "El libro ha sido eliminado con éxito.",
        timer: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Gestión de Libros</h1>
      <form onSubmit={modoEdicion ? editar : agregarDatos}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
        {error && <p>{error}</p>}
        <button type="submit">
          {modoEdicion ? "Editar Libro" : "Agregar Libro"}
        </button>
      </form>
      <ul>
        {lista.map((libro) => (
          <li key={libro.id}>
            <h2>{libro.titulo}</h2>
            <h3>{libro.autor}</h3>
            <p>{libro.descripcion}</p>
            <p>{libro.dataTime}</p>
            <button onClick={() => editarDatos(libro)}>Editar</button>
            <button onClick={() => eliminar(libro.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Registro;

