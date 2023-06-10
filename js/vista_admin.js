import config from './supabase/config.js';

const Modelo = {

    async insertarDatosContenido(nombreAlquiler, huespedesSelect, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler) {
        const datos_insertar = {
            nombre_alquiler: nombreAlquiler,
            huespedes_alquiler: huespedesSelect,
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

    async eliminarAlquileres(idAlquiler) {
        const res = await axios({
            method: "DELETE",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?id=eq." + idAlquiler,
            headers: config.headers,
        });
        return res;
    },

    async modificarDatosAlquiler(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler) {
        const datos_modificar = {
            id: idAlquiler,
            nombre_alquiler: tituloAlquiler,
            huespedes_alquiler: huespedesSelect,
            baños_alquiler: bañosSelect,
            cocina_alquiler: cocinaSelect,
            disponibilidad_alquiler: disponibilidadAlquiler,
            descripcion_alquiler: descripcionAlquiler,
        }

        const res = await axios({
            method: "PATCH",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?id=eq." + idAlquiler,
            headers: config.headers,
            data: datos_modificar
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

    /* MODAL INSERTAR */
    async getDatosApartamentoModificar(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler) {
        try {

            const res = await Modelo.modificarDatosAlquiler(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler);
            console.log(res)
        } catch (err) {
            console.log(err);
        }
    },

    /* MODAL ELIMINAR */
    async eliminarDatosAlquiler(idAlquiler) {
        try {
            const res = await Modelo.eliminarAlquileres(idAlquiler);
            alert("Se elimino el registro");
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
            console.log(element.disponibilidad_alquiler)
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
                        <p class="casa__id" id = "idAlquiler">${element.id}</p>
                    </div>
                    
                </div>
      
                <div class="modal-cuerpo">
                    <div class="modal-cuerpo-imagen">
                        <img src="${element.imagen_alquiler}" id = "imagenAlquiler" alt="">
                    </div>
                          
                    <div class="modal-cuerpo-contenido">
                        <div class="principal">
                            <div class="titulo-casa">
                                <p>Titulo</p>
                                <input type="text" id = "tituloAlquiler" class="titulo__casa" value = "${element.nombre_alquiler}">
                            </div>
                        </div>
                        <div class="secundario">
                            <div class="disponibilidad-casa">
                                <p>Disponibilidad</p>
                                <select name="cars" id="disponibilidadSelect">
                                    <option selected="selected">${element.disponibilidad_alquiler}</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="No disponible">No disponible</option>
                                </select>
                            </div>

                            <div class="huespedes-casa">
                                <p>Huespedes</p>
                                <select name="cars" id="huespedesSelect">
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
                                <p>Baños</p>
                                <select name="cars" id="bañosSelect">
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
                                <select name="cars" id="cocinaSelect">
                                    <option selected="selected">${element.cocina_alquiler}</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>


                        <div class="terceario">
                            <div class="descripcion-casa">
                                <p>Descripción</p>
                                <textarea name="" id="descripcionAlquiler" cols="60" rows="3" >${element.descripcion_alquiler}</textarea>
                            </div>
                        </div>



                    </div>
                </div>

      
              <div class="modal-pie">
                <button id="btnEditarDatosModal">Editar</button>
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
                // Obtén el botón de cerrar modal y agrega el evento de clic
                const botonCerrarModal = modal.querySelector('#cerrarModal');
                botonCerrarModal.addEventListener('click', () => {
                    modal.style.display = 'none';
                });

                const btnEliminarDatosModal = document.getElementById('btnEliminarDatosModal');

                btnEliminarDatosModal.addEventListener('click', () => {
                    const idAlquiler = document.getElementById('idAlquiler').textContent;
                    Controlador.eliminarDatosAlquiler(idAlquiler);
                })

                const btnEditarDatosModal = document.getElementById('btnEditarDatosModal')

                btnEditarDatosModal.addEventListener('click', () => {
                    const idAlquiler = document.getElementById('idAlquiler').textContent;
                    const tituloAlquiler = document.getElementById('tituloAlquiler').value;
                    const disponibilidadAlquiler = document.getElementById('disponibilidadSelect').value;
                    const bañosSelect = document.getElementById('bañosSelect').value;
                    const huespedesSelect = document.getElementById('huespedesSelect').value;
                    const cocinaSelect = document.getElementById("cocinaSelect").value;
                    const descripcionAlquiler = document.getElementById("descripcionAlquiler").value;

                    Controlador.getDatosApartamentoModificar(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler);

                })
            });

            listaAlquileres.append(contenido);
        };


    },
}



document.addEventListener('DOMContentLoaded', function () {
    Controlador.obtenerTodosAlquileres();
    Controlador.transitionSmooth();
})