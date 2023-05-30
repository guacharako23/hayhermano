import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {firebase} from './firebase'
import React from 'react'

function App() {
    //hooks
    const [Lista,setLista]=React.useState([])
    const [nombre,setNombre]=React.useState('')
    const [apellido,setApellido]=React.useState('')
    const [id,setId]=React.useState('')
    const [modoedicion,setModoedicion]=React.useState(false)
    const [error,setError]=React.useState(null)
    //Leer datos
    React.useEffect(()=>{
      const obtenerDatos=async()=>{
        try{
          const db=firebase.firestore()
          const data=await db.collection('usuarios').get()
          //console.log(data.docs);
          const arrayData=data.docs.map(doc=>({id:doc.id,...doc.data()}))
          setLista(arrayData)
        } catch (error){
          console.error(error);
        }

      }
      obtenerDatos()
    },[])

    //guardar
    const guardarDatos=async(e)=>{
      e.preventDefault()
      if(!nombre){
        setError("Ingrese el Nombre")
        return
      }
      if(!apellido){
        setError("Ingrese el Apellido")
        return
      }
      //registrar en firebase
      try {
        const db=firebase.firestore()
        const nuevoUsuario={nombre,apellido}
        const dato=await db.collection('usuarios').add(nuevoUsuario)
        setLista([
          ...Lista,
          {...nuevoUsuario,id:dato.id}
        ])
        setNombre('')
        setApellido('')
        setError(null)

      }
      catch (error){
        console.error(error);
      }
    }

    //Eliminar
    
    const eliminarDato=async(id)=>{
      if (modoedicion){
        setError('No puede eliminar mientras se edita el usuario')
        return
      }
      try {
        const db=firebase.firestore()
        await db.collection('usuarios').doc(id).delete()
        const listaFiltrada=Lista.filter(elemento=>elemento.id!==id)
        setLista(listaFiltrada)
      }
      catch (error){
        console.error(error);
      }
      
    }

    //editar
    const editar=(elemento)=>{
      setModoedicion(true)//activamos el modo edicion
      setNombre(elemento.nombre)
      setApellido(elemento.apellido)
      setId(elemento.id)
    }

    //editar datos
    const editarDatos=async(e)=>{
    e.preventDefault()
    if(!nombre){
      setError("Ingrese el Nombre")
      return
    }
    if(!apellido){
      setError("Ingrese el Apellido")
      return
    }   
    try {
      const db=firebase.firestore()
      await db.collection('usuarios').doc(id).update({
        nombre,apellido
      })
      const listaEditada=Lista.map(elemento=>elemento.id===id ? {id,nombre,apellido} :
        elemento
        )
        setLista(listaEditada)//listamos nuevos valores
        setModoedicion(false)
        setNombre('')
        setApellido('')
        setId('')
        setError(null)

    }
    catch (error){
      console.error(error);
    }
    


    }
  return (
    <div className='container'>
       {
      modoedicion ? <h2 className='text-center text-success'>Editando Usuario</h2> :
      <h2 className='text-center text-primary'>Registro de Usuarios</h2>
      }
         
      <form onSubmit={modoedicion ? editarDatos : guardarDatos}>
        {
          error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>  
          ):
          null
        }
      
      <input type="text"
      placeholder='Ingrese el Nombre'
      className='form-control mb-2'
      onChange={(e)=>{setNombre(e.target.value.trim())}}
      value={nombre}
      
      />  
      <input type="text"
      placeholder='Ingrese el Apellido'
      className='form-control mb-2'
      onChange={(e)=>{setApellido(e.target.value.trim())}}
      value={apellido}
      />  
      <div className='d-grid gap-2'>
        {
          modoedicion ? <button type='submit' className='btn btn-outline-success'>Editar</button> :   
          <button type='submit' className='btn btn-outline-info'>Registrar</button>    
        }
         
      </div>
      
      
      </form> 
      <h2 className='text-center text-primary'>Listado de Ususarios Registrados</h2>
      <ul className='list-group'>
        {
          Lista.map(
            (elemento)=>(
              <li className='list-group-item bg-info' key={elemento.id}>{elemento.nombre} {elemento.apellido} 
              <button 
              onClick={()=>eliminarDato(elemento.id)}
              className='btn btn-danger float-end me-2'>Eliminar</button>
              <button 
              onClick={()=>editar(elemento)}
              className='btn btn-warning float-end me-2'>Editar</button>
              </li>
            )

          )
        }

      </ul>


   
    </div>
  )
}

export default App
