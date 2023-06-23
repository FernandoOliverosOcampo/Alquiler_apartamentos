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
      Vista.mostrarPropiedades(response.data);
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
  },

  transitionSmooth: function () {
    // Espera a que se cargue el DOM
    // Obtiene todos los elementos con la clase 'smooth-scroll'
    var smoothScrollLinks = document.getElementsByClassName('smooth-scroll');

    // Itera sobre los enlaces
    for (var i = 0; i < smoothScrollLinks.length; i++) {
      // Agrega un evento de clic a cada enlace
      smoothScrollLinks[i].addEventListener('click', function (event) {
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

  btn_whatsapp: function () {
    var chatCircle = document.getElementById("chat-circle");
    var chatBox = document.getElementById("chat-box");
    var chatBoxToggle = document.getElementById("chat-box-toggle");

    chatCircle.addEventListener("click", function () {
      chatBox.style.display = "block";
    });

    chatBoxToggle.addEventListener("click", function () {
      chatBox.style.display = "none";
    });


  },

  slider_lugar: function () {

    var swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      slidesPerView: 1,
      spaceBetween: 10,
      // init: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },


      breakpoints: {
        620: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        680: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        920: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        1240: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
      }
    });
  },

  disponibilidad_alquiler: function (disponibilidad) {
    if (disponibilidad == "Disponible") {
      return "alquiler-disponible";
    } else {
      return "alquiler-no-disponible";
    }
  },

  separar_imagenes: function (imagenesACortar) {
    let imagenesCortadas = imagenesACortar.split(",");
    return imagenesCortadas
  },


}



const Vista = {

  crearTarjetaCasa: function (element, i, imagenesCortadas) {
    const contenidoAlquileres = document.createElement('div');
    contenidoAlquileres.innerHTML = `
    <div class="casa">

    <div class="casa-imagen">
      <div class="${Controlador.disponibilidad_alquiler(element.disponibilidad_alquiler)}">${element.disponibilidad_alquiler}</div>
      <div id="casaImagenes-${i}" class="casa-imagenes-slider"></div>
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
            <button id="btnAbrirModal" class="btn-mas-informacion-casas">Mas información</button>
        </div>

    </div>
  </div>
    `;

    //Se agregan todas las imagenes a .casa-imagenes-slider (creado anteriormente)
    const imagenesContainer = contenidoAlquileres.querySelector(`#casaImagenes-${i}`);
    this.agregarImagenesCasa(imagenesCortadas, imagenesContainer)
    return contenidoAlquileres;
  },

  agregarImagenesCasa: function (imagenesCortadas, imagenesContainer) {
    for (let index = 0; index < imagenesCortadas.length; index++) {
      const imagen = document.createElement('img');
      imagen.src = imagenesCortadas[index];
      imagen.className = "casa__imagen";
      imagenesContainer.appendChild(imagen);
    }
  },

  llenarModal: function (element) {
    // Aquí puedes llenar el contenido del modal con la información específica
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-contenido');

    modalContent.innerHTML = `
        <div class="modal-cabecera">
          <span class="btn-cerrar-modal cerrar-modal-informacion" id="cerrarModal">&times;</span>
        </div>
    
        <div class="modal-cuerpo">
          <div class="modal-cuerpo-imagen" id="modalImagenes">
            <!-- Agrega un contenedor para el slider -->
            <div class="modal-imagenes-slider"></div>
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
        <a href="https://wa.me/573152702656" target="_blank"><button id="btnContactoDatosModal">Contactar</button></a>
        </div>
    `;
    return modalContent
  },

  abrirModal: function(){
    modal.style.display = 'block';
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  },

  cerrarModal: function(){
    const botonCerrarModal = modal.querySelector('#cerrarModal');
    botonCerrarModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  },

  agregarImagenesModal: function (imagenesContainer, imagenesSeparadas) {
    // Agrega las imágenes al contenedor del slider
    for (let index = 0; index < imagenesSeparadas.length; index++) {
      const imagen = document.createElement('img');
      imagen.src = imagenesSeparadas[index];
      imagen.className = "casa__imagen";
      imagenesContainer.appendChild(imagen);
    }
  },

  carrouselImagenes: function (container) {
    tns({
      container: container,
      items: 1,
      slideBy: "page",
      mouseDrag: true,
      swipeAngle: false,
      speed: 400,
      nav: true,
      controls: false,
      navPosition: "bottom"
    });
    return tns
  },

  mostrarPropiedades: function (data) {

    //Contenedor donde se mostrarán las imagenes
    const contenidoAlquileres = document.getElementById("contenidoAlquileres");

    //Muestra solamente 6 alquileres en la seccion de contenedor-alquileres
    for (let i = 0; i < 6 && i < data.length; i++) {
      const element = data[i];

      //Se guardan todas las imagenes
      let imaganesPorSeparar = data[i].imagen_alquiler;

      //Se retorna todas las imagenes separadas dentro de un array
      let imagenesSeparadas = Controlador.separar_imagenes(imaganesPorSeparar)

      //crea toda la estructura de la casa incluyendo el botón que abre el modal (ventana emergente)
      const contenidoPropiedad = this.crearTarjetaCasa(element, i, imagenesSeparadas);

      //Busca el botón que abre el modal (creado dentro de la estructura de la casa)
      const botonAbrirModal = contenidoPropiedad.querySelector('.btn-mas-informacion-casas');

      botonAbrirModal.addEventListener('click', () => {
        const modalContent = this.llenarModal(element);
        const imagenesModal = modalContent.querySelector('.modal-imagenes-slider');
        this.agregarImagenesModal(imagenesModal, imagenesSeparadas);

        // Inicializa el slider
        this.carrouselImagenes(imagenesModal);

        // Abre el modal
        this.abrirModal();

        // Obtén el botón de cerrar modal y agrega el evento de clic
        this.cerrarModal();
        
      });

      contenidoAlquileres.append(contenidoPropiedad);
    }

    const sliders = document.querySelectorAll('.casa-imagenes-slider');
    sliders.forEach((imagenesPropiedades) => {
      this.carrouselImagenes(imagenesPropiedades);
    });
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
  Controlador.transitionSmooth();
  Controlador.btn_whatsapp();
  Controlador.slider_lugar();
})

