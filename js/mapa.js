var map = L.map('map').setView([11.2404, -74.2110], 14); // Coordenadas de Santa Marta, Colombia y nivel de zoom inicial

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

var marker = L.marker([11.240932, -74.199671]).addTo(map); // Coordenadas de la Catedral de Santa Marta

marker.bindPopup("<b>Catedral de Santa Marta</b><br>¡Bienvenido!").openPopup();