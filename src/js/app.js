
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const  { servicios } = db;

        // Generar HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

           // DOM Scripting
           // Generar nombre del servicio
           const nombreServicio = document.createElement('P');
           nombreServicio.textContent = nombre;
           nombreServicio.classList.add('nombre-servicio');

           // Generar precio del servicio
           precioServicio = document.createElement('P');
           precioServicio.textContent = `$ ${precio}`;
           precioServicio.classList.add('precio-servicio')

           // Generar div contenedor servicio
           const servicioDiv = document.createElement('DIV')
            servicioDiv.classList.add('servicio');

            // Seleccionar servicios
            servicioDiv.onclick = seleccionarServicio;

            // Agregar precio y nombre al contenedor
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Agregar al HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    // Forzar que el elemento al cual damos click sea el DIV
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
}