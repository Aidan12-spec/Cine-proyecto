$(document).ready(function () {

  // Punto 9: Alerta de bienvenida
if (!localStorage.getItem('bienvenidaVisto')) {
    alert("Bienvenido a CinePlus. Explore nuestra cartelera actualizada.");
    localStorage.setItem('bienvenidaVisto', 'true');
}
    const contenedor = $("#lista-peliculas");

    // Punto 5: Mostrar el Spinner de carga inmediatamente
    contenedor.html(`
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando cartelera de CinePlus...</p>
        </div>
    `);

    // Punto 5: Implementar el retraso artificial de 5 segundos
    setTimeout(function () {
        $.ajax({
            url: "data/peliculas.json",
            method: "GET",
            dataType: "json",
            success: function (peliculas) {
                let html = "";
                const hoy = new Date(); // Fecha actual para comparar

                peliculas.forEach(function (peli) {
                    // Parte 4 
                    const fechaEstreno = new Date(peli.estreno);

                    // Considerar el estreno si la fecha es mayor a hoy o fue hace menos de 30 días
                    const esEstreno = (hoy - fechaEstreno) / (1000 * 60 * 60 * 24) < 30;
                    
                    const precioActual = esEstreno ? peli.precios.estreno : peli.precios.normal;
                    const badgeClase = esEstreno ? "bg-danger" : "bg-success";
                    const badgeTexto = esEstreno ? "En Estreno" : "En Cartelera";

                    html += `
                    <div class="col-md-4 mb-4 tarjeta-peli" style="display:none;">
                        <div class="card h-100 shadow-sm">
                            <img src="img/${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge ${badgeClase}">${badgeTexto}</span>
                                    <span class="text-primary fw-bold">$${precioActual.toFixed(2)}</span>
                                </div>
                                <h5 class="card-title">${peli.titulo}</h5>
                                <p class="card-text text-muted small">${peli.generos.join(", ")}</p>
                                <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary w-100">Ver más detalles</a>
                            </div>
                        </div>
                    </div>`;
                });

                // Limpiar el spinner y poner las películas
                contenedor.html(html);

                // Punto 10: Aplicar animación fadeIn al mostrar
                $(".tarjeta-peli").fadeIn(1000);
            },
            error: function () {
                contenedor.html('<div class="alert alert-danger">Error al cargar las películas.</div>');
            }
        });
    }, 5000); 
});
  