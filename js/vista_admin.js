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

            const contenido = document.createElement('div');
            const listaAlquileres = document.getElementById("listaAlquileres");
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
                        <button id="btnEditarInformacion" class="boton-1">Editar</button>
                    </div>

                </div>
                </div>
                `;

            const ventanaEditarInformacion = contenido.querySelector('.boton-1');
            ventanaEditarInformacion.addEventListener('click', () => {
                // Aquí puedes llenar el contenido del modal con la información específica
                const ventanaEditarInformacion = document.getElementById('ventanaEditarInformacion');
                console.log(ventanaEditarInformacion)
                const editarInformacionVentana = ventanaEditarInformacion.querySelector('.editar-informacion-datos');
                editarInformacionVentana.innerHTML = `
                    <div class="imagen-casa">
                        <img src="${element.imagen_alquiler}" alt="">
                    </div>

                    <div class="titulo-casa">
                        <p>Titulo</p>
                        <input type="text" class="titulo__casa" value = "${element.nombre_alquiler}">
                    </div>

                    <div class="huespedes-casa">
                        <p>Número de Huespedes</p>
                        <input type="text" class="huespedes__casa" value "${element.huespedes_alquiler}">
                    </div>

                    <div class="habitaciones-casa">
                        <p>Número de Habitaciones</p>
                        <select name="cars" id="cars">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="mas">5 o más</option>
                        </select>
                    </div>

                    <div class="descripcion-casa">
                        <p>Descripción</p>
                        <textarea name="" id="" cols="60" rows="5">${element.descripcion_alquiler}</textarea>
                    </div>
                    `;
            });

            listaAlquileres.append(contenido);
        };


    },
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.obtenerTodosAlquileres();
    Controlador.transitionSmooth();
})