import config from './supabase/config.js';

const Modelo = {

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
  transitionSmooth: function() {
    // Espera a que se cargue el DOM
  // Obtiene todos los elementos con la clase 'smooth-scroll'
  var smoothScrollLinks = document.getElementsByClassName('smooth-scroll');
  
  // Itera sobre los enlaces
  for (var i = 0; i < smoothScrollLinks.length; i++) {
    // Agrega un evento de clic a cada enlace
    smoothScrollLinks[i].addEventListener('click', function(event) {
      event.preventDefault(); // Evita el comportamiento predeterminado del enlace
      
      // Obtiene el destino del enlace a través del atributo href
      var target = this.getAttribute('href');
      
      // Utiliza el método 'scrollIntoView' para desplazarse suavemente hacia el destino
      document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
  },
  btn_whatsapp:function(){
    var chatCircle = document.getElementById("chat-circle");
    var chatBox = document.getElementById("chat-box");
    var chatBoxToggle = document.getElementById("chat-box-toggle");
    
    chatCircle.addEventListener("click", function() {
        chatBox.style.display = "block";
    });
    
    chatBoxToggle.addEventListener("click", function() {
        chatBox.style.display = "none";
    });
    

  }
  
}

const Vista = {

  mostrarInfoContenido: function (data) {

    data.forEach(element => {
      const contenido = document.createElement('div');
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
          <span class="btn-cerrar-modal cerrar-modal-informacion"id ="cerrarModal">&times;</span>
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
          // Obtén el botón de cerrar modal y agrega el evento de clic
          const botonCerrarModal = modal.querySelector('#cerrarModal');
          botonCerrarModal.addEventListener('click', () => {
              modal.style.display = 'none';
          });

      });

      listaAlquileres.append(contenido);
    });
    

  },
  /* MENSAJES DE ERRORES */
  mostrarMensajeError(mensaje) {
    console.log(mensaje);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  Controlador.obtenerTodosAlquileres();
  Controlador.transitionSmooth();
  Controlador.btn_whatsapp();
})

  