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

    async obtenerTodosAlquileres() {
        try {
            const response = await Modelo.mostrarTodosAlquileres();
            Vista.mostrarInfoContenido(response.data);
        } catch (err) {
            console.log(err);
        }
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
    }
}

const Vista = {

    mostrarInfoContenido: function (data) {

        for (let i = 0; i < 4 && i < data.length; i++) {
            const element = data[i];
            if (element.disponibilidad_alquiler == "Disponible") {
                var clase_css_disponibilidad = "top-right";
            } else {
                var clase_css_disponibilidad = "top-right2";
            }

            const contenido = document.createElement('div');
            const listaAlquileres = document.getElementById("listaAlquileres");
            contenido.innerHTML = `
                <div class="casa">
                
                <div class="casa-imagen">
                    <div class="${clase_css_disponibilidad}">${element.disponibilidad_alquiler}</div>
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
                        <button id="btnEditarInformacion" class="boton-1">Editar</button>
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
                    <div class="modal-cabecera-boton">
                        <span class="btn-cerrar-modal cerrar-modal-informacion" id ="cerrarModal">&times;</span>
                    </div>

                    <div class="modal-cabecera-titulo">
                    <h2>Editar apartamento</h2>
                    </div>
                    
                </div>
      
                <div class="modal-cuerpo">
                    <div class="modal-cuerpo-imagen">
                        <img src="${element.imagen_alquiler}" alt="">
                    </div>
                          
                    <div class="modal-cuerpo-contenido">
                        <div class="principal">
                            <div class="titulo-casa">
                                <p>Titulo</p>
                                <input type="text" class="titulo__casa" value = "${element.nombre_alquiler}">
                            </div>
                        </div>
                        <div class="secundario">
                            <div class="disponibilidad-casa">
                                <p>Disponibilidad</p>
                                <select name="cars" id="cars">
                                <option selected="selected">${element.disponibilidad_alquiler}</option>
                                <option value="Si">Disponible</option>
                                <option value="No">No disponible</option>
                                </select>
                            </div>

                            <div class="huespedes-casa">
                                <p>Número de Huespedes</p>
                                <select name="cars" id="cars">
                                    <option selected="selected">${element.huespedes_alquiler}</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="mas">10 o más</option>
                                </select>
                            </div>

                            <div class="baños-casa">
                                <p>Número de baños</p>
                                <select name="cars" id="cars">
                                    <option selected="selected">${element.baños_alquiler}</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="mas">5 o más</option>
                                </select>
                            </div>

                            <div class="cocina-casa">
                                <p>Cocina</p>
                                <select name="cars" id="cars">
                                    <option selected="selected">${element.cocina_alquiler}</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>


                        <div class="terceario">
                            <div class="descripcion-casa">
                                <p>Descripción</p>
                                <textarea name="" id="" cols="60" rows="3">${element.descripcion_alquiler}</textarea>
                            </div>
                        </div>



                    </div>
                </div>

      
              <div class="modal-pie">
                <button id="btnEliminarDatosModal">Editar</button>
                <button id="btnEliminarDatosModal">Eliminar</button>

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

            listaAlquileres.append(contenido);
        };


    },
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.obtenerTodosAlquileres();
    Controlador.transitionSmooth();
})