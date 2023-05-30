import React from "react";
import imagenUno from './img/inicio1.png'

const Inicio = () => {
  return (
    <div className="div-inicio">
      <div className="container border shadow-sm p-3 mb-5 bg-body h-100 text-center">
        <div className="container">
          <h1 className="pt-2 text-center">Biblioteca CUC</h1>
        </div>
        <main className="container">
          <div>
            <p className="fs-5 text-secondary">
              Aquí puedes realizar las solicitudes de tus libros, reservas, solicitudes, prestamos y mas.
            </p>
          </div>
          <div>
            <h4 className="mt-4">MÁS DE 11 AÑOS DE EXPERIENCIA</h4>
            <p className="text-secondary">
              Potenciar el aprendizaje en los estudiantes y el ejercicio de la función docente e investigativa, 
              mediante el acceso efectivo a los recursos de información y la provisión de escenarios físicos y virtuales, 
              que respondan a los diferentes estilos de aprendizaje y que promueva la visibilidad académica y científica 
              generada en la Universidad.
    
    
              Ser el servicio académico de la Universidad de la Costa, más utilizado por la comunidad universitaria interna y externa.
            </p>
            <img className="m-5" src={imagenUno} alt="" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inicio;
