import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { firebase } from './firebase';

function App() {
  //hooks
  const [Lista, setLista] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [id, setId] = useState('');
  const [modoedicion, setModoedicion] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  // Leer datos
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection('usuarios').get();
        const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLista(arrayData);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerDatos();
  }, []);

  // Guardar datos
  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!nombre) {
      setError('Ingrese el Nombre');
      return;
    }
    if (!apellido) {
      setError('Ingrese el Apellido');
      return;
    }
    // Registrar en Firebase
    try {
      const db = firebase.firestore();
      const nuevoUsuario = { nombre, apellido };
      const dato = await db.collection('usuarios').add(nuevoUsuario);
      setLista([...Lista, { ...nuevoUsuario, id: dato.id }]);
      setNombre('');
      setApellido('');
      setError(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar dato
  const eliminarDato = async (id) => {
    if (modoedicion) {
      setError('No puede eliminar mientras se edita el usuario');
      return;
    }
    try {
      const db = firebase.firestore();
      await db.collection('usuarios').doc(id).delete();
      const listaFiltrada = Lista.filter((elemento) => elemento.id !== id);
      setLista(listaFiltrada);
    } catch (error) {
      console.error(error);
    }
  };

  // Editar
  const editar = (elemento) => {
    setModoedicion(true); // Activamos el modo edición
    setNombre(elemento.nombre);
    setApellido(elemento.apellido);
    setId(elemento.id);
    inputRef.current.focus();
  };

  // Editar datos
  const editarDatos = async (e) => {
    e.preventDefault();
    if (!nombre) {
      setError('Ingrese el Nombre');
      return;
    }
    if (!apellido) {
      setError('Ingrese el Apellido');
      return;
    }
    try {
      const db = firebase.firestore();
      await db.collection('usuarios').doc(id).update({
        nombre,
        apellido,
      });
      const listaEditada = Lista.map((elemento) =>
        elemento.id === id ? { id, nombre, apellido } : elemento
      );
      setLista(listaEditada); // Listamos nuevos valores
      setModoedicion(false);
      setNombre('');
      setApellido('');
      setId('');
      setError(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      {modoedicion ? (
        <h2>Modo edición</h2>
      ) : (
        <h2>Registro de usuario</h2>
      )}
      <.
      {error && <div className="alert">{error}</div>}
      <form onSubmit={modoedicion ? editarDatos : guardarDatos}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          ref={inputRef}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <button type="submit">
          {modoedicion ? 'Editar Usuario' : 'Agregar Usuario'}
        </button>
      </form>
      <div className="lista">
        {Lista.map((elemento) => (
          <div key={elemento.id} className="elemento">
            <div>
              <strong>Nombre:</strong> {elemento.nombre}
            </div>
            <div>
              <strong>Apellido:</strong> {elemento.apellido}
            </div>
            <div className="acciones">
              <button onClick={() => eliminarDato(elemento.id)}>
                Eliminar
              </button>
              <button onClick={() => editar(elemento)}>Editar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="logos">
        <img src={reactLogo} alt="React" />
        <img src={viteLogo} alt="Vite" />
      </div>
    </div>
  );
}

export default App;

