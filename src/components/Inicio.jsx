import React from "react";
import imagenUno from './img/inicio1.png'

const Inicio = () => {
  return (
    <div className="div-inicio">
      <div className="container border shadow-sm p-3 mb-5 bg-body h-100 text-center">
        <div className="container">
          <h1 className="pt-2 text-center">Bienvenidos a mi App-Web</h1>
        </div>
        <main className="container">
          <div>
            <p className="fs-5 text-secondary">
              Aquí puedes realizar todas tus solicitudes de quejas, reportes y
              mantenimientos
            </p>
          </div>
          <div>
            <h4 className="mt-4">MÁS DE 11 AÑOS DE EXPERIENCIA</h4>
            <p className="text-secondary">
              Somos una empresa de aseo,
              limpieza, mantenimiento, desinfección y jardinería con experiencia
              en servicios especializados en el manejo integral de la propiedad
              horizontal a nivel nacional, desde el año de 2008. Trabajando con
              excelencia, calidad, compromiso y responsabilidad para con todos
              nuestros clientes a nivel residencial, comercial, empresarial y
              mixto, a través de todo el talento humano calificado y competente.
            </p>
            <img className="m-5" src={imagenUno} alt="" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inicio;
