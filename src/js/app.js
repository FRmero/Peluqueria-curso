let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta div actual según el tab que se presiona
    mostrarSeccion();

    // Oculta o muestra una sección según al tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba página actual para ocultar la paginación
    botonesPaginador();

}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    

    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    

    // Resalta tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`); // Va entre corchetes porque es un atributo
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

/* Servicios */
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
            servicioDiv.onclick = seleccionarServicio; //onclick es un eventhandler. Se utiliza mayormente en código creado en JS, mientras que addeventlistener en código ya existente.

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
       elemento = e.target;
    }

   if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    } 
}

/* Paginacion */
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1 ) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}