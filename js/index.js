import config from './supabase/config.js';

const Modelo = {

  async insertarDatosContenido(nombreAlquiler, huespedesAlquiler, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler) {
    const datos_insertar = {
      nombre_alquiler: nombreAlquiler,
      huespedes_alquiler: huespedesAlquiler,
      baños_alquiler: bañosAlquiler,
      cocina_alquiler: cocinaAlquiler,
      descripcion_alquiler: descripcionAlquiler,
      imagen_alquiler: imagenAlquiler
    }

    console.log(datos_insertar)

    const res = await axios({
      method: "POST",
      url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres",
      data: datos_insertar,
      headers: config.headers
    });
    return res;
  },

  async mostrarTodosAlquileres() {

    const res = await axios({
      method: "GET",
      url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?select=*`,
      headers: config.headers,
    });
    return res;
  },


}

const Controlador = {

  /* Agregar contenido */
  async mostrarContenidoAgregar() {
    const { nombreAlquiler, huespedesAlquiler, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler } = Vista.getDatosContenidoAgregar();
    try {

      const res = await Modelo.insertarDatosContenido(nombreAlquiler, huespedesAlquiler, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler);

    } catch (err) {
      Vista.mostrarMensajeError(err);
    }
  },

  async obtenerTodosAlquileres() {
    try {
      const response = await Modelo.mostrarTodosAlquileres();
      console.log(response.data);
      Vista.mostrarInfoContenido(response.data);
    } catch (err) {
      console.log(err);
      Vista.mostrarMensajeError(err);
    }
  },

  mostrarMapas: function () {
    var map = L.map('map').setView([11.2404, -74.2110], 18); // Coordenadas de Santa Marta, Colombia y nivel de zoom inicial

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 25,
    }).addTo(map);
    
    var marker = L.marker([11.240932, -74.199671]).addTo(map); // Coordenadas de la Catedral de Santa Marta
    
    marker.bindPopup("<b>Catedral de Santa Marta</b><br>¡Bienvenido!").openPopup();
  }
}

const Vista = {

  mostrarInfoContenido: function (data) {

    for (let i = 0; i < 4 && i < data.length; i++) {
      const element = data[i];

      const contenido = document.createElement('div');
      const contenidoAlquileres = document.getElementById("contenidoAlquileres");
      contenido.innerHTML = `
      <div class="casa">

      <div class="casa-imagen">
          <div class="top-right">Disponible</div>
          <img src="${element.imagen_alquiler}" class = "casa__imagen" alt="">
      </div>
      <div class="casa-contenido">
          <div class="casa-titulo">
              <p class="casa__titulo">${element.nombre_alquiler}</p>
          </div>

          <div class="casa-info">
              <p>${element.huespedes_alquiler} Huespedes</p>
              <p>${element.cocina_alquiler} Cocina</p>
              <p>${element.baños_alquiler} Baño</p>
          </div>

          <div class="casa-boton">
              <button id="btnAbrirModal" class="boton-1">Mas información</button>
          </div>

      </div>
    </div>
      `;

      const botonAbrirModal = contenido.querySelector('.boton-1');
      botonAbrirModal.addEventListener('click', () => {
        // Aquí puedes llenar el contenido del modal con la información específica
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-contenido');
        modalContent.innerHTML = `
        <div class="modal-cabecera">
          <span class="btn-cerrar-modal cerrar-modal-informacion" id ="cerrarModal">&times;</span>
        </div>

        <div class="modal-cuerpo">
          <div class="modal-cuerpo-imagen">
             <img src="${element.imagen_alquiler}" alt="">
          </div>

          <div class="modal-detalles">
            <div class="detalles">
              <p class="descripcion"><i class="fa-solid fa-bed"></i> Huespedes: ${element.huespedes_alquiler}</p>
              <p class="descripcion"><i class="fa-solid fa-toilet"></i> Baños: ${element.baños_alquiler}</p>
              <p class="descripcion"><i class="fa-solid fa-kitchen-set"></i> Cocina: ${element.cocina_alquiler}</p>

            </div>
          </div>

          <div class="modal-cuerpo-contenido">
            <div class="modal-titulo">
              <h2 class="modal__titulo">${element.nombre_alquiler}</h2>
            </div>

            <div class="descripcion-casa">
              <p>Descripcion:</p>
              <p class="descripcion-casa__texto">${element.descripcion_alquiler}</p>                     
            </div>
          </div>
        </div>

        <div class="modal-pie">
          <button id="btnEliminarDatosModal">Contactar</button>
      </div>
        `;

        // Abre el modal
        modal.style.display = 'block';
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

      });

      contenidoAlquileres.append(contenido);
    };


  },
  /* PAGINA PRINCIPAL */

  getDatosContenidoAgregar: function () {
    const nombreAlquiler = document.getElementById('nombreAlquiler').value;
    const huespedesAlquiler = document.getElementById('huespedesAlquiler').value;
    const bañosAlquiler = document.getElementById('bañosAlquiler').value;
    const cocinaAlquiler = document.getElementById('cocinaAlquiler').value;
    const descripcionAlquiler = document.getElementById('descripcionAlquiler').value;
    const imagenAlquiler = document.getElementById('imagenAlquiler').value;

    return { nombreAlquiler, huespedesAlquiler, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler };
  },

  /* MENSAJES DE ERRORES */
  mostrarMensajeError(mensaje) {
    console.log(mensaje);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  Controlador.mostrarMapas();
  Controlador.obtenerTodosAlquileres();
})