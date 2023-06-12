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

    async eliminarAlquileres(idAlquiler) {
        const res = await axios({
            method: "DELETE",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?id=eq." + idAlquiler,
            headers: config.headers,
        });
        return res;
    },

    async obtenerImagenIdPorUrl(imagenes) {

        const body = []


        for (const imagenUrl of imagenes) {

            try {
                const response = await axios({
                    method: "GET",
                    url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/imagenes?imagen_url=eq.${imagenUrl}`,
                    headers: config.headers,
                });
                const registros = response.data;
                console.log(registros)
                for (let index = 0; index < registros.length; index++) {
                    body.push(registros[index].id_imagenes);   
                }

            } catch (error) {
                console.error(error);
                return null;
            }
        }

        return body;

    },

    async obtenerCasaIdPorUrl(tituloAlquiler) {

        try {

            const response = await axios({
                method: "GET",
                url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?nombre_alquiler=eq.${tituloAlquiler}`,
                headers: config.headers,
            });

            const registros = response.data;

            console.log(registros)

            if (registros.length > 0) {
                return registros[0].id;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },


    async insertarImagenes(imagenes) {

        const imagenIds = [];

        for (const imagenUrl of imagenes) {

            const body = {
                imagen_url: imagenUrl
            }

            try {
                const response = await axios({
                    method: "POST",
                    url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/imagenes",
                    headers: config.headers,
                    data: body
                });
            } catch (error) {
                console.error(error);
                // Si ocurre un error al insertar una imagen, puedes manejarlo según tus necesidades
                // Por ejemplo, podrías lanzar una excepción y deshacer las inserciones anteriores
            }
        }
        return imagenIds;
    },



    async insertarDatosAlquiler(tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler, imagenUrls) {

        await Modelo.insertarImagenes(imagenUrls);

        const datos_insertar = {
            nombre_alquiler: tituloAlquiler,
            huespedes_alquiler: huespedesSelect,
            baños_alquiler: bañosSelect,
            cocina_alquiler: cocinaSelect,
            disponibilidad_alquiler: disponibilidadAlquiler,
            descripcion_alquiler: descripcionAlquiler,
        }

        const res = await axios({
            method: "POST",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres",
            headers: config.headers,
            data: datos_insertar
        });

        const casaId = await Modelo.obtenerCasaIdPorUrl(tituloAlquiler);
        const imagenIds = await Modelo.obtenerImagenIdPorUrl(imagenUrls);
        console.log("eSTA ES LA ID DE LA CASA", casaId);
        console.log("eSTA ES LA ID DE LA IMAGEN", imagenIds);

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

    async getDatosApartamentoModificar(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler) {
        try {
            const res = await Modelo.modificarDatosAlquiler(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler);
            let mensaje = "Los datos fueron modificados"
            Vista.mostrarAlertaSatisfactorio(mensaje);
        } catch (err) {
            console.log(err);
        }
    },

    async insertarImagenes(imagenes) {

        try {
            const response_img = await Modelo.insertarImagenes(imagenes);
            console.log(response_img)
        } catch (err) {
            console.log(err);
        }
    },

    async insertarAlquiler(tituloAlquilerInsertar, huespedesSelectInsertar, bañosSelectInsertar, cocinaSelectInsertar, disponibilidadAlquilerInsertar, descripcionAlquilerInsertar, imagenes) {

        try {
            //const response_img = await Modelo.insertarDatosAlquiler(imagenAlquiler1, imagenAlquiler2, imagenAlquiler3);

            const res = await Modelo.insertarDatosAlquiler(tituloAlquilerInsertar, huespedesSelectInsertar, bañosSelectInsertar, cocinaSelectInsertar, disponibilidadAlquilerInsertar, descripcionAlquilerInsertar, imagenes);

            let mensaje = "Los datos fueron insertados correctamente"
            Vista.mostrarAlertaSatisfactorio(mensaje);
            this.obtenerTodosAlquileres();
        } catch (err) {
            console.log(err);
        }
    },

    async eliminarDatosAlquiler(idAlquiler) {
        try {
            const res = await Modelo.eliminarAlquileres(idAlquiler);
            alert("Se elimino el registro");
        } catch (err) {
            console.log(err);
        }
    },

    abrirModalAgregar: function () {
        const modalAgregar = document.getElementById('modalAgregar');
        modalAgregar.style.display = 'block';
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
        const contenido = document.createElement('div');
        const listaAlquileres = document.getElementById("listaAlquileres");
        contenido.innerHTML = `
            <div class="agregar-casa">
                <button id="btnAgregar" class="boton-agregar">Agregar</button>
            </div>
            `;

        const botonAbrirModal = contenido.querySelector('.boton-agregar');
        botonAbrirModal.addEventListener('click', () => {
            // Aquí puedes llenar el contenido del modal con la información específica
            const modal = document.getElementById('modalAgregar');
            const modalContent = modal.querySelector('.modal-contenido');
            modalContent.innerHTML = `

                <div class="modal-cabecera">
                    <div class="modal-cabecera-boton">
                        <span class="btn-cerrar-modal cerrar-modal-informacion" id ="cerrarModal">&times;</span>
                    </div>

                    <div class="modal-cabecera-titulo">
                        <h2>Agregar nuevo alquiler</h2>
                    </div>
                    
                </div>
      
                <div class="modal-cuerpo">
                    <div class="modal-cuerpo-imagen">   
                        <div class="titulo-casa">
                            <p>Agregar imagenes URL</p>
                            <input type="text" id = "imagenAlquiler1" class="imagen__casa" value = "">
                            <input type="text" id = "imagenAlquiler2" class="imagen__casa" value = "">
                            <input type="text" id = "imagenAlquiler3" class="imagen__casa" value = "">
                        </div>
                    </div>
                          
                    <div class="modal-cuerpo-contenido">
                        <div class="principal">
                            <div class="titulo-casa">
                                <p>Titulo</p>
                                <input type="text" id = "tituloAlquiler" class="titulo__casa" value = "">
                            </div>
                        </div>
                        <div class="secundario">
                            <div class="disponibilidad-casa">
                            <p>Disponibilidad</p>
                            <select name="cars" id="disponibilidadSelect">
                                <option selected="selected"></option>
                                <option value="Disponible">Disponible</option>
                                <option value="No disponible">No disponible</option>
                            </select>
                        </div>

                        <div class="huespedes-casa">
                            <p>Huespedes</p>
                            <select name="cars" id="huespedesSelect">
                                <option selected="selected"></option>
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
                                <option selected="selected"></option>
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
                                <option selected="selected"></option>
                                <option value="Si">Si</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        </div>
                        <div class="terceario">
                            <div class="descripcion-casa">
                                <p>Descripción</p>
                                <textarea name="" id="descripcionAlquiler" cols="60" rows="3" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

      
              <div class="modal-pie">
                <button id="btnInsertarDatosModal">Insertar</button> 
                <button id="btnEliminarDatosModal">Eliminar</button>

            </div>
            
                    `;
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


            const btnInsertarDatosModal = document.getElementById('btnInsertarDatosModal');

            btnInsertarDatosModal.addEventListener('click', () => {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: '¿Estás seguro?',
                    text: "Deseas ingresar los datos a la BD",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        const tituloAlquilerInsertar = document.getElementById('tituloAlquiler').value;
                        const imagenAlquiler1 = document.getElementById('imagenAlquiler1').value;
                        const imagenAlquiler2 = document.getElementById('imagenAlquiler2').value;
                        const imagenAlquiler3 = document.getElementById('imagenAlquiler3').value;
                        const disponibilidadAlquilerInsertar = document.getElementById('disponibilidadSelect').value;
                        const bañosSelectInsertar = document.getElementById('bañosSelect').value;
                        const huespedesSelectInsertar = document.getElementById('huespedesSelect').value;
                        const cocinaSelectInsertar = document.getElementById("cocinaSelect").value;
                        const descripcionAlquilerInsertar = document.getElementById("descripcionAlquiler").value;

                        const imagenes = [
                            document.getElementById('imagenAlquiler1').value,
                            document.getElementById('imagenAlquiler2').value,
                            document.getElementById('imagenAlquiler3').value
                        ];


                        //Controlador.insertarImagenes(imagenes)
                        Controlador.insertarAlquiler(tituloAlquilerInsertar, huespedesSelectInsertar, bañosSelectInsertar, cocinaSelectInsertar, disponibilidadAlquilerInsertar, descripcionAlquilerInsertar, imagenes);
                        modal.style.display = "none";
                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire(
                            'Cancelado',
                            'No se ha eliminado nada',
                            'error'
                        )
                    }
                })


            })

        })

        listaAlquileres.prepend(contenido);
        
        data.forEach(element => {
            
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

                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger'
                        },
                        buttonsStyling: false
                    })

                    swalWithBootstrapButtons.fire({
                        title: '¿Estás seguro?',
                        text: "Tu información va a ser eliminada",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Eliminar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            swalWithBootstrapButtons.fire(
                                'Borrado',
                                'El registro ha sido eliminado',
                                'success'
                            )
                            Controlador.eliminarDatosAlquiler(idAlquiler);
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            swalWithBootstrapButtons.fire(
                                'Cancelado',
                                'No se ha eliminado nada',
                                'error'
                            )
                        }
                    })
                })

                const btnEditarDatosModal = document.getElementById('btnEditarDatosModal')

                btnEditarDatosModal.addEventListener('click', () => {
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger'
                        },
                        buttonsStyling: false
                    })

                    swalWithBootstrapButtons.fire({
                        title: '¿Estás seguro?',
                        text: "El registro será modificado",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const idAlquiler = document.getElementById('idAlquiler').textContent;
                            const tituloAlquiler = document.getElementById('tituloAlquiler').value;
                            const disponibilidadAlquiler = document.getElementById('disponibilidadSelect').value;
                            const bañosSelect = document.getElementById('bañosSelect').value;
                            const huespedesSelect = document.getElementById('huespedesSelect').value;
                            const cocinaSelect = document.getElementById("cocinaSelect").value;
                            const descripcionAlquiler = document.getElementById("descripcionAlquiler").value;

                            Controlador.getDatosApartamentoModificar(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler);
                            modal.style.display = "none";
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            swalWithBootstrapButtons.fire(
                                'Cancelado',
                                'No se ha eliminado nada',
                                'error'
                            )
                        }
                    })


                })

            });

            listaAlquileres.append(contenido);
        });


    },

    mostrarMensajeError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Algo salió mal',
            text: mensaje,
        })
    },

    mostrarAlertaSatisfactorio(mensaje) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        })
    },
}



document.addEventListener('DOMContentLoaded', function () {
    Controlador.obtenerTodosAlquileres();
    Controlador.transitionSmooth();
})